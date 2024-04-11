import { Callback, Context, EventBridgeEvent } from "aws-lambda";
import { BusEvents, putEvents } from "tp-events";
import { s3UriToParts } from "./util/s3UriToParts";

/**
 * The purpose of the pipeline is to have a single router for events that happen in a sequence.
 *
 * Each service responds to commands listed in their respective api.ts file, and could technically be configured
 * to respond to the events dispatched by other services. This model would look something like:
 *
 * SomeInitialCommand
 *     -> Service A invoked: records FooEvent
 *         -> Service B invoked: records BarEvent
 *         -> Service C invoked: records BazEvent
 *
 * Issues with this is that it's not very easy to visualise and change the end to end pipeline, and there may be
 * different models of pipeline that could be experimented with and applicable, without needing to change any of the
 * underlying service implementations or APIs.
 *
 * This pipeline acts as a router, responding to events recorded by different services and redispatching commands to
 * any subsequent services that should continue processing, for any given pipeline. This model ends up looking like:
 *
 * SomeInitialCommand
 *     -> Service A invoked: records FooEvent
 *         -> Pipeline invoked: Dispatches ServiceBCommand
 *         -> Pipeline invoked: Dispatches ServiceCCommand
 *
 * ServiceBCommand
 *     -> Service B invoked: records BarEvent
 * ServiceCCommand
 *     -> Service C invoked: records BazEvent
 */
export async function handler<T extends keyof BusEvents>(
    event: EventBridgeEvent<T, BusEvents[T]>,
    context: Pick<Context, "awsRequestId">,
    callback: Callback,
) {
    // When a frame is stored as the result of a rip, start an analysis.
    if (event["detail-type"] === "VideoFrameStored") {
        const detail = event["detail"] as BusEvents["VideoFrameStored"];
        await putEvents(process.env.COMMAND_BUS_ARN, "StartAnalysisOfFrame", {
            frameId: detail.frameId,
            videoId: detail.videoId,
            ...s3UriToParts(detail.location),
        });
    }
}
