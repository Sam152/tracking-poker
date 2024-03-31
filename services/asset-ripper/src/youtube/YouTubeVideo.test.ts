import {YouTubeVideo} from "./YouTubeVideo";

describe("YouTubeVideo", () => {
    test("videos can be instantiated from URL", () => {
        expect(
            YouTubeVideo.fromUrl('https://www.youtube.com/watch?v=FiARsQSlzDc').id
        ).toEqual('FiARsQSlzDc')
    });

    test("invalid URLs will throw", () => {
        expect(
            () => YouTubeVideo.fromUrl('not a real url')
        ).toThrow(new Error('YouTube URL provided "not a real url" could not be parsed, invalid format.'));
    });
});
