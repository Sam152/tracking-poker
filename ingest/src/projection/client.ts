import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { captureAWSv3Client } from "aws-xray-sdk";

export const client = captureAWSv3Client(DynamoDBDocumentClient.from(new DynamoDBClient({})));
