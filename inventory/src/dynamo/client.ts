import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { captureAWSv3Client } from "aws-xray-sdk";

const mainClient = new DynamoDBClient({
    region: process.env.DYNAMO_TABLE_REGION,
});
export const client = captureAWSv3Client(DynamoDBDocumentClient.from(mainClient));
