import {FrameAnalysisType} from "./FrameAnalysisType";
import {TextractDocument} from "amazon-textract-response-parser";
import {PlayerStatCollection} from "./typeCollection";
import {buildStatsFromLookBack} from "../util/buildStatsFromLookBack";

export class VPIP implements FrameAnalysisType<number> {
    getTriggerWords(): string[] {
        return ["VPIP"];
    }

    getStatsFromDocument(extract: TextractDocument, frame: Buffer): Promise<PlayerStatCollection<number>> {
        const stats = buildStatsFromLookBack(
            extract, (text) => !!text.match(/^\d{1,2}%$/),
            (line) => parseInt(line.text.replace('%', ''))
        );
        return Promise.resolve(stats);
    }
}
