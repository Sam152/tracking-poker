import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export async function handler() {
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    console.log(process.env.TABLE_NAME);

    const command = new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
            pk: "aa",
            sk: "bb",
        },
    });

    const response = await docClient.send(command);
    console.log(response);
}

(async () => {
    await handler();
})();
