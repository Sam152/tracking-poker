import { ShowStorage } from "../projection/entity/show";
import { PlayerAppearanceStorage } from "../projection/entity/playerAppearance";
import { StatStorage } from "../projection/entity/stat";
import { client } from "./client";
import { PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { PlayerStorage } from "../projection/entity/player";

export async function putItem(item: ShowStorage | PlayerAppearanceStorage | StatStorage | PlayerStorage): Promise<PutCommandOutput> {
    return await client.send(
        new PutCommand({
            TableName: "inventory",
            Item: item,
        }),
    );
}

export type ItemPutter = typeof putItem;
