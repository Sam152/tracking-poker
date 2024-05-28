import { ListedObject, ObjectStorage } from "./S3Client";
import { PutObjectCommandOutput } from "@aws-sdk/client-s3";
import * as fs from "node:fs";

type InMemoryContents = Record<string, string>;

/**
 * An in-memory implementation for testing.
 */
export class InMemoryObjectStorage implements ObjectStorage {
    public contents: InMemoryContents;

    constructor(contents?: InMemoryContents) {
        this.contents = contents || {};
    }

    exists(key: string): Promise<boolean> {
        return Promise.resolve(key in this.contents);
    }

    getString(key: string): Promise<string> {
        if (!(key in this.contents)) {
            throw new Error(`Object s3Memory://${key} does not exist.`);
        }
        return Promise.resolve(this.contents[key]);
    }

    async get(key: string): Promise<Buffer> {
        const string = await this.getString(key);
        return Promise.resolve(Buffer.from(string, "utf8"));
    }

    list(prefix: string): Promise<ListedObject[]> {
        return Promise.resolve(
            Object.keys(this.contents)
                .filter((key) => key.startsWith(prefix))
                .map((key) => ({
                    Key: key,
                    Size: this.contents[key].length,
                })),
        );
    }

    put(key: string, fileContents: string | Buffer): Promise<PutObjectCommandOutput> {
        this.contents[key] = fileContents.toString("utf8");
        return Promise.resolve({
            $metadata: {},
        });
    }

    putFile(key: string, localFilePath: string): Promise<PutObjectCommandOutput> {
        return this.put(key, fs.readFileSync(localFilePath));
    }
}
