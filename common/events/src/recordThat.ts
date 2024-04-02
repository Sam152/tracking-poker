type Event =
    | {
          name: "VideoAssetStored";
          videoId: string;
          location: string;
          metadata: {
              videoName: string;
              videoDuration: number;
          };
      }
    | {
          name: "VideoFrameStored";
          videoId: string;
          frameId: string;
          location: string;
      }
    | {
          name: "FrameClassifiedAsJunk";
          videoId: string;
          frameId: string;
      }
    | {
          name: "StatsExtractedFromFrame";
          videoId: string;
          frameId: string;
          type: "cc" | "cw" | "pfr" | "vpip";
          stats: Array<{
              playerName: string;
              stat: number | string;
          }>;
      };

export async function recordThat(event: Event): Promise<any> {
    console.log("Recording event", event);
}
