import { PlayerStatCollection, StatMetadata, StatType } from "./StatType";
import { TextractDocument } from "amazon-textract-response-parser";
import { looksLikeMoney, parseMoney } from "../looksLikeMoney";
import { buildStatsFromLookBack } from "../buildStatsFromLookBack";

export const ChipCount: StatMetadata = {
    type: StatType.ChipCount,

    triggerWords: ["CHIP COUNT", "COUNT"],

    getStatsFromDocument(
        extract: TextractDocument,
        frame: Buffer,
    ): Promise<PlayerStatCollection<number>> {
        const stats = buildStatsFromLookBack(extract, looksLikeMoney, (line) =>
            parseMoney(line.text),
        );
        return Promise.resolve(stats);
    },
};
