import { AnalyzeDocumentCommand, FeatureType, TextractClient } from "@aws-sdk/client-textract";
import { Block } from "@aws-sdk/client-textract/dist-types/models/models_0";
import { cropMiddle } from "../../preprocess/cropMiddle";

export async function getBlocksFromFrame(data: Buffer): Promise<Block[]> {
    const client = new TextractClient();
    const result = await client.send(
        new AnalyzeDocumentCommand({
            Document: {
                // Crop the middle to prevent junk from appearing in the extracted result.
                Bytes: await cropMiddle(data),
            },
            FeatureTypes: [FeatureType.TABLES],
        }),
    );
    if (!result.Blocks) {
        throw new Error("Blocks not found in response to document analysis");
    }
    return result.Blocks;
}
