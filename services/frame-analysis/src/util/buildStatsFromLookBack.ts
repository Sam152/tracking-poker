import {LineGeneric} from "amazon-textract-response-parser/dist/types/content";
import {Line, Page, TextractDocument} from "amazon-textract-response-parser";
import {PlayerStatCollection} from "../types/typeCollection";

/**
 * Find stats with lines organised as:
 *
 * XXX
 * YYY - matchCondition identifies line
 * Creates: {playerName: XXX, stat: YYY}
 */
export function buildStatsFromLookBack<T extends string|number>(extract: TextractDocument, matchCondition: (lineText: string) => boolean, parser: ((input: Line) => T)) {
    const page = extract.pageNumber(1);
    const lines = [...page.iterLines()];
    return lines.reduce((stats: PlayerStatCollection<T>, line: LineGeneric<Page>, index) => {
        if (matchCondition(line.text)) {
            stats.push({
                stat: parser(line),
                playerName: lines[index - 1].text,
            });
        }
        return stats;
    }, []);
}

/**
 * Find stats with lines organised as both `buildStatsFromLookBack` and additionally:
 *
 * XXX1
 * YYY1 - matchCondition identifies line
 * YYY2 - matchCondition identifies line
 * XXX2
 * YYY3 - matchCondition identifies line
 * YYY4 - matchCondition identifies line
 *
 * Creates:
 *   - {playerName: XXX1, stat: YYY2}
 *   - {playerName: XXX2, stat: YYY4}
 *
 * This is required because the cumulative winnings sometimes includes a chip count and sometimes does not.
 */
export function buildStatsFromLookBackAndAhead<T extends string|number>(extract: TextractDocument, matchCondition: (lineText: string) => boolean, parser: ((input: Line) => T)) {
    const page = extract.pageNumber(1);
    const lines = [...page.iterLines()];

    // If the document has no two consecutive lines that match the condition, we are likely dealing with a document that
    // is formatted according to `buildStatsFromLookBack`
    const containsAnyTwoConsecutiveMatchingLines = lines.find((line, index) => {
        if (index === 0) {
            return false;
        }
        return matchCondition(line.text) && matchCondition(lines[index - 1].text);
    });
    if (!containsAnyTwoConsecutiveMatchingLines) {
        return buildStatsFromLookBack(extract, matchCondition, parser);
    }

    return lines.reduce((stats: PlayerStatCollection<T>, line: LineGeneric<Page>, index) => {
        // If the current line and the line before match the condition.
        if (matchCondition(line.text) && matchCondition(lines[index - 1].text)) {

            if (matchCondition(lines[index - 2].text)) {
                throw new Error('Something went wrong, there are three consecutive matching lines.');
            }

            stats.push({
                stat: parser(line),
                // Look back two places.
                playerName: lines[index - 2].text,
            });
        }
        return stats;
    }, []);
}
