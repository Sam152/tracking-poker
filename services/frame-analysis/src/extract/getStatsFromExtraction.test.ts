import {testFrames} from "../__fixtures__/fixturePath";
import {resolveExtraction} from "./resolveExtraction";
import fs from "fs";
import {getStatsFromExtraction} from "./getStatsFromExtraction";

describe("getAnalysisFromBlocks", () => {
    testFrames()
        .filter(frame => frame.labelledType !== undefined)
        .map(testFrame => {
            test(`Analysis of from ${testFrame.videoId}/${testFrame.frameId} resolved`, async () => {
                const analysis = await getStatsFromExtraction(await resolveExtraction(testFrame), fs.readFileSync(testFrame.framePath));
                expect(analysis).toMatchSnapshot(`${testFrame.videoId}/${testFrame.frameId}`);
            })
        });
});
