import { YouTubeVideo } from "./youtube/YouTubeVideo";
import { Workspace } from "./files/Workspace";
import { recordThat } from "tp-events";
import { listFiles } from "./files/listFiles";
import { VideoMetadata } from "./youtube/VideoMetadata";
import { sliceFrames } from "./video/sliceFrames";
import { BasicFs, ObjectStorage } from "objects";
import { downloadLastTenMinutes } from "./youtube/downloadLastTenMinutes";
import { resolveMetadata } from "./youtube/resolveMetadata";
import path from "path";

/**
 * Rip assets to S3, skipping if the asset already exists in the target bucket.
 *
 * During development of the project, some runs of the ingest process partially downloaded the remote assets. This rip
 * will check if those assets already exist before attempting to re-download them, however the same events will be
 * dispatched as if they were created during invocation, so they can be consumed by downstream services in a homogeneous
 * way, without understanding the intermediary state of the partially ingested corpus.
 */
export async function ripAssetsToS3(video: YouTubeVideo, s3: ObjectStorage, fs: BasicFs) {
    const workspace = Workspace.create(fs);
    console.log(`${video.id}: Starting asset rip`);

    // Resolve the metadata from either the S3 cache, or from the remote.
    const metadata: VideoMetadata = (await s3.exists(`${video.id}/metadata.json`))
        ? VideoMetadata.fromApiResponse(JSON.parse(await s3.getString(`${video.id}/metadata.json`)).rawMetadata)
        : await (async () => {
              console.log(`${video.id}: Metadata does not exist, downloading and storing`);
              const metadata = await resolveMetadata(video);
              await s3.put(`${video.id}/metadata.json`, JSON.stringify(metadata));
              return metadata;
          })();

    // Only download and store the remote video, if it is not already in the remote storage.
    let downloadedVideo: string | null = null;
    if (!(await s3.exists(`${video.id}/video.webm`))) {
        console.log(`${video.id}: Video asset does not exists, downloading`);
        downloadedVideo = await downloadLastTenMinutes(workspace.directory(), metadata, video);
        await s3.put(`${video.id}/video.webm`, fs.readFileSync(downloadedVideo));
    }

    // Dispatch that the asset has been stored.
    await recordThat("VideoAssetStored", {
        videoId: video.id,
        location: `s3://${process.env.BUCKET_NAME}/${video.id}/video.webm`,
        metadata: {
            videoName: metadata.title(),
            videoDuration: metadata.duration().inSeconds(),
            releaseDate: metadata.releaseDate(),
        },
    });

    // If the video was downloaded, slice up the frames locally, otherwise locate them in the remote storage.
    const remoteFrames = downloadedVideo
        ? await (async () => {
              console.log(`${video.id}: Slicing frames from newly stored video asset`);

              // Slice into individual frame images at a very low framerate, only need to capture final statistics.
              const framesDirectory = workspace.createSubDirectory("frames");
              await sliceFrames(downloadedVideo, 0.25, framesDirectory);

              const remoteFrames = [];
              for (const frame of listFiles(fs, framesDirectory)) {
                  await s3.put(`${video.id}/frames/${frame}`, fs.readFileSync(`${framesDirectory}/${frame}`));
                  remoteFrames.push(`s3://${process.env.BUCKET_NAME}/${video.id}/frames/${frame}`);
              }
              return remoteFrames;
          })()
        : await (async () => {
              console.log(`${video.id}: Enumerating frames already in storage`);
              const frames = await s3.list(`${video.id}/frames/`);
              return frames.map((frame) => `s3://${process.env.BUCKET_NAME}/${frame.Key}`);
          })();

    // Dispatch each frame for analysis.
    for (const remoteFrame of remoteFrames) {
        await recordThat("VideoFrameStored", {
            videoId: video.id,
            frameId: path.basename(remoteFrame, ".jpg"),
            location: remoteFrame,
        });
    }

    workspace.cleanUp();
}
