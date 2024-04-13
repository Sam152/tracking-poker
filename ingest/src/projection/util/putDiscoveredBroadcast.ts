import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../client";

export function putDiscoveredBroadcast(operator: string, videoId: string) {
    return client.send(
        new PutCommand({
            TableName: "ingest-log",
            Item: {
                pk: `operator#${operator}`,
                sk: `videoId#${videoId}`,
                videoId: videoId,
            },
        }),
    );
}
