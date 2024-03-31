import {FrameAnalysisType} from "./FrameAnalysisType";
import {Geometry, Page, TextractDocument} from "amazon-textract-response-parser";
import {PlayerStatCollection} from "./typeCollection";
import {buildStatsFromLookBackAndAhead} from "../util/buildStatsFromLookBack";
import {looksLikeMoneyStat, parseMoney} from "../util/looksLikeMoneyStat";
import {ApiLineBlock} from "amazon-textract-response-parser/dist/types/api-models/content";
import {LineGeneric} from "amazon-textract-response-parser/dist/types/content";
import {cropUpDownSection} from "../preprocess/cropUpDownSection";
import {extractUpDownFromImage} from "../extract/extractUpDownFromImage";

export class CumulativeWinnings implements FrameAnalysisType<number> {
    getTriggerWords(): string[] {
        return [
            "CUMULATIVE",
            "WINNINGS",
        ];
    }

    async getStatsFromDocument(extract: TextractDocument, frame: Buffer): Promise<PlayerStatCollection<number>> {
        const geometry: Geometry<ApiLineBlock, LineGeneric<Page>>[] = [];
        const stats = buildStatsFromLookBackAndAhead(extract, looksLikeMoneyStat, (line) => {
            geometry.push(line.geometry);
            return parseMoney(line.text);
        });

        // Modify the stats value by a multiplayer, calculating if a given player was up or down, based on detecting the
        // direction of the arrow next to their name.
        for (let i = 0; i < stats.length; i++) {
            const upDownArrow = await cropUpDownSection(frame, geometry[i].boundingBox);
            const multiplier = await extractUpDownFromImage(upDownArrow);
            stats[i].stat *= multiplier;
        }

        return stats;
    }

}
