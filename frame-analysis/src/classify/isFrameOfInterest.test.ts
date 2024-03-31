import { isFrameOfInterest } from "./isFrameOfInterest";
import * as fs from "fs";
import { documentContainsAnyTypeTriggerWord } from "./triggerWordsFoundInDocument";
import { ocrFrame } from "./ocrFrame";
import { fixturePath, TestFrame, testFrames, writeFixture } from "../__fixtures__/fixturePath";

jest.setTimeout(6 * 60 * 60 * 1000);

/**
 * Test that:
 *  - Takes each pre-labelled fixture.
 *  - Runs OCR and caches the result (to speed up future runs).
 *  - Validates if a given frame is of interest or not.
 *  - Counts the total number of false positives.
 */
describe("classifyIsFrameOfInterest", () => {
    test("function returns correct classification", async () => {
        expect(
            await isFrameOfInterest(fs.readFileSync(fixturePath("frames/-_HPip8wiYk/cc_1.jpg"))),
        ).toEqual(true);
    });

    // Cases that cannot be classified in our dataset. This is acceptable in small numbers given there
    // are multiple frames per stat and some stats in general aren't that integrating to aggregate.
    const knownErrors = ["-njynZfx9mg/cc_1", "-aLsrDQUQZw/zilch_0091"];
    testFrames()
        .filter((frame) => !knownErrors.includes(`${frame.videoId}/${frame.frameId}`))
        .map((testFrame) => {
            test(`${testFrame.videoId}/${testFrame.frameId} identified (${testFrame.framePath}) (${testFrame.ocr.cachePath})`, async () => {
                const document = await resolveDocument(testFrame);
                const result = documentContainsAnyTypeTriggerWord(document);
                // Binary classification between interesting or not.
                (testFrame.labelledType === undefined
                    ? expect(result).not
                    : expect(result)
                ).toEqual(true);
            });
        });

    test(`false positive rate`, async () => {
        const falsePositives = testFrames()
            .filter((frame) => frame.labelledType === undefined)
            .map((frame) => zilchFrameIsMisclassified(frame));
        const results = await Promise.all(falsePositives);
        expect(results.filter((result) => result).length).toEqual(1);
    });
});

async function zilchFrameIsMisclassified(frame: TestFrame): Promise<boolean> {
    const document = await resolveDocument(frame);
    return documentContainsAnyTypeTriggerWord(document);
}

async function resolveDocument(frame: TestFrame): Promise<string> {
    if (!frame.ocr.exists) {
        const document = await ocrFrame(fs.readFileSync(frame.framePath));
        writeFixture(frame.ocr.cachePath, document);
        return document;
    }
    return fs.readFileSync(frame.ocr.cachePath).toString();
}
