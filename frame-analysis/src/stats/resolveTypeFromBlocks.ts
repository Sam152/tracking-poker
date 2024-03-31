import { Block } from "@aws-sdk/client-textract/dist-types/models/models_0";
import { StatMetadata } from "./types/StatType";
import { typeList } from "./types/typeList";

export function resolveTypeFromBlocks(
    blocks: Block[],
): StatMetadata | undefined {
    const blob = JSON.stringify(blocks).toUpperCase();
    return typeList.find((type) => {
        return (
            type.triggerWords.find(
                (triggerWord) => blob.indexOf(triggerWord) !== -1,
            ) !== undefined
        );
    });
}
