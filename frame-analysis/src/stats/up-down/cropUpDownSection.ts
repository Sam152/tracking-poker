import {BoundingBox} from "amazon-textract-response-parser";
import sharp from "sharp";
import {cropMiddle} from "../../preprocess/cropMiddle";

export async function cropUpDownSection(frame: Buffer, boundingBox: BoundingBox<any, any>) {
    const middle = await cropMiddle(frame);
    const image = sharp(middle);

    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height) {
        throw new Error('Metadata from CW analysis could not be loaded.');
    }

    const statsImage = image.extract({
        top: Math.floor(boundingBox.top * metadata.height!),
        height: 24,
        left: metadata.width - 59,
        width: 30,
    });

    return statsImage.threshold(100).toBuffer();
}
