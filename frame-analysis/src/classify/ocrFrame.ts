import * as Tesseract from "tesseract.js";
import { OEM, PSM } from "tesseract.js";
import path from "path";
import { cropMiddle } from "../preprocess/cropMiddle";
import { threshold } from "../preprocess/threshold";

/**
 * Take a frame and use tesseract to do OCR.
 *
 * In testing, this is a course-grained OCR which is good enough to classify a frame as "interesting" or not, but
 * not enough to extract meaningful statistics from more accurate (but more expensive) models.
 */
export async function ocrFrame(file: Buffer, mode: PSM = PSM.SPARSE_TEXT) {
    const worker = await Tesseract.createWorker("eng", OEM.LSTM_ONLY, {
        cachePath: path.join(__dirname, "../../bin"),
        logger: () => null,
    });

    await worker.setParameters({
        // Methods are described in:
        // @see https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html#page-segmentation-method#page-segmentation-method
        tessedit_pageseg_mode: mode,

        // Our words are not in the dictionary.
        language_model_penalty_increment: 0.0,
        language_model_penalty_non_dict_word: 0.0,
        language_model_penalty_non_freq_dict_word: 0.0,

        // For some reason fixing the DPI seems to improve performance.
        user_defined_dpi: "350",
    });

    const processed = await threshold(await cropMiddle(file));
    const result = await worker.recognize(processed);
    await worker.terminate();

    return result.data.text;
}
