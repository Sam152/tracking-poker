import { PlayerStatCollection, StatType } from "./types/StatType";
import { wrapFetchBlocksWithCache } from "./cache/wrapFetchBlocksWithCache";
import { getStatsFromBlocks } from "./getStatsFromBlocks";
import { getBlocksFromFrame } from "./textract/getBlocksFromFrame";

export async function getStatsFromFrame(
    frame: Buffer,
    videoId: string,
    frameId: string,
): Promise<[StatType, PlayerStatCollection<number>] | undefined> {
    try {
        // Ensure failures from either the extraction process or identifying stats associated with the blocks, result
        // in reporting undefined stats for the whole frame.
        const blocks = await wrapFetchBlocksWithCache(videoId, frameId, () => getBlocksFromFrame(frame));
        const [type, stats] = await getStatsFromBlocks(blocks, frame);

        // Let each stat type decide if there are a valid set of stats that can be extracted.
        if (!stats) {
            return undefined;
        }

        return [type, stats];
    } catch (e) {
        console.error(e);
        return undefined;
    }
}
