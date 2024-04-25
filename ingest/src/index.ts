import { ServiceInvocationEvents, serviceInvocationEventsSchema } from "./api";
import { fetchRecentVideoIds } from "./youtube/fetchRecentVideoIds";
import { EventBridgeEvent } from "aws-lambda";
import { recordThat } from "tp-events";
import { hasDiscoveredBroadcast } from "./projection/util/hasDiscoveredBroadcast";
import { captureFetchGlobal } from "aws-xray-sdk-fetch";
import { legacyVideoIds } from "./legacy/legacyVideos";
import { getDiscoveredBroadcasts } from "./projection/util/getDiscoveredBroadcasts";

captureFetchGlobal();

export async function handler(incomingEvent: EventBridgeEvent<any, any>) {
    const event = serviceInvocationEventsSchema.parse(incomingEvent);
    await handleEvent(event, fetchRecentVideoIds, hasDiscoveredBroadcast, getDiscoveredBroadcasts, recordThat);
}

export async function handleEvent(
    event: ServiceInvocationEvents,
    fnFetchRecentVideoIds: typeof fetchRecentVideoIds,
    fnHasDiscoveredBroadcast: typeof hasDiscoveredBroadcast,
    fnGetDiscoveredBroadcasts: typeof getDiscoveredBroadcasts,
    fnRecordThat: typeof recordThat,
): Promise<void> {
    if (event["detail-type"] === "CheckForNewStreams") {
        const videos = await fnFetchRecentVideoIds("UCQe7wB0o_cZgv1miyYB9TMA");
        console.log(`Found ${videos.length} from API`);
        for (const videoId of videos) {
            console.log(`Checking if ${videoId} exists in corpus.`);
            if (!(await fnHasDiscoveredBroadcast("hcl", videoId))) {
                await fnRecordThat("NewCompletedBroadcastDiscovered", {
                    videoId: videoId,
                    operator: "hcl",
                });
            }
        }
    }

    if (event["detail-type"] === "IngestLegacyStream") {
        const discoveredBroadcasts = await fnGetDiscoveredBroadcasts("hcl");
        const unprocessedBroadcasts = legacyVideoIds.filter((id) => !discoveredBroadcasts.includes(id));
        const videoId = unprocessedBroadcasts.shift();
        if (videoId) {
            await fnRecordThat("NewCompletedBroadcastDiscovered", {
                videoId: videoId,
                operator: "hcl",
            });
        }
    }
}
