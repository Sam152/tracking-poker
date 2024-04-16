import { PlayerId } from "./playerAppearance";
import { ShowId } from "./show";

export type StatType = "cc" | "cw" | "vpip" | "pfr";

export type Stat = {
    type: StatType;
    value: number;
    player: PlayerId;
    player_name: string;
    show: ShowId;
};

export type StatStorage = Stat & {
    entity_type: "player_stat";
    pk: `player#${PlayerId}`;
    sk: `stat#stat_type#${StatType}#show#${PlayerId}#`;
    gsi1pk: `slug#${ShowId}`;
    gsi1sk: `stat#stat_type#${StatType}#player#${PlayerId}#`;
    gsi2pk: `stat_type#${StatType}`;
    gsi2sk: `stat#player#${PlayerId}#slug#${ShowId}#`;
};

export function toStorage(stat: Stat): StatStorage {
    return {
        ...stat,
        entity_type: "player_stat",
        pk: `player#${stat.player}`,
        sk: `stat#stat_type#${stat.type}#show#${stat.player}#`,
        gsi1pk: `slug#${stat.show}`,
        gsi1sk: `stat#stat_type#${stat.type}#player#${stat.player}#`,
        gsi2pk: `stat_type#${stat.type}`,
        gsi2sk: `stat#player#${stat.player}#slug#${stat.show}#`,
    };
}

// @todo, validate data from storage.
export function fromStorage(statStorage: Record<string, any>): Stat {
    return {
        type: statStorage.type,
        value: statStorage.value,
        player: statStorage.player,
        player_name: statStorage.player_name,
        show: statStorage.show,
    };
}

export type StatGroup = Partial<Record<StatType, Stat[]>>;

export function statGroupFromItems(items: Record<string, any>[]): StatGroup {
    return items
        .filter((item) => item.entity_type === "player_stat")
        .map((statStorage) => fromStorage(statStorage))
        .reduce<StatGroup>((statGroup, stat) => {
            statGroup[stat.type] = statGroup[stat.type] || [];
            statGroup[stat.type]?.push(stat);
            return statGroup;
        }, {});
}
