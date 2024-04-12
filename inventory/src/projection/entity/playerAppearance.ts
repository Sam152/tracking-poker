import { ShowDate, ShowId } from "./show";
import { StampedType } from "../../util/nominalType";

export type PlayerId = StampedType<string, "PlayerId">;

export type PlayerAppearance = {
    player: PlayerId;
    player_name: string;
    show: ShowId;
    show_name: string;
    date: ShowDate;
};

export type PlayerAppearanceStorage = PlayerAppearance & {
    entity_type: "player_appearance";
    pk: `player#${PlayerId}`;
    sk: `appearance#slug#${ShowId}#`;
    gsi1pk: `slug#${ShowId}`;
    gsi1sk: `appearance#player#${PlayerId}#`;
};

export function toStorage(appearance: PlayerAppearance): PlayerAppearanceStorage {
    return {
        ...appearance,
        entity_type: "player_appearance",
        pk: `player#${appearance.player}`,
        sk: `appearance#slug#${appearance.show}#`,
        gsi1pk: `slug#${appearance.show}`,
        gsi1sk: `appearance#player#${appearance.player}#`,
    };
}

// @todo, validate data from storage.
export function fromStorage(appearanceStorage: Record<string, any>): PlayerAppearance {
    return {
        player: appearanceStorage.player,
        player_name: appearanceStorage.player_name,
        show: appearanceStorage.show,
        show_name: appearanceStorage.show_name,
        date: appearanceStorage.date,
    };
}
