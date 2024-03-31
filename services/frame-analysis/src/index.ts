import {ServiceInvocationEvents, serviceInvocationEventsSchema} from "./api";
import {Callback, Context} from "aws-lambda";
import {isFrameOfInterest} from "./classify/isFrameOfInterest";
import {fetchAsset} from "./s3/fetchAsset";
import {recordThat} from "tp-events";

export async function handler(incomingEvent: ServiceInvocationEvents, context: Pick<Context, "awsRequestId">, callback: Callback) {
    const event = serviceInvocationEventsSchema.parse(incomingEvent);
    const asset = await fetchAsset(event["detail"].bucket, event["detail"].key);

    if (!await isFrameOfInterest(asset)) {
        recordThat("FrameClassifiedAsJunk", {
            videoId: event.detail.videoId,
            frameId: event.detail.frameId,
        });
        return;
    }

}
