import { AnalyzeDocumentCommand, FeatureType, ProvisionedThroughputExceededException, TextractClient } from "@aws-sdk/client-textract";
import { Block } from "@aws-sdk/client-textract/dist-types/models/models_0";
import { cropMiddle } from "../../preprocess/cropMiddle";
import { sleepRandom } from "../../util/sleepRandom";

const MAX_RETRIES_FROM_THROTTLE = 5;

export async function getBlocksFromFrame(data: Buffer, attempt: number = 1): Promise<Block[]> {
    const client = new TextractClient();

    // Crop the middle to prevent junk from appearing in the extracted result.
    const middleCropped = await cropMiddle(data);

    try {
        const result = await client.send(
            new AnalyzeDocumentCommand({
                Document: { Bytes: middleCropped },
                FeatureTypes: [FeatureType.TABLES],
            }),
        );
        if (!result.Blocks) {
            throw new Error("Blocks not found in response to document analysis");
        }
        return result.Blocks;
    } catch (e) {
        console.error(e);
        // There is a default maximum of 1 document analysis per second, use this mechanism to retry after some amount
        // of time to work around the limitation.
        if (e instanceof ProvisionedThroughputExceededException && attempt < MAX_RETRIES_FROM_THROTTLE) {
            console.log(`Retrying analysis after throttling, attempt: ${attempt}`);
            await sleepRandom(3, 10);
            return getBlocksFromFrame(data, attempt + 1);
        }

        throw e;
    }
}
