import { resolveBlocks, testFrames } from "../../__fixtures__/fixturePath";

jest.setTimeout(60 * 60 * 1000);

// This test specifically deals with building a local corpus of assets to assist with development.
describe("extractBlocksFromFrame", () => {
    test("false positive frame can be extracted", async () => {
        const ocrFalsePositive = testFrames().find((frame) => frame.videoId === "-aLsrDQUQZw" && frame.frameId === "zilch_0091")!;
        const extraction = await resolveBlocks(ocrFalsePositive);
        expect(extraction.length).toBeGreaterThan(0);
    });

    testFrames()
        .filter((frame) => frame.labelledType !== undefined)
        .map((frame) => {
            test(`${frame.videoId}/${frame.frameId} extracted blocks`, async () => {
                const extraction = await resolveBlocks(frame);
                expect(extraction.length).toBeGreaterThan(0);
            });
        });
});
