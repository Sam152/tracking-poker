import { ripAssetsToS3 } from "./ripAssetsToS3";
import { YouTubeVideo } from "./youtube/YouTubeVideo";
import { BasicFs, createMemoryFs, InMemoryObjectStorage } from "objects";
import { VideoMetadata } from "./youtube/VideoMetadata";

const recordThat = jest.fn();
let s3: InMemoryObjectStorage, fs: BasicFs;

jest.mock("./youtube/resolveMetadata", () => ({
    // Return some basic metadata.
    resolveMetadata: async () => {
        return VideoMetadata.fromApiResponse({
            id: "yyyyyyyyyyy",
            title: "Sample show y",
            duration: 10070,
        });
    },
}));

jest.mock("./youtube/downloadLastTenMinutes", () => ({
    // Create a sample video file and place it where the real function would.
    downloadLastTenMinutes: async (destinationFolder: string, metadata: VideoMetadata, video: YouTubeVideo) => {
        fs.mkdirSync(destinationFolder, { recursive: true });
        const filename = `${destinationFolder}/${video.id}.webm`;
        fs.writeFileSync(filename, Buffer.from([2]));
        return filename;
    },
}));

jest.mock("./video/sliceFrames", () => ({
    // Write some sample frames in the format the real function would.
    sliceFrames: async (videoFile: string, framerate: number, destination: string) => {
        fs.mkdirSync(destination, { recursive: true });
        fs.writeFileSync(`${destination}/frame_0001.jpg`, Buffer.from([6]));
        fs.writeFileSync(`${destination}/frame_0002.jpg`, Buffer.from([7]));
        fs.writeFileSync(`${destination}/frame_0003.jpg`, Buffer.from([8]));
    },
}));

jest.mock("tp-events", () => ({
    recordThat: (...args: any[]) => recordThat(...args),
}));

describe("ripAssetsToS3", () => {
    beforeEach(() => {
        s3 = new InMemoryObjectStorage();
        fs = createMemoryFs();
        recordThat.mockReset();
        console.log = jest.fn();
        process.env.BUCKET_NAME = "test-bucket";
    });

    test("assets are downloaded and dispatched if they dont exist", async () => {
        await ripAssetsToS3(YouTubeVideo.fromId("yyyyyyyyyyy"), s3, fs);
        expect(recordThat.mock.calls).toEqual([
            [
                "VideoAssetStored",
                {
                    videoId: "yyyyyyyyyyy",
                    location: "s3://test-bucket/yyyyyyyyyyy/video.webm",
                    metadata: { videoName: "Sample show y", videoDuration: 10070 },
                },
            ],
            [
                "VideoFrameStored",
                {
                    videoId: "yyyyyyyyyyy",
                    frameId: "frame_0001",
                    location: "s3://test-bucket/yyyyyyyyyyy/frames/frame_0001.jpg",
                },
            ],
            [
                "VideoFrameStored",
                {
                    videoId: "yyyyyyyyyyy",
                    frameId: "frame_0002",
                    location: "s3://test-bucket/yyyyyyyyyyy/frames/frame_0002.jpg",
                },
            ],
            [
                "VideoFrameStored",
                {
                    videoId: "yyyyyyyyyyy",
                    frameId: "frame_0003",
                    location: "s3://test-bucket/yyyyyyyyyyy/frames/frame_0003.jpg",
                },
            ],
        ]);

        expect(await s3.list("")).toEqual([
            { Key: "yyyyyyyyyyy/metadata.json", Size: 77 },
            { Key: "yyyyyyyyyyy/video.webm", Size: 1 },
            { Key: "yyyyyyyyyyy/frames/frame_0001.jpg", Size: 1 },
            { Key: "yyyyyyyyyyy/frames/frame_0002.jpg", Size: 1 },
            { Key: "yyyyyyyyyyy/frames/frame_0003.jpg", Size: 1 },
        ]);
    });

    test("events are redispatched if all ripped assets already exist in remote storage", async () => {
        await s3.put(
            `xxxxxxxxxxx/metadata.json`,
            JSON.stringify({
                rawMetadata: {
                    id: "xxxxxxxxxxx",
                    title: "Sample show x",
                    duration: 20070,
                },
            }),
        );
        await s3.put(`xxxxxxxxxxx/frames/frame_0001.jpg`, Buffer.from([1]));
        await s3.put(`xxxxxxxxxxx/frames/frame_0002.jpg`, Buffer.from([1]));
        await s3.put(`xxxxxxxxxxx/video.webm`, Buffer.from([1]));
        await ripAssetsToS3(YouTubeVideo.fromId("xxxxxxxxxxx"), s3, fs);

        // No local files should be created.
        expect(fs.readdirSync("/")).toEqual([]);

        expect(recordThat.mock.calls).toEqual([
            [
                "VideoAssetStored",
                {
                    videoId: "xxxxxxxxxxx",
                    location: "s3://test-bucket/xxxxxxxxxxx/video.webm",
                    metadata: { videoName: "Sample show x", videoDuration: 20070 },
                },
            ],
            [
                "VideoFrameStored",
                {
                    videoId: "xxxxxxxxxxx",
                    frameId: "frame_0001",
                    location: "s3://test-bucket/xxxxxxxxxxx/frames/frame_0001.jpg",
                },
            ],
            [
                "VideoFrameStored",
                {
                    videoId: "xxxxxxxxxxx",
                    frameId: "frame_0002",
                    location: "s3://test-bucket/xxxxxxxxxxx/frames/frame_0002.jpg",
                },
            ],
        ]);
    });

    test("metadata will be downloaded and stored, even if video and frames already exist", async () => {
        await s3.put(`xxxxxxxxxxx/frames/frame_0001.jpg`, Buffer.from([1]));
        await s3.put(`xxxxxxxxxxx/frames/frame_0002.jpg`, Buffer.from([1]));
        await s3.put(`xxxxxxxxxxx/video.webm`, Buffer.from([1]));
        await ripAssetsToS3(YouTubeVideo.fromId("xxxxxxxxxxx"), s3, fs);

        expect(await s3.getString("xxxxxxxxxxx/metadata.json")).toEqual(
            '{"rawMetadata":{"id":"yyyyyyyyyyy","title":"Sample show y","duration":10070}}',
        );
    });
});
