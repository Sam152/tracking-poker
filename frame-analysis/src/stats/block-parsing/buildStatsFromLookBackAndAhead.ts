import { LineGeneric } from "amazon-textract-response-parser/dist/types/content";
import { Line, Page, TextractDocument } from "amazon-textract-response-parser";
import { PlayerStatCollection } from "../types/StatType";
import { buildStatsFromLookBack } from "./buildStatsFromLookBack";
import { looksLikePlayerName } from "../util/looksLikePlayerName";

/**
 * Find stats with lines organised as both `buildStatsFromLookBack` and additionally:
 *
 * XXX1
 * YYY1 - matchCondition identifies line
 * YYY2 - matchCondition identifies line
 * XXX2
 * YYY3 - matchCondition identifies line
 * YYY4 - matchCondition identifies line
 * XXX3
 * YYY5 - matchCondition identifies line
 *
 * Creates:
 *   - {playerName: XXX1, stat: YYY2}
 *   - {playerName: XXX2, stat: YYY4}
 *   - {playerName: XXX3, stat: YYY5} // <-- stat from a busted player, not including a chip stack.
 *
 * This is required because the cumulative winnings sometimes includes a chip count and sometimes does not.
 */
export function buildStatsFromLookBackAndAhead<T extends string | number>(
    extract: TextractDocument,
    matchCondition: (lineText: string) => boolean,
    parser: (input: Line) => T,
) {
    const page = extract.pageNumber(1);
    const lines = [...page.iterLines()];

    // If the document has no two consecutive lines that match the condition, we are likely dealing with a document that
    // is formatted according to `buildStatsFromLookBack`. This is required because the CW stats are in two formats,
    // one that contains the chip count and one that does not. @todo, grab a test case for this scenario.
    const containsAnyTwoConsecutiveMatchingLines = lines.find((line, index) => {
        if (index === 0) {
            return false;
        }
        return matchCondition(line.text) && matchCondition(lines[index - 1].text);
    });
    if (!containsAnyTwoConsecutiveMatchingLines) {
        return buildStatsFromLookBack(extract, matchCondition, parser);
    }

    const stats = lines.reduce((stats: PlayerStatCollection<T>, line: LineGeneric<Page>, index) => {
        // If the current line and the line before match the condition.
        if (matchCondition(line.text) && matchCondition(lines[index - 1].text) && looksLikePlayerName(lines[index - 2].text)) {
            stats.push({
                stat: parser(line),
                // Look back two places.
                playerName: lines[index - 2].text,
            });
        }
        return stats;
    }, []);

    // Do a second pass over the lines and look for players that busted (ie, only includes a cumulative winning stat,
    // but no chip stack).
    const playersThatDidNotBust = stats.map((stat) => stat.playerName);
    const bustedPlayerStats = lines.reduce((stats: PlayerStatCollection<T>, line: LineGeneric<Page>, index) => {
        if (
            matchCondition(line.text) &&
            looksLikePlayerName(lines[index - 1].text) &&
            !playersThatDidNotBust.includes(lines[index - 1].text)
        ) {
            stats.push({
                stat: parser(line),
                playerName: lines[index - 1].text,
            });
        }
        return stats;
    }, []);

    return [...stats, ...bustedPlayerStats];
}
