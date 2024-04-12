import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export type StructuredQuery<T> = {
    query: QueryCommand;
    parser: (items: Record<string, any>[]) => T;
};
