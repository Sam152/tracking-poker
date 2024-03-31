import {Block} from "@aws-sdk/client-textract/dist-types/models/models_0";
import {typeCollection} from "../types/typeCollection";

export function createTypeFromBlocks(blocks: Block[]) {
    const blob = JSON.stringify(blocks).toUpperCase();
    return typeCollection.find(type => {
        return type.getTriggerWords().find(triggerWord => blob.indexOf(triggerWord) !== -1) !== undefined;
    });
}
