import { PlayerStatCollection, StatMetadata, StatType } from "./StatType";
import { Geometry, Page, TextractDocument } from "amazon-textract-response-parser";
import { buildStatsFromLookBackAndAhead } from "../buildStatsFromLookBack";
import { looksLikeMoney, parseMoney } from "../looksLikeMoney";
import { ApiLineBlock } from "amazon-textract-response-parser/dist/types/api-models/content";
import { LineGeneric } from "amazon-textract-response-parser/dist/types/content";
import { cropUpDownSection } from "../up-down/cropUpDownSection";
import { classifyUpDown } from "../up-down/classifyUpDown";

export const CumulativeWinnings: StatMetadata = {
    type: StatType.CumulativeWinnings,

    triggerWords: ["CUMULATIVE", "WINNINGS"],

    async getStatsFromDocument(
        extract: TextractDocument,
        frame: Buffer,
    ): Promise<PlayerStatCollection<number>> {
        const geometry: Geometry<ApiLineBlock, LineGeneric<Page>>[] = [];
        const stats = buildStatsFromLookBackAndAhead(extract, looksLikeMoney, (line) => {
            geometry.push(line.geometry);
            return parseMoney(line.text);
        });

        // Modify the stats value by a multiplayer, calculating if a given player was up or down, based on detecting the
        // direction of the arrow next to their name.
        for (let i = 0; i < stats.length; i++) {
            const upDownArrow = await cropUpDownSection(frame, geometry[i].boundingBox);
            const multiplier = await classifyUpDown(upDownArrow);
            stats[i].stat *= multiplier;
        }

        return stats;
    },
};
