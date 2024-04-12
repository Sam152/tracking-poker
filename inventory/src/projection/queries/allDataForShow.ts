import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StructuredQuery } from "./index";
import * as Stat from "../entity/stat";
import { statGroupFromItems } from "../entity/stat";
import * as Show from "../entity/show";
import * as PlayerAppearance from "../entity/playerAppearance";

type StatGroup = Partial<Record<Stat.StatType, Stat.Stat[]>>;

export function allDataForShow(showId: Show.ShowId): StructuredQuery<{
    show?: Show.Show;
    players: PlayerAppearance.PlayerAppearance[];
    stats: StatGroup;
}> {
    return {
        query: new QueryCommand({
            TableName: "inventory",
            IndexName: "gsi1",
            KeyConditionExpression: "gsi1pk = :gsi1pk",
            ExpressionAttributeValues: {
                ":gsi1pk": `slug#${showId}`,
            },
        }),
        parser: (items: Record<string, any>[]) => {
            const show = items.find((item) => item.entity_type === "show");
            return {
                show: show ? Show.fromStorage(show) : undefined,
                players: items
                    .filter((item) => item.entity_type === "player_appearance")
                    .map((appearanceStorage) => PlayerAppearance.fromStorage(appearanceStorage)),
                stats: statGroupFromItems(items),
            };
        },
    };
}
