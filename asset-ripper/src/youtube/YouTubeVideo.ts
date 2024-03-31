import { VideoMetadata } from "./VideoMetadata";
import { exec } from "../util/exec";

export class YouTubeVideo {
    public readonly id: string;
    private metadata?: VideoMetadata;

    private constructor(id: string) {
        this.id = id;
    }

    static fromId(id: string): YouTubeVideo {
        return new YouTubeVideo(id);
    }

    static fromUrl(url: string): YouTubeVideo {
        const matches = url.match(
            /^https?:\/\/(www\.)?(youtube\.com\/watch\?.*v=|youtu\.be\/)(?<id>[0-9A-Za-z_-]*)/,
        );
        if (!matches) {
            throw new Error(
                `YouTube URL provided "${url}" could not be parsed, invalid format.`,
            );
        }
        return YouTubeVideo.fromId(matches.groups!.id);
    }

    /**
     * Downloading the last 5 minutes, to capture the final session statistics.
     */
    public async downloadLastTenMinutes(
        destinationFolder: string,
    ): Promise<string> {
        const metadata = await this.resolveMetadata();
        const fiveFromEnd = metadata.duration().sub(60 * 10);

        const destinationFilename = `${destinationFolder}/${this.id}.webm`;

        await exec("yt-dlp", [
            `"https://www.youtube.com/watch?v=${this.id}"`,
            "--no-cache-dir",
            // Use "best video", ignore audio tracks and select a version that downloads over https only, since there
            // seems to be some issues with other protocols delivering non-video or zero sized files.
            '-f "bv[protocol=https]"',
            `--output=${destinationFilename}`,
            `--download-sections "*${fiveFromEnd.formatAsSection()}-inf"`,
            `-vvv`,
        ]);

        return destinationFilename;
    }

    public async resolveMetadata(): Promise<VideoMetadata> {
        if (this.metadata) {
            return this.metadata;
        }
        const json = await exec("yt-dlp", [
            "--dump-json",
            `"https://www.youtube.com/watch?v=${this.id}"`,
        ]);
        this.metadata = VideoMetadata.fromApiResponse(JSON.parse(json.stdout));
        return this.metadata;
    }
}
