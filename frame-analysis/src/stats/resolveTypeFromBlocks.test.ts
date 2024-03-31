import { resolveBlocks, testFrames } from "../__fixtures__/fixturePath";
import { resolveTypeFromBlocks } from "./resolveTypeFromBlocks";

jest.setTimeout(60 * 60 * 1000);

describe("createTypeFromBlocks", () => {
    testFrames()
        .filter((frame) => frame.labelledType !== undefined)
        .map((testFrame) => {
            test(`Frame ${testFrame.videoId}/${testFrame.frameId} resolved type ${testFrame.framePath} ${testFrame.extract.cachePath}`, async () => {
                const extraction = await resolveBlocks(testFrame);
                const typeMetadata = resolveTypeFromBlocks(extraction);
                expect(typeMetadata!.type).toEqual(testFrame.labelledType);
            });
        });
});
