import { _Object, PutObjectCommandOutput, S3, StorageClass } from "@aws-sdk/client-s3";
import { captureAWSv3Client } from "aws-xray-sdk";
import * as fs from "node:fs";

export type ListedObject = Required<Pick<_Object, "Key" | "Size">>;

export type ObjectStorage = {
    putFile(key: string, localFilePath: string): Promise<PutObjectCommandOutput>;
    put(key: string, fileContents: string | Buffer): Promise<PutObjectCommandOutput>;
    getString(key: string): Promise<string>;
    get(key: string): Promise<Buffer>;
    exists(key: string): Promise<boolean>;
    list(prefix: string): Promise<ListedObject[]>;
};

export class S3Client implements ObjectStorage {
    private client: S3;
    private bucket: string;

    constructor(bucket: string) {
        this.client = captureAWSv3Client(new S3());
        this.bucket = bucket;
    }

    putFile(key: string, localFilePath: string): Promise<PutObjectCommandOutput> {
        const file = fs.readFileSync(localFilePath);
        return this.put(key, file);
    }

    put(key: string, fileContents: string | Buffer): Promise<PutObjectCommandOutput> {
        const fileSize = Buffer.byteLength(fileContents);

        // The cheaper storage class has a minimum object size of 128kb, but it is much less expensive, we can therefore
        // find the break-even cost between the two storage classes (55kb) and store files conditionally based on thier
        // size, to optimise for cost.
        const storageClass = fileSize > 55 * 1000 ? StorageClass.ONEZONE_IA : StorageClass.STANDARD;

        console.log(
            `Creating object "s3://${process.env.BUCKET_NAME}/${key}" from string (${fileSize} bytes, ${storageClass} storage class).`,
        );

        return this.client.putObject({
            Bucket: this.bucket,
            Key: key,
            Body: fileContents,
            StorageClass: storageClass,
        });
    }

    async getString(key: string): Promise<string> {
        const fileContents = await this.client.getObject({
            Bucket: this.bucket,
            Key: key,
        });
        if (typeof fileContents.Body === "undefined") {
            throw new Error(`getObject command for s3://${this.bucket}/${key} returned without a body.`);
        }
        return fileContents.Body.transformToString();
    }

    async get(key: string): Promise<Buffer> {
        const response = await this.client.getObject({ Bucket: this.bucket, Key: key });
        if (typeof response.Body === "undefined") {
            throw new Error(`getObject command for s3://${this.bucket}/${key} returned without a body.`);
        }
        return Buffer.from(await response.Body.transformToByteArray());
    }

    async exists(key: string): Promise<boolean> {
        try {
            await this.client.headObject({
                Bucket: process.env.BUCKET_NAME,
                Key: key,
            });
            return true;
        } catch {}
        return false;
    }

    async list(prefix: string): Promise<ListedObject[]> {
        const objects =
            (
                await this.client.listObjects({
                    Bucket: process.env.BUCKET_NAME,
                    Prefix: prefix,
                })
            ).Contents || [];
        return objects.map((object) => {
            if (typeof object.Key === "undefined" || typeof object.Size === "undefined") {
                throw new Error(`Listed object from s3://${this.bucket}/${prefix} did not contain Key or Size.`);
            }
            return {
                Key: object.Key,
                Size: object.Size,
            };
        });
    }
}
