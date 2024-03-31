import {TestFrame, writeFixture} from "../__fixtures__/fixturePath";
import {Block} from "@aws-sdk/client-textract/dist-types/models/models_0";
import fs from "fs";
import {getBlocksFromFrame} from "./getBlocksFromFrame";

/**
 * Resolve blocks from the cached fixtures directory if they exist, or hydrate them from
 * the remote service.
 */
export async function resolveBlocks(frame: TestFrame): Promise<Block[]> {
    if (frame.extract.exists) {
        return JSON.parse(fs.readFileSync(frame.extract.cachePath).toString()) as Block[];
    }
    const frameImage = fs.readFileSync(frame.framePath);
    const analysis = await getBlocksFromFrame(frameImage);
    writeFixture(frame.extract.cachePath, JSON.stringify(analysis, undefined, 4));
    return analysis;
}

