type RawMetadata = Record<string, any> & {
    duration: number;
};

export class VideoMetadata {
    private rawMetadata: RawMetadata;

    private constructor(raw: RawMetadata) {
        this.rawMetadata = raw;
    }

    public static fromApiResponse(raw: Record<any, any>): VideoMetadata {
        if (!raw.duration) {
            throw new Error("Video metadata was invalid, missing duration property.");
        }
        return new VideoMetadata(raw as RawMetadata);
    }

    duration(): VideoDuration {
        return VideoDuration.fromSeconds(this.rawMetadata.duration);
    }
}

export class VideoDuration {
    private readonly seconds: number;

    private constructor(seconds: number) {
        this.seconds = seconds;
    }

    public static fromSeconds(seconds: number): VideoDuration {
        return new VideoDuration(seconds);
    }

    public inSeconds(): number {
        return this.seconds;
    }

    public formatAsSection(): string {
        return new Date(this.seconds * 1000).toISOString().substring(11, 19);
    }

    public sub(seconds: number): VideoDuration {
        return new VideoDuration(this.seconds - seconds);
    }

    public add(seconds: number): VideoDuration {
        return new VideoDuration(this.seconds + seconds);
    }
}
