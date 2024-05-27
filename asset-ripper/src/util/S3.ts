import fs from "fs";
import { S3, StorageClass } from "@aws-sdk/client-s3";
import { captureAWSv3Client } from "aws-xray-sdk";
import { PutObjectCommandOutput } from "@aws-sdk/client-s3/dist-types/commands/PutObjectCommand";
import { _Object } from "@aws-sdk/client-s3/dist-types/models/models_0";

export function put(key: string, localFilePath: string): Promise<PutObjectCommandOutput> {
    const file = fs.readFileSync(localFilePath);
    return putFromContents(key, file);
}

export function putFromContents(key: string, fileContents: string | Buffer): Promise<PutObjectCommandOutput> {
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

export async function get(key: string): Promise<string> {
    const client = captureAWSv3Client(new S3());
    const fileContents = await client.getObject({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
    });
    return await fileContents.Body!.transformToString();
}

export async function exists(key: string): Promise<boolean> {
    const client = captureAWSv3Client(new S3());
    try {
        await client.headObject({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        });
        return true;
    } catch {}
    return false;
}

export async function list(prefix: string): Promise<Required<_Object>[]> {
    const client = captureAWSv3Client(new S3());
    return ((
        await client.listObjects({
            Bucket: process.env.BUCKET_NAME,
            Prefix: prefix,
        })
    ).Contents || []) as Required<_Object>[];
}
