import { toMatchImageSnapshot } from "jest-image-snapshot";
import { resolveBlocks, testFrames } from "../../__fixtures__/fixturePath";
import * as trp from "amazon-textract-response-parser";
import { Geometry, Page } from "amazon-textract-response-parser";
import { ApiBlock } from "amazon-textract-response-parser/dist/types/api-models/document";
import { buildStatsFromLookBackAndAhead } from "../buildStatsFromLookBack";
import { looksLikeMoney } from "../looksLikeMoney";
import { cropUpDownSection } from "./cropUpDownSection";
import fs from "fs";
import { ApiLineBlock } from "amazon-textract-response-parser/dist/types/api-models/content";
import { LineGeneric } from "amazon-textract-response-parser/dist/types/content";
import { StatType } from "../types/StatType";

expect.extend({ toMatchImageSnapshot });
jest.setTimeout(6 * 60 * 60 * 1000);

describe("cropUpDownSection", () => {
    testFrames()
        .filter((frame) => frame.labelledType === StatType.CumulativeWinnings)
        .map((frame) => {
            test(`frame ${frame.videoId}/${frame.frameId} arrows cropped`, async () => {
                const extract = new trp.TextractDocument({
                    Blocks: (await resolveBlocks(frame)) as any as ApiBlock[],
                    DocumentMetadata: { Pages: 1 },
                    AnalyzeDocumentModelVersion: "",
                });
                const frameImage = fs.readFileSync(frame.framePath);

                const geometry: Geometry<ApiLineBlock, LineGeneric<Page>>[] = [];
                buildStatsFromLookBackAndAhead(extract, looksLikeMoney, (line) => {
                    geometry.push(line.geometry);
                    return 1;
                });

                let index = 0;
                for (const geometryItem of geometry) {
                    expect(await cropUpDownSection(frameImage, geometryItem.boundingBox)).toMatchImageSnapshot({
                        customSnapshotIdentifier: `frame-${frame.videoId}-${frame.frameId}-${index}`,
                    });
                    index++;
                }
            });
        });
});
