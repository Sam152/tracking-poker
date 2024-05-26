import path from "path";
import fs from "fs";
import { CumulativeWinnings } from "./CumulativeWinnings";
import * as trp from "amazon-textract-response-parser";
import { TextractDocument } from "amazon-textract-response-parser";
import { ApiBlock } from "amazon-textract-response-parser/dist/types/api-models/document";

function loadBlockFixture(name: string): TextractDocument {
    return new trp.TextractDocument({
        Blocks: JSON.parse(fs.readFileSync(path.join(__dirname, "/__fixtures__", `${name}.json`)).toString()) as any as ApiBlock[],
        DocumentMetadata: { Pages: 1 },
        AnalyzeDocumentModelVersion: "",
    });
}

function loadFrameFixture(name: string): Buffer {
    return fs.readFileSync(path.join(__dirname, "/__fixtures__", `${name}.jpg`));
}

describe("CumulativeWinnings", () => {
    // Busted players don't have a chip count, but their stats are still represented in a frame.
    test("extracting stats from a player that has busted", async () => {
        expect(
            await CumulativeWinnings.getStatsFromDocument(loadBlockFixture("cw-busted-player"), loadFrameFixture("cw-busted-player")),
        ).toEqual([
            { playerName: "MATT", stat: 83325 },
            {
                playerName: "TRICK TIME",
                stat: 74900,
            },
            { playerName: "BRITNEY", stat: 62075 },
            { playerName: "MARIANO", stat: 32725 },
            {
                playerName: "NIKOS",
                stat: 28025,
            },
            { playerName: "RYAN", stat: -48025 },
            { playerName: "ACTION DAN", stat: -55175 },
            {
                playerName: "L",
                stat: -63425,
            },
            {
                playerName: "CRYPTO DREW",
                stat: -114425,
            },
        ]);
    });
});
