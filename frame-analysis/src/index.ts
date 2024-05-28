import { ServiceInvocationEvents, serviceInvocationEventsSchema } from "./api";
import { Callback, Context } from "aws-lambda";
import { isFrameOfInterest } from "./classify/isFrameOfInterest";
import { recordThat } from "tp-events";
import { getStatsFromFrame } from "./stats/getStatsFromFrame";
import { S3Client } from "objects";

export async function handler(incomingEvent: ServiceInvocationEvents, context: Pick<Context, "awsRequestId">, callback: Callback) {
    const event = serviceInvocationEventsSchema.parse(incomingEvent);
    const s3 = new S3Client(event["detail"].bucket);
    const frame = await s3.get(event["detail"].key);

    // Do a first pass with the cheap classifier to see if a frame is junk.
    if (!(await isFrameOfInterest(frame, event.detail.frameId))) {
        await recordThat("FrameClassifiedAsJunk", {
            videoId: event.detail.videoId,
            frameId: event.detail.frameId,
            junkedBecause: "FRAME_OF_INTEREST_CHECK_FAILED",
        });
        return;
    }

    // Do the expensive textract analysis, and also allow this analysis to classify the frame as junk.
    const typeAndStats = await getStatsFromFrame(frame, event.detail.videoId, event.detail.frameId);
    if (!typeAndStats) {
        await recordThat("FrameClassifiedAsJunk", {
            videoId: event.detail.videoId,
            frameId: event.detail.frameId,
            junkedBecause: "TEXTRACT_DOCUMENT_CLASSIFIED_AS_JUNK",
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
