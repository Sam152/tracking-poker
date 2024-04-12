import { BusEvent, BusEventName, eventIs } from "tp-events";
import * as Show from "./entity/show";
import { ShowId } from "./entity/show";
import * as Stat from "./entity/stat";
import { stamp } from "../util/nominalType";
import { parseShowDate } from "./util/parseShowDate";
import { ItemPutter } from "../dynamo/putItem";
import { QueryExecutor } from "../dynamo/executeQuery";
import { allDataForShow } from "./queries/allDataForShow";
import * as PlayerAppearance from "./entity/playerAppearance";
import { PlayerId } from "./entity/playerAppearance";
import { normalizeKey } from "../dynamo/normalizeKey";

export async function handleEvent(eventName: BusEventName, event: BusEvent, putItem: ItemPutter, executeQuery: QueryExecutor) {
    if (eventIs("VideoAssetStored", eventName, event)) {
        await putItem(
            Show.toStorage({
                id: stamp<Show.ShowId>(event.videoId),
                operator: stamp<Show.OperatorId>("hcl"),
                date: parseShowDate(event.metadata.releaseDate),
                show_name: event.metadata.videoName,
                duration: event.metadata.videoDuration,
            }),
        );
    }

    if (eventIs("StatsExtractedFromFrame", eventName, event)) {
        const showData = await executeQuery(allDataForShow(stamp<ShowId>(event.videoId)));
        const show = showData.show;
        if (typeof show === "undefined") {
            throw new Error("Received stats extracted event, without corresponding show entity.");
        }

        for (const eventStat of event.stats) {
            const playerId = stamp<PlayerId>(normalizeKey(eventStat.playerName));

            const playerAppearance: PlayerAppearance.PlayerAppearance = {
                player: playerId,
                player_name: eventStat.playerName,
                show: show.id,
                show_name: show.show_name,
                date: show.date,
            };
            await putItem(PlayerAppearance.toStorage(playerAppearance));

            const stat: Stat.Stat = {
                show: show.id,
                player: playerId,
                player_name: eventStat.playerName,
                type: event.type,
                value: eventStat.stat,
            };
            await putItem(Stat.toStorage(stat));
        }
    }
}
