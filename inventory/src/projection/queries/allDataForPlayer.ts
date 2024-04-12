import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StructuredQuery } from "./index";
import * as Stat from "../entity/stat";
import { statGroupFromItems } from "../entity/stat";
import * as Player from "../entity/playerAppearance";
import * as PlayerAppearance from "../entity/playerAppearance";

type StatGroup = Partial<Record<Stat.StatType, Stat.Stat[]>>;

export function allDataForPlayer(player: Player.PlayerId): StructuredQuery<{
    appearances: PlayerAppearance.PlayerAppearance[];
    stats: StatGroup;
}> {
    return {
        query: new QueryCommand({
            TableName: "inventory",
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: {
                ":pk": `player#${player}`,
            },
        }),
        parser: (items: Record<string, any>[]) => {
            return {
                appearances: items
                    .filter((item) => item.entity_type === "player_appearance")
                    .map((appearanceStorage) => PlayerAppearance.fromStorage(appearanceStorage)),
                stats: statGroupFromItems(items),
            };
        },
    };
}
