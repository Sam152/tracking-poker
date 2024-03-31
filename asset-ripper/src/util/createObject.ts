import fs from "fs";
import {S3} from "@aws-sdk/client-s3";

export function createObject(key: string, localFilePath: string) {
    console.log(`Creating object "s3://${process.env.BUCKET_NAME}/${key}" from "${localFilePath}".`);
    const client = new S3();
    return client.putObject({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: fs.readFileSync(localFilePath),
    });
}
