import {extractBlocksFromFrame} from "./extractBlocksFromFrame";
import {testFrames} from "../__fixtures__/fixturePath";
import {resolveExtraction} from "./resolveExtraction";

jest.setTimeout(60 * 60 * 1000);

describe("extractBlocksFromFrame", () => {

    test('false positive frame can be extracted', async () => {
        const ocrFalsePositive = testFrames().find(frame => frame.videoId === '-aLsrDQUQZw' && frame.frameId === 'zilch_0091')!;
        const extraction = await resolveExtraction(ocrFalsePositive);
        expect(extraction.length).toBeGreaterThan(0);
    });

    testFrames()
        .filter(frame => frame.labelledType !== undefined)
        .map(frame => {
            test(`${frame.videoId}/${frame.frameId} extracted blocks`, async () => {
                const extraction = await resolveExtraction(frame);
                expect(extraction.length).toBeGreaterThan(0);
            });
        });
});
