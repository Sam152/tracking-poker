import { Callback, Context } from "aws-lambda";
import { YouTubeVideo } from "./youtube/YouTubeVideo";
import { ServiceInvocationEvents, serviceInvocationEventsSchema } from "./api";
import { ripAssetsToS3 } from "./util/ripAssetsToS3";

export async function handler(
    incomingEvent: ServiceInvocationEvents,
    context: Pick<Context, "awsRequestId">,
    callback: Callback,
) {
    const event = serviceInvocationEventsSchema.parse(incomingEvent);

    if (event["detail-type"] === "StartAssetRipByVideoUrl") {
        await ripAssetsToS3(YouTubeVideo.fromUrl(event.detail.videoUrl));
    }

    if (event["detail-type"] === "StartAssetRipByVideoId") {
        await ripAssetsToS3(YouTubeVideo.fromId(event.detail.videoId));
    }
}
