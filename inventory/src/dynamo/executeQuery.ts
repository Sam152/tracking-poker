import { client } from "./client";
import { StructuredQuery } from "../projection/queries";
import { NativeAttributeValue } from "@aws-sdk/util-dynamodb";

export async function executeQuery<T>(query: StructuredQuery<T>): Promise<T> {
    const results = await client.send(query.query);
    return query.parser(results.Items || []);
}

export async function executeQueryRaw<T>(query: StructuredQuery<T>): Promise<Record<string, NativeAttributeValue>[] | undefined> {
    const results = await client.send(query.query);
    return results.Items;
}

export type QueryExecutor = typeof executeQuery;
