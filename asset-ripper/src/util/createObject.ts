import fs from "fs";
import { S3, StorageClass } from "@aws-sdk/client-s3";
import { captureAWSv3Client } from "aws-xray-sdk";

export function createObject(key: string, localFilePath: string) {
    const client = captureAWSv3Client(new S3());
    const file = fs.readFileSync(localFilePath);
    const fileSize = Buffer.byteLength(file);

    // The cheaper storage class has a minimum object size of 128kb, but it is much less expensive, we can therefore
    // find the break-even cost between the two storage classes (55kb) and store files conditionally based on thier
    // size, to optimise for cost.
    const storageClass = fileSize > 55 * 1000 ? StorageClass.ONEZONE_IA : StorageClass.STANDARD;

    console.log(
        `Creating object "s3://${process.env.BUCKET_NAME}/${key}" from "${localFilePath}" (${fileSize} bytes, ${storageClass} storage class).`,
    );

    return client.putObject({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: fs.readFileSync(localFilePath),
        StorageClass: storageClass,
    });
}
