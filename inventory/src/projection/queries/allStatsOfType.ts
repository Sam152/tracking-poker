import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StructuredQuery } from "./index";
import * as Stat from "../entity/stat";

export function allStatsOfType(type: Stat.StatType): StructuredQuery<Stat.Stat[]> {
    return {
        query: new QueryCommand({
            TableName: "inventory",
            IndexName: "gsi2",
            KeyConditionExpression: "gsi2pk = :gsi2pk",
            ExpressionAttributeValues: {
                ":gsi2pk": `stat_type#${type}`,
            },
        }),
        parser: (items: Record<string, any>[]) => {
            return items.map((statStorage) => Stat.fromStorage(statStorage));
        },
    };
}
