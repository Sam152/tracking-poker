import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const mainClient = new DynamoDBClient({});
export const client = DynamoDBDocumentClient.from(mainClient);
