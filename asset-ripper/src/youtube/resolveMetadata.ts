import { VideoMetadata } from "./VideoMetadata";
import { exec } from "../util/exec";
import { YouTubeVideo } from "./YouTubeVideo";

export async function resolveMetadata(video: YouTubeVideo): Promise<VideoMetadata> {
    const json = await exec("yt-dlp", ["--dump-json", `"https://www.youtube.com/watch?v=${video.id}"`]);
    return VideoMetadata.fromApiResponse(JSON.parse(json.stdout));
}
