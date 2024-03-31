import levenshtein from "js-levenshtein";
import { typeList } from "../stats/types/typeList";

/**
 * For all the type of analysis that takes place, see if there are any matches.
 */
export function documentContainsAnyTypeTriggerWord(document: string): boolean {
    const classifiedType = typeList.find((type) => {
        return triggerWordsFoundInDocument(document, type.triggerWords);
    });
    return classifiedType !== undefined;
}

/**
 * Try to roughly guess if the given trigger words are present in a specific document.
 */
export function triggerWordsFoundInDocument(document: string, triggerWordList: string[]): boolean {
    const documentWordsSplit = document
        .toUpperCase()
        .replace("\n", " ")
        .split(/[\s-]+/);
    return triggerWordList
        .map((triggerWords) => {
            const triggerWordsSplit = triggerWords.split(" ");
            const hits = triggerWordsSplit.map((triggerWord) => {
                // Find the smallest levenshtein distance to any word in the document.
                const closestMatchInDocument = Math.min(
                    ...documentWordsSplit.map((documentWord) =>
                        levenshtein(triggerWord, documentWord),
                    ),
                );
                // Allow the odd mis-classified character.
                return closestMatchInDocument <= 1;
            });
            return hits.filter((hit) => hit).length === triggerWordsSplit.length;
        })
        .includes(true);
}
