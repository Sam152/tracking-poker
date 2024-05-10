import { YouTubeVideo } from "./youtube/YouTubeVideo";
import { Workspace } from "./files/Workspace";
import { createObject } from "./util/createObject";
import { recordThat } from "tp-events";
import { Slicer } from "./video/Slicer";
import { listFiles } from "./files/listFiles";
import path from "path";

export async function ripAssetsToS3(video: YouTubeVideo) {
    const workspace = Workspace.create();

    // Download the last 10 minutes of a video for analysis.
    const videoFilename = await video.downloadLastTenMinutes(workspace.directory());
    const metadata = await video.resolveMetadata();
    await createObject(`${video.id}/video.webm`, videoFilename);

    await recordThat("VideoAssetStored", {
        videoId: video.id,
        location: `s3://${process.env.BUCKET_NAME}/${video.id}/video.webm`,
        metadata: {
            videoName: metadata.title(),
            videoDuration: metadata.duration().inSeconds(),
            releaseDate: metadata.releaseDate(),
        },
    });

    // Slice into individual frame images at a very low framerate, only need to capture final statistics.
    const framesDirectory = workspace.createSubDirectory("frames");
    await Slicer.fromVideoFile(videoFilename).sliceFrames(0.25, framesDirectory);
    const frames = listFiles(framesDirectory);

    for (const frame of frames) {
        await createObject(`${video.id}/frames/${frame}`, `${framesDirectory}/${frame}`);
        await recordThat("VideoFrameStored", {
            videoId: video.id,
            frameId: path.basename(frame, ".jpg"),
            location: `s3://${process.env.BUCKET_NAME}/${video.id}/frames/${frame}`,
        });
    }

    workspace.cleanUp();
}
