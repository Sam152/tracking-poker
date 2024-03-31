import {resolveBlocks, testFrames} from "../__fixtures__/fixturePath";
import fs from "fs";
import {getStatsFromBlocks} from "./getStatsFromBlocks";

describe("getAnalysisFromBlocks", () => {
    testFrames()
        .filter(frame => frame.labelledType !== undefined)
        .map(testFrame => {
            test(`Analysis of from ${testFrame.videoId}/${testFrame.frameId} resolved`, async () => {
                const analysis = await getStatsFromBlocks(await resolveBlocks(testFrame), fs.readFileSync(testFrame.framePath));
                expect(analysis).toMatchSnapshot(`${testFrame.videoId}/${testFrame.frameId}`);
            })
        });
});
