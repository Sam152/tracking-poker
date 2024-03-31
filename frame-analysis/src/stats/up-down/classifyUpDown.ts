import sharp from "sharp";

type UpOrDown = 1 | -1;

/**
 * Measure a trend in light or dark pixels. If the trend is for white pixels to generally increase, an arrow is
 * classified as pointing up, otherwise down.
 */
export async function classifyUpDown(image: Buffer): Promise<UpOrDown> {
    const frame = sharp(image);
    const metadata = await frame.metadata();

    let previousRowWhitePixels = 0;
    const trend: number[] = [];

    for (let i = 0; i < metadata.height! - 1; i++) {
        const row = frame.clone().extract({
            top: i,
            height: 1,
            left: 0,
            width: metadata.width!,
        });
        const totalWhitePixels = [...(await row.raw().toBuffer())]
            .map((value) => (value > 100 ? 1 : 0))
            .reduce((count: number, value: number) => count + value, 0);

        if (totalWhitePixels === previousRowWhitePixels) {
            trend.push(0);
        } else {
            trend.push(totalWhitePixels > previousRowWhitePixels ? 1 : -1);
        }
        previousRowWhitePixels = totalWhitePixels;
    }

    return trend.reduce((count: number, value: number) => count + value, 0) > 0
        ? 1
        : -1;
}
