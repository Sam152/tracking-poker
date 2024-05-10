import { Block } from "@aws-sdk/client-textract/dist-types/models/models_0";
import { captureAWSv3Client } from "aws-xray-sdk";
import { S3 } from "@aws-sdk/client-s3";
import { fetchAsset } from "../../s3/fetchAsset";

export async function fetchBlocksCached(videoId: string, frameId: string, fetchBlocks: () => Promise<Block[]>) {
    if (!(await blocksExistInCache(videoId, frameId))) {
        const blocks = await fetchBlocks();
        await cacheBlocks(videoId, frameId, blocks);
        return blocks;
    }
    return await fetchBlocksFromCache(videoId, frameId);
}

async function cacheBlocks(videoId: string, frameId: string, blocks: Block[]): Promise<void> {
    const client = captureAWSv3Client(new S3());
    await client.putObject({
        Bucket: process.env.ANALYSIS_BLOCKS_BUCKET_NAME,
        Key: `${videoId}/${frameId}.json`,
        Body: JSON.stringify(blocks),
    });
}

async function fetchBlocksFromCache(videoId: string, frameId: string): Promise<Block[]> {
    if (!(await blocksExistInCache(videoId, frameId))) {
        throw new Error("Cannot fetch blocks from cache that do not exist.");
    }
    return JSON.parse((await fetchAsset(process.env.ANALYSIS_BLOCKS_BUCKET_NAME, `${videoId}/${frameId}.json`)).toString());
}

async function blocksExistInCache(videoId: string, frameId: string): Promise<boolean> {
    const client = captureAWSv3Client(new S3());
    try {
        await client.headObject({
            Bucket: process.env.ANALYSIS_BLOCKS_BUCKET_NAME,
            Key: `${videoId}/${frameId}.json`,
        });
        return true;
    } catch (e) {}
    return false;
}
