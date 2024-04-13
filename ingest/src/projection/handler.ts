import { Callback, Context, EventBridgeEvent } from "aws-lambda";
import { eventIs } from "tp-events";
import { putDiscoveredBroadcast } from "./util/putDiscoveredBroadcast";

/**
 * Build a very simple projection which is a list of videos which have already been discovered. This can be used to
 * compare against any new videos which appear.
 */
export async function handler(event: EventBridgeEvent<any, any>, context: Pick<Context, "awsRequestId">, callback: Callback) {
    if (eventIs("NewCompletedBroadcastDiscovered", event["detail-type"], event.detail)) {
        await putDiscoveredBroadcast(event.detail.operator, event.detail.videoId);
    }
}
