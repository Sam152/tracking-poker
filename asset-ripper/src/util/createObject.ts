import fs from "fs";
import { S3, StorageClass } from "@aws-sdk/client-s3";
import { captureAWSv3Client } from "aws-xray-sdk";
import { PutObjectCommandOutput } from "@aws-sdk/client-s3/dist-types/commands/PutObjectCommand";

export function createObject(key: string, localFilePath: string): Promise<PutObjectCommandOutput> {
    const file = fs.readFileSync(localFilePath);
    return createObjectFromContents(key, file);
}

export function createObjectFromContents(key: string, fileContents: string | Buffer): Promise<PutObjectCommandOutput> {
    const client = captureAWSv3Client(new S3());
    const fileSize = Buffer.byteLength(fileContents);

    // The cheaper storage class has a minimum object size of 128kb, but it is much less expensive, we can therefore
    // find the break-even cost between the two storage classes (55kb) and store files conditionally based on thier
    // size, to optimise for cost.
    const storageClass = fileSize > 55 * 1000 ? StorageClass.ONEZONE_IA : StorageClass.STANDARD;

    console.log(
        `Creating object "s3://${process.env.BUCKET_NAME}/${key}" from string (${fileSize} bytes, ${storageClass} storage class).`,
    );

    return client.putObject({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: fileContents,
        StorageClass: storageClass,
    });
}
