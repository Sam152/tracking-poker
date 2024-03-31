import { PlayerStatCollection, StatMetadata, StatType } from "./StatType";
import { TextractDocument } from "amazon-textract-response-parser";
import { buildStatsFromLookBack } from "../buildStatsFromLookBack";

export const PreflopRaise: StatMetadata = {
    type: StatType.PreflopRaise,

    triggerWords: ["PRE FLOP RAISE", "PRE-FLOP RAISE"],

    getStatsFromDocument(
        extract: TextractDocument,
        frame: Buffer,
    ): Promise<PlayerStatCollection<number>> {
        const stats = buildStatsFromLookBack(
            extract,
            (text) => !!text.match(/^\d{1,2}%$/),
            (line) => parseInt(line.text.replace("%", "")),
        );
        return Promise.resolve(stats);
    },
};
