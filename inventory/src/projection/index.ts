import { Callback, Context, EventBridgeEvent } from "aws-lambda";
import { handleEvent } from "./handleEvent";
import { putItem } from "../dynamo/putItem";
import { executeQuery } from "../dynamo/executeQuery";

export async function handler(event: EventBridgeEvent<any, any>, context: Pick<Context, "awsRequestId">, callback: Callback) {
    await handleEvent(event["detail-type"], event.detail, putItem, executeQuery);
}
