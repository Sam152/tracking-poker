import { Block } from "@aws-sdk/client-textract/dist-types/models/models_0";
import { PlayerStatCollection, StatType } from "./types/StatType";
import * as trp from "amazon-textract-response-parser";
import { ApiBlock } from "amazon-textract-response-parser/dist/types/api-models/document";
import { resolveTypeFromBlocks } from "./resolveTypeFromBlocks";

export async function getStatsFromBlocks(
    blocks: Block[],
    frame: Buffer,
): Promise<
    [type: StatType, analysis: PlayerStatCollection<number> | undefined]
> {
    const typeMetadata = resolveTypeFromBlocks(blocks);
    if (!typeMetadata) {
        throw new Error(
            "Unable to resolve type when getting analysis from blocks.",
        );
    }

    const document = new trp.TextractDocument({
        Blocks: blocks as any as ApiBlock[],
        DocumentMetadata: { Pages: 1 },
        AnalyzeDocumentModelVersion: "",
    });

    const stats = await typeMetadata.getStatsFromDocument(document, frame);
    return [typeMetadata.type, stats];
}
