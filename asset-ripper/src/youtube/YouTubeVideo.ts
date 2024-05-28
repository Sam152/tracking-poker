export class YouTubeVideo {
    public readonly id: string;

    private constructor(id: string) {
        this.id = id;
    }

    static fromId(id: string): YouTubeVideo {
        return new YouTubeVideo(id);
    }

    static fromUrl(url: string): YouTubeVideo {
        const matches = url.match(/^https?:\/\/(www\.)?(youtube\.com\/watch\?.*v=|youtu\.be\/)(?<id>[0-9A-Za-z_-]*)/);
        if (!matches) {
            throw new Error(`YouTube URL provided "${url}" could not be parsed, invalid format.`);
        }
        return YouTubeVideo.fromId(matches.groups!.id);
    }
}
