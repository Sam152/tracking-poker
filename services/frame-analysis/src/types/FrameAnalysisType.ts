import {TextractDocument} from "amazon-textract-response-parser";
import {PlayerStatCollection} from "./typeCollection";

export interface FrameAnalysisType<TStatType extends string|number> {

    /**
     * The word that should be detected using cheap (but inaccurate) OCR,
     * before triggering more expensive Textract OCR.
     *
     * Phrases in a single string like "FOO BAR", indicate both FOO and BAR
     * are required to have some degree of representation in the document.
     *
     * Phrases within the array are only required to match a single time,
     * for example ["FOO", "BAR"] would match if either was represented
     * in the document.
     */
    getTriggerWords(): string[];

    /**
     * Get the frame analysis stats from a given document.
     */
    getStatsFromDocument(extract: TextractDocument, frame: Buffer): Promise<PlayerStatCollection<number>>;
}
