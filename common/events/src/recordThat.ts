import { putEvents } from "./putEvents";

export type BusEvents = {
    VideoAssetRipStarted: {
        videoId: string;
    };
    VideoAssetStored: {
        videoId: string;
        location: string;
        metadata: {
            videoName: string;
            videoDuration: number;
            releaseDate: string;
        };
    };
    VideoFrameStored: {
        videoId: string;
        frameId: string;
        location: string;
    };
    FrameClassifiedAsJunk: {
        videoId: string;
        frameId: string;
    };
    StatsExtractedFromFrame: {
        videoId: string;
        frameId: string;
        type: "cc" | "cw" | "pfr" | "vpip";
        stats: Array<{
            playerName: string;
            stat: number | string;
        }>;
    };
};

export type BusEventName = keyof BusEvents;
export type BusEvent = BusEvents[BusEventName];

export async function recordThat<T extends keyof BusEvents>(eventName: T, payload: BusEvents[T]): Promise<any> {
    console.log("Recording event", eventName, payload);
    return Promise.all([
        putEvents(process.env.COMMAND_BUS_ARN, eventName, payload),
        putEvents(process.env.EVENT_BUS_BUS_ARN, eventName, payload),
    ]);
}
