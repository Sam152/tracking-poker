import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StructuredQuery } from "./index";
import * as Show from "../entity/show";

export function allShows(): StructuredQuery<Show.Show[]> {
    return {
        query: new QueryCommand({
            // Scan index backwards, to show most recent shows first.
            ScanIndexForward: false,
            TableName: "inventory",
            KeyConditionExpression: "pk = :pk AND begins_with(sk, :skBeginsWith)",
            ExpressionAttributeValues: {
                ":pk": `operator#hcl`,
                ":skBeginsWith": `show#`,
            },
        }),
        parser: (items: Record<string, any>[]) => {
            return items.map((storageShow) => Show.fromStorage(storageShow));
        },
    };
}
