import { ServiceInvocationEvents, serviceInvocationEventsSchema } from "./api";
import { Callback, Context } from "aws-lambda";
import { isFrameOfInterest } from "./classify/isFrameOfInterest";
import { fetchAsset } from "./s3/fetchAsset";
import { recordThat } from "tp-events";
import { getStatsFromFrame } from "./stats/getStatsFromFrame";

export async function handler(incomingEvent: ServiceInvocationEvents, context: Pick<Context, "awsRequestId">, callback: Callback) {
    const event = serviceInvocationEventsSchema.parse(incomingEvent);
    const frame = await fetchAsset(event["detail"].bucket, event["detail"].key);

    // Do a first pass with the cheap classifier to see if a frame is junk.
    if (!(await isFrameOfInterest(frame))) {
        await recordThat("FrameClassifiedAsJunk", {
            videoId: event.detail.videoId,
            frameId: event.detail.frameId,
        });
        return;
    }

    // Do the expensive textract analysis, and also allow this analysis to classify the frame as junk.
    const typeAndStats = await getStatsFromFrame(frame, event.detail.videoId, event.detail.frameId);
    if (!typeAndStats) {
        await recordThat("FrameClassifiedAsJunk", {
            videoId: event.detail.videoId,
            frameId: event.detail.frameId,
        });
        return;
    }

    const [type, stats] = typeAndStats;
    await recordThat("StatsExtractedFromFrame", {
        videoId: event.detail.videoId,
        frameId: event.detail.frameId,
        type: type,
        stats: stats,
    });
}
