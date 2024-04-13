import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../client";

export async function getDiscoveredBroadcasts(operator: string): Promise<string[]> {
    const results = await client.send(
        new QueryCommand({
            TableName: "ingest-log",
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: {
                ":pk": `operator#${operator}`,
            },
        }),
    );
    return results.Items?.map((item) => item.videoId) || [];
}
