import { z } from "zod";

const apiSchema = z.object({
    items: z.array(
        z.object({
            id: z.object({
                videoId: z.string(),
            }),
        }),
    ),
});

export async function fetchRecentVideoIds(channelId: string): Promise<string[]> {
    // The amount of time we should wait, until after a video has been published, before starting the processing.
    // This is required because for a certain duration of time after a video has been published, it does not have
    // processable video formats or metadata.
    const bufferDurationMilliseconds = 1000 * 60 * 60 * 48;

    const params = [
        `channelId=${channelId}`,
        "type=video",
        "eventType=completed",
        "order=date",
        `key=${process.env.YOUTUBE_API_KEY}`,
        `publishedBefore=${new Date(Date.now() - bufferDurationMilliseconds).toISOString()}`,
    ];

    const videos = apiSchema.parse(
        await fetch(`https://www.googleapis.com/youtube/v3/search?${params.join("&")}`).then((response) => response.json()),
    );

    return videos.items.map((item) => item.id.videoId);
}
