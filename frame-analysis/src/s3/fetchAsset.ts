import { S3 } from "@aws-sdk/client-s3";

export async function fetchAsset(bucket: string, key: string): Promise<Buffer> {
    console.log(`Starting download of s3://${bucket}/${key}`);
    const client = new S3();
    const image = await client.getObject({ Bucket: bucket, Key: key });
    const body = await image.Body?.transformToByteArray();

    if (!body) {
        throw new Error(`Could not download asset s3://${bucket}/${key}`);
    }
    return Buffer.from(body);
}
