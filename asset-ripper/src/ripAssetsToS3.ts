import { YouTubeVideo } from "./youtube/YouTubeVideo";
import { Workspace } from "./files/Workspace";
import * as S3 from "./util/S3";
import { recordThat } from "tp-events";
import { listFiles } from "./files/listFiles";
import path from "path";
import { VideoMetadata } from "./youtube/VideoMetadata";
import { sliceFrames } from "./video/sliceFrames";

/**
 * Rip assets to S3, skipping if the asset already exists in the target bucket.
 *
 * During development of the project, some runs of the ingest process partially created the right assets. This rip will
 * check if those assets already exist before attempting to re-download them, however the same events will be dispatched
 * as if they were created during invocation, so they can be consumed by downstream services in a homogeneous way.
 */
export async function ripAssetsToS3(video: YouTubeVideo) {
    const workspace = Workspace.create();
    console.log(`${video.id}: Starting asset rip`);

    // Download the video if it does not exist.
    let videoFilename: string | undefined = undefined;
    if (!(await S3.exists(`${video.id}/video.webm`))) {
        console.log(`${video.id}: Video asset does not exists, downloading`);
        // Download the last 10 minutes of a video for analysis.
        videoFilename = await video.downloadLastTenMinutes(workspace.directory());
        await S3.put(`${video.id}/video.webm`, videoFilename);
    }

    // Resolve the metadata from object storage, or create it if it does not exist.
    let resolvedMetadata: VideoMetadata;
    if (await S3.exists(`${video.id}/metadata.json`)) {
        console.log(`${video.id}: Metadata already exists, fetching from storage`);
        resolvedMetadata = VideoMetadata.fromApiResponse(JSON.parse(await S3.get(`${video.id}/metadata.json`)).rawMetadata);
    } else {
        console.log(`${video.id}: Metadata does not exist, downloading and storing`);
        const metadata = await video.resolveMetadata();
        await S3.putFromContents(`${video.id}/metadata.json`, JSON.stringify(metadata));
        resolvedMetadata = metadata;
    }

    await recordThat("VideoAssetStored", {
        videoId: video.id,
        location: `s3://${process.env.BUCKET_NAME}/${video.id}/video.webm`,
        metadata: {
            videoName: resolvedMetadata.title(),
            videoDuration: resolvedMetadata.duration().inSeconds(),
            releaseDate: resolvedMetadata.releaseDate(),
        },
    });

    // Only slice frames if a new video has been downloaded, otherwise the slided frames will already exist.
    if (videoFilename) {
        console.log(`${video.id}: Slicing frames from newly stored video asset`);

        // Slice into individual frame images at a very low framerate, only need to capture final statistics.
        const framesDirectory = workspace.createSubDirectory("frames");
        await sliceFrames(videoFilename, 0.25, framesDirectory);
        const frames = listFiles(framesDirectory);

        for (const frame of frames) {
            await S3.put(`${video.id}/frames/${frame}`, `${framesDirectory}/${frame}`);
            await recordThat("VideoFrameStored", {
                videoId: video.id,
                frameId: path.basename(frame, ".jpg"),
                location: `s3://${process.env.BUCKET_NAME}/${video.id}/frames/${frame}`,
            });
        }
    } else {
        console.log(`${video.id}: Enumerating frames already in storage`);
        const frames = await S3.list(`${video.id}/frames/`);
        for (const frame of frames) {
            await recordThat("VideoFrameStored", {
                videoId: video.id,
                frameId: path.basename(frame.Key, ".jpg"),
                location: `s3://${process.env.BUCKET_NAME}/${frame.Key}`,
            });
        }
    }

    workspace.cleanUp();
}
