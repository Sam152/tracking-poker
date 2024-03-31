import {PlayerStatCollection, StatMetadata, StatType} from "./StatType";
import {TextractDocument} from "amazon-textract-response-parser";
import {buildStatsFromLookBack} from "../buildStatsFromLookBack";

export const VPIP: StatMetadata = {

    type: StatType.VPIP,

    triggerWords: ["VPIP"],

    getStatsFromDocument(extract: TextractDocument, frame: Buffer): Promise<PlayerStatCollection<number>> {
        const stats = buildStatsFromLookBack(
            extract, (text) => !!text.match(/^\d{1,2}%$/),
            (line) => parseInt(line.text.replace('%', ''))
        );
        return Promise.resolve(stats);
    }
}
