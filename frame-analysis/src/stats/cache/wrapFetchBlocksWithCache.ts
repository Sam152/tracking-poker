import { Block } from "@aws-sdk/client-textract/dist-types/models/models_0";
import { S3Client } from "objects";

export async function wrapFetchBlocksWithCache(videoId: string, frameId: string, fetchBlocks: () => Promise<Block[]>) {
    const s3 = new S3Client(process.env.ANALYSIS_BLOCKS_BUCKET_NAME);
    const cacheKey = `${videoId}/${frameId}.json`;

    // Return blocks from cache if they already exist.
    const blocksExistInCache = await s3.exists(cacheKey);
    if (blocksExistInCache) {
        console.log(`${cacheKey} blocks found in cache, returning`);
        return JSON.parse(await s3.getString(cacheKey));
    }

    // Fetch and cache blocks, if they do not.
    console.log(`${cacheKey} blocks not found in cache, fetching from remote`);
    const blocks = await fetchBlocks();
    await s3.put(cacheKey, JSON.stringify(blocks));

    return blocks;
}
