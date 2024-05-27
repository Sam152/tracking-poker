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
import * as Player from "./entity/player";
import { normalizeKey } from "../dynamo/normalizeKey";
import { resolvePlayerName } from "../domain/player/resolvePlayerName";
import { playerNameShouldNotBeRepresented } from "../domain/player/playerNameShouldNotBeRepresented";

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
            // Resolve aliased names.
            const resolvedPlayerName = resolvePlayerName(eventStat.playerName);
            // Allow some name-like words to be skipped in the dataset.
            if (playerNameShouldNotBeRepresented(resolvedPlayerName)) {
                continue;
            }

            const playerId = stamp<PlayerId>(normalizeKey(resolvedPlayerName));

            const player: Player.Player = {
                player: playerId,
                player_name: resolvedPlayerName,
                last_played_show: show.id,
                last_played_date: show.date,
            };
            await putItem(Player.toStorage(player));

            const playerAppearance: PlayerAppearance.PlayerAppearance = {
                player: playerId,
                player_name: resolvedPlayerName,
                show: show.id,
                show_name: show.show_name,
                date: show.date,
            };
            await putItem(PlayerAppearance.toStorage(playerAppearance));

            const stat: Stat.Stat = {
                show: show.id,
                player: playerId,
                player_name: resolvedPlayerName,
                type: event.type,
                value: eventStat.stat,
            };
            await putItem(Stat.toStorage(stat));
        }
    }
}
