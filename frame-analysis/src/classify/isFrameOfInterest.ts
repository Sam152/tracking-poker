import { documentContainsAnyTypeTriggerWord } from "./triggerWordsFoundInDocument";
import { ocrFrame } from "./ocrFrame";

/**
 * Attempt to classify the type of frame.
 *
 * Note: this function will frequently miss-classify different types of results frames, so their type determination
 * should only be used as a single that some kind of result stat is on the screen. Better post-analysis must be run
 * to determine the exact type of results that are being dealt with.
 */
export async function isFrameOfInterest(filePath: Buffer): Promise<boolean> {
    const document = await ocrFrame(filePath);
    return documentContainsAnyTypeTriggerWord(document);
}
