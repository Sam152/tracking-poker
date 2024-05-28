/**
 * Downloading the last 5 minutes, to capture the final session statistics.
 */
import { exec } from "../util/exec";
import { VideoMetadata } from "./VideoMetadata";
import { YouTubeVideo } from "./YouTubeVideo";

export async function downloadLastTenMinutes(
    destinationFolder: string,
    metadata: VideoMetadata,
    video: YouTubeVideo,
): Promise<string> {
    const fiveFromEnd = metadata.duration().sub(60 * 10);

    const localFilename = `${destinationFolder}/${video.id}.webm`;

    await exec("yt-dlp", [
        `"https://www.youtube.com/watch?v=${video.id}"`,
        "--no-cache-dir",
        // Use "best video", ignore audio tracks and select a version that downloads over https only, since there
        // seems to be some issues with other protocols delivering non-video or zero sized files.
        '-f "bv[protocol=https]"',
        `--output=${localFilename}`,
        `--download-sections "*${fiveFromEnd.formatAsSection()}-inf"`,
        `-vvv`,
    ]);

    return localFilename;
}
