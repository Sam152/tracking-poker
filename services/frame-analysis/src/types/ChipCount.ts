import {FrameAnalysisType} from "./FrameAnalysisType";
import {TextractDocument} from "amazon-textract-response-parser";
import {PlayerStatCollection} from "./typeCollection";
import {looksLikeMoneyStat, parseMoney} from "../util/looksLikeMoneyStat";
import {buildStatsFromLookBack} from "../util/buildStatsFromLookBack";

export class ChipCount implements FrameAnalysisType<number> {
    getTriggerWords(): string[] {
        return [
            "CHIP COUNT",
            "COUNT",
        ];
    }

    getStatsFromDocument(extract: TextractDocument, frame: Buffer): Promise<PlayerStatCollection<number>> {
        const stats = buildStatsFromLookBack(extract, looksLikeMoneyStat, (line) => parseMoney(line.text));
        return Promise.resolve(stats);
    }

}
