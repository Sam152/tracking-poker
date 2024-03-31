import sharp from "sharp";

type UpOrDown = 1 | -1;

/**
 * Measure a trend in light or dark pixels. If the trend is for white pixels to generally increase,
 * an arrow is classified as pointing up, otherwise down.
 */
export async function classifyUpDown(image: Buffer): Promise<UpOrDown> {
    const frame = sharp(image);
    const metadata = await frame.metadata();

    let previousWhitePixelsInRow = 0;
    let trendCount: number = 0;

    for (let i = 0; i < metadata.height! - 1; i++) {
        const row = frame.clone().extract({ top: i, height: 1, left: 0, width: metadata.width! });
        const whitePixelsInRow = [...(await row.raw().toBuffer())].filter(
            (rgbValue) => rgbValue === 255,
        ).length;
        trendCount += Math.sign(whitePixelsInRow - previousWhitePixelsInRow);
        previousWhitePixelsInRow = whitePixelsInRow;
    }

    return trendCount > 0 ? 1 : -1;
}
