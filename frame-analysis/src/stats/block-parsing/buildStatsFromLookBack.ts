import { LineGeneric } from "amazon-textract-response-parser/dist/types/content";
import { Line, Page, TextractDocument } from "amazon-textract-response-parser";
import { PlayerStatCollection } from "../types/StatType";
import { looksLikePlayerName } from "../util/looksLikePlayerName";

/**
 * Find stats with lines organised as:
 *
 * XXX
 * YYY - matchCondition identifies line
 * Creates: {playerName: XXX, stat: YYY}
 */
export function buildStatsFromLookBack<T extends string | number>(
    extract: TextractDocument,
    matchCondition: (lineText: string) => boolean,
    parser: (input: Line) => T,
) {
    const page = extract.pageNumber(1);
    const lines = [...page.iterLines()];
    return lines.reduce((stats: PlayerStatCollection<T>, line: LineGeneric<Page>, index) => {
        if (matchCondition(line.text) && looksLikePlayerName(lines[index - 1].text)) {
            stats.push({
                stat: parser(line),
                playerName: lines[index - 1].text,
            });
        }
        return stats;
    }, []);
}
