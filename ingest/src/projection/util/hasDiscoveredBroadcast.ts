import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../client";

export async function hasDiscoveredBroadcast(operator: string, videoId: string): Promise<boolean> {
    const results = await client.send(
        new QueryCommand({
            TableName: "ingest-log",
            KeyConditionExpression: "pk = :pk AND sk = :sk",
            ExpressionAttributeValues: {
                ":pk": `operator#${operator}`,
                ":sk": `videoId#${videoId}`,
            },
        }),
    );
    return (results.Items?.length || 0) > 0;
}
