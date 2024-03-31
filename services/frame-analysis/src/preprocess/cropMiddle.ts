import sharp from "sharp";

const MIDDLE_PERCENTAGE = 0.43;

export async function cropMiddle(image: Buffer) {
    const frame = sharp(image);
    const metadata = await frame.metadata();
    frame.extract({
        top: 0,
        height: metadata.height!,
        left: Math.floor(metadata.width! * ((1 - MIDDLE_PERCENTAGE) / 2)),
        width: Math.floor(metadata.width! * MIDDLE_PERCENTAGE),
    });
    return frame.toBuffer();
}
