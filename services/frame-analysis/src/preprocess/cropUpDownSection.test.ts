import {toMatchImageSnapshot} from "jest-image-snapshot";
import {testFrames} from "../__fixtures__/fixturePath";
import {CumulativeWinnings} from "../types/CumulativeWinnings";
import * as trp from "amazon-textract-response-parser";
import {Geometry, Page} from "amazon-textract-response-parser";
import {resolveExtraction} from "../extract/resolveExtraction";
import {ApiBlock} from "amazon-textract-response-parser/dist/types/api-models/document";
import {buildStatsFromLookBackAndAhead} from "../util/buildStatsFromLookBack";
import {looksLikeMoneyStat} from "../util/looksLikeMoneyStat";
import {cropUpDownSection} from "./cropUpDownSection";
import fs from "fs";
import {ApiLineBlock} from "amazon-textract-response-parser/dist/types/api-models/content";
import {LineGeneric} from "amazon-textract-response-parser/dist/types/content";

expect.extend({toMatchImageSnapshot});
jest.setTimeout(6 * 60 * 60 * 1000);

describe("cropUpDownSection", () => {
    testFrames()
        .filter(frame => frame.labelledType === CumulativeWinnings)
        .map(frame => {
            test(`frame ${frame.videoId}/${frame.frameId} arrows classified`, async () => {

                const extract = new trp.TextractDocument({
                    Blocks: await resolveExtraction(frame) as any as ApiBlock[],
                    DocumentMetadata: {Pages: 1},
                    AnalyzeDocumentModelVersion: '',
                });
                const frameImage = fs.readFileSync(frame.framePath);

                const geometry: Geometry<ApiLineBlock, LineGeneric<Page>>[] = [];
                buildStatsFromLookBackAndAhead(extract, looksLikeMoneyStat, (line) => {
                    geometry.push(line.geometry);
                    return 1;
                });

                let index = 0;
                for (const geometryItem of geometry) {
                    expect(await cropUpDownSection(frameImage, geometryItem.boundingBox)).toBeDefined();
                    // expect(await cropUpDownSection(frameImage, geometryItem.boundingBox)).toMatchImageSnapshot({
                    //     customSnapshotIdentifier: `frame-${frame.videoId}-${frame.frameId}-${index}`,
                    // });
                    index++;
                }
            });
        });
});
