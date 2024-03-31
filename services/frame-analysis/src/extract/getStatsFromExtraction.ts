import {Block} from "@aws-sdk/client-textract/dist-types/models/models_0";
import {FrameAnalysisType} from "../types/FrameAnalysisType";
import {PlayerStatCollection} from "../types/typeCollection";
import * as trp from "amazon-textract-response-parser";
import {ApiBlock} from "amazon-textract-response-parser/dist/types/api-models/document";
import {createTypeFromBlocks} from "./createTypeFromBlocks";

export async function getStatsFromExtraction(blocks: Block[], frame: Buffer): Promise<[type: FrameAnalysisType<any>, analysis: PlayerStatCollection<string | number>]> {
    const type = createTypeFromBlocks(blocks);
    if (!type) {
        throw new Error('Unable to resolve type when getting analysis from blocks.');
    }

    const document = new trp.TextractDocument({
        Blocks: blocks as any as ApiBlock[],
        DocumentMetadata: {Pages: 1},
        AnalyzeDocumentModelVersion: '',
    });

    const analysis = await type.getStatsFromDocument(document, frame);
    return [type, analysis];
}
