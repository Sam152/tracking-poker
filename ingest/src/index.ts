import { serviceInvocationEventsSchema } from "./api";
import { fetchRecentVideoIds } from "./youtube/fetchRecentVideoIds";
import { EventBridgeEvent } from "aws-lambda";
import { recordThat } from "tp-events";
import { hasDiscoveredBroadcast } from "./projection/util/hasDiscoveredBroadcast";

export async function handler(incomingEvent: EventBridgeEvent<any, any>) {
    const event = serviceInvocationEventsSchema.parse(incomingEvent);
    if (event["detail-type"] === "CheckForNewStreams") {
        const videos = await fetchRecentVideoIds("UCQe7wB0o_cZgv1miyYB9TMA");

        console.log(`Found ${videos.length} from API`);

        for (const videoId of videos) {
            console.log(`Checking if ${videoId} exists in corpus.`);
            if (!(await hasDiscoveredBroadcast("hcl", videoId))) {
                await recordThat("NewCompletedBroadcastDiscovered", {
                    videoId: videoId,
                    operator: "hcl",
                });
            }
        }
    }
}
