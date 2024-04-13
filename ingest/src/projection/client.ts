import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
