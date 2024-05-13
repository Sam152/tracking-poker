import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StructuredQuery } from "./index";
import * as Player from "../entity/player";

export function allPlayers(): StructuredQuery<{
    players: Player.Player[];
}> {
    return {
        query: new QueryCommand({
            TableName: "inventory",
            KeyConditionExpression: "pk = :pk AND begins_with(sk, :skBeginsWith)",
            ExpressionAttributeValues: {
                ":pk": `all_operators`,
                ":skBeginsWith": `player#`,
            },
        }),
        parser: (items: Record<string, any>[]) => {
            return {
                players: items
                    .filter((item) => item.entity_type === "player")
                    .map((playerStorage) => Player.fromStorage(playerStorage)),
            };
        },
    };
}
