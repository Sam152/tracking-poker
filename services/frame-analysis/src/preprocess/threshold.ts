// The percentage of the middle of the image that shows areas of interest.
import sharp from "sharp";

/**
 * Preprocess frames to improve OCR accuracy.
 */
export async function threshold(filePath: Buffer): Promise<Buffer> {
    const frame = sharp(filePath);
    // Apply a threshold to clean up noisy images, this may fail if text is ever non-white, but it seems to be white
    // in every test case I can find. A fix for this, without integrating much more complexity could be to simply
    // concatenate documents together with varying thresholds.
    frame.threshold(130);
    return frame.toBuffer();
}
