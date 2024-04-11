import { Callback, Context } from "aws-lambda";
import { YouTubeVideo } from "./youtube/YouTubeVideo";
import { ServiceInvocationEvents, serviceInvocationEventsSchema } from "./api";
import { Workspace } from "./files/Workspace";
import { createObject } from "./util/createObject";
import { Slicer } from "./video/Slicer";
import { listFiles } from "./files/listFiles";
import { recordThat } from "tp-events";
import path from "path";

export async function handler(incomingEvent: ServiceInvocationEvents, context: Pick<Context, "awsRequestId">, callback: Callback) {
    const event = serviceInvocationEventsSchema.parse(incomingEvent);
    const video =
        event["detail-type"] === "StartAssetRipByVideoUrl"
            ? YouTubeVideo.fromUrl(event.detail.videoUrl)
            : YouTubeVideo.fromId(event.detail.videoId);

    await recordThat({
        name: "VideoAssetRipStarted",
        videoId: video.id,
    });
    await ripAssetsToS3(video);
}

export async function ripAssetsToS3(video: YouTubeVideo) {
    const workspace = Workspace.create();

    // Download the last 10 minutes of a video for analysis.
    const videoFilename = await video.downloadLastTenMinutes(workspace.directory());
    const metadata = await video.resolveMetadata();
    await createObject(`${video.id}/video.webm`, videoFilename);

    await recordThat({
        name: "VideoAssetStored",
        videoId: video.id,
        location: `s3://${process.env.BUCKET_NAME}/${video.id}/video.webm`,
        metadata: {
            videoName: metadata.title(),
            videoDuration: metadata.duration().inSeconds(),
        },
    });

    // Slice into individual frame images at a very low framerate, only need to capture final statistics.
    const framesDirectory = workspace.createSubDirectory("frames");
    await Slicer.fromVideoFile(videoFilename).sliceFrames(0.25, framesDirectory);
    const frames = listFiles(framesDirectory);

    for (const frame of frames) {
        await createObject(`${video.id}/frames/${frame}`, `${framesDirectory}/${frame}`);
        await recordThat({
            name: "VideoFrameStored",
            videoId: video.id,
            frameId: path.basename(frame, ".jpg"),
            location: `s3://${process.env.BUCKET_NAME}/${video.id}/frames/${frame}`,
        });
    }

    workspace.cleanUp();
}
