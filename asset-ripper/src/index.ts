import { Callback, Context } from "aws-lambda";
import { YouTubeVideo } from "./youtube/YouTubeVideo";
import { ServiceInvocationEvents, serviceInvocationEventsSchema } from "./api";
import { recordThat } from "tp-events";
import { ripAssetsToS3 } from "./ripAssetsToS3";

export async function handler(incomingEvent: ServiceInvocationEvents, context: Pick<Context, "awsRequestId">, callback: Callback) {
    const event = serviceInvocationEventsSchema.parse(incomingEvent);
    const video =
        event["detail-type"] === "StartAssetRipByVideoUrl"
            ? YouTubeVideo.fromUrl(event.detail.videoUrl)
            : YouTubeVideo.fromId(event.detail.videoId);

    await recordThat("VideoAssetRipStarted", {
        videoId: video.id,
    });
    await ripAssetsToS3(video);
}
