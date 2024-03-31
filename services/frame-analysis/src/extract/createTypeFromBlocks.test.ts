import {testFrames} from "../__fixtures__/fixturePath";
import {createTypeFromBlocks} from "./createTypeFromBlocks";
import {resolveExtraction} from "./resolveExtraction";

jest.setTimeout(60 * 60 * 1000);

describe("createTypeFromBlocks", () => {
    testFrames()
        .filter(frame => frame.labelledType !== undefined)
        .map(testFrame => {
            test(`Frame ${testFrame.videoId}/${testFrame.frameId} resolved type ${testFrame.framePath} ${testFrame.extract.cachePath}`, async () => {
                const extraction = await resolveExtraction(testFrame);
                const type = createTypeFromBlocks(extraction);
                expect(type).toBeInstanceOf(testFrame.labelledType);
            })
        });
});
