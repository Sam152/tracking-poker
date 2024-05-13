import { ShowDate, ShowId } from "./show";
import { PlayerId } from "./playerAppearance";

export type Player = {
    player: PlayerId;
    player_name: string;
    last_played_date: ShowDate;
    last_played_show: ShowId;
};

export type PlayerStorage = Player & {
    entity_type: "player";
    pk: `all_operators`;
    sk: `player#player#${PlayerId}#`;
};

export function toStorage(player: Player): PlayerStorage {
    return {
        ...player,
        entity_type: "player",
        pk: `all_operators`,
        sk: `player#player#${player.player}#`,
    };
}

export function fromStorage(playerStorage: Record<string, any>): Player {
    return {
        player: playerStorage.player,
        player_name: playerStorage.player_name,
        last_played_date: playerStorage.last_played_date,
        last_played_show: playerStorage.last_played_show,
    };
}
