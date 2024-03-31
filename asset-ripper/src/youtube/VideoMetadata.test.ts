import { VideoDuration, VideoMetadata } from "./VideoMetadata";

describe("VideoMetadata", () => {
    test("duration can be extracted from api response", () => {
        expect(
            VideoMetadata.fromApiResponse({
                duration: 1234,
            })
                .duration()
                .inSeconds(),
        ).toEqual(1234);
    });

    test("invalid metadata is rejected", () => {
        expect(() =>
            VideoMetadata.fromApiResponse({
                something_different: "Foo",
            }),
        ).toThrow(new Error("Video metadata was invalid, missing duration property."));
    });
});

describe("VideoDuration", () => {
    test("duration is formatted in a way that can be used to identify video seconds", () => {
        expect(VideoDuration.fromSeconds(60 * 60 * 3.47823).formatAsSection()).toEqual("03:28:41");
        expect(VideoDuration.fromSeconds(30).formatAsSection()).toEqual("00:00:30");
    });

    test("seconds can be added to durations", () => {
        expect(VideoDuration.fromSeconds(30).add(199).inSeconds()).toEqual(229);
    });

    test("seconds can be subtracted from durations", () => {
        expect(VideoDuration.fromSeconds(30).sub(12).inSeconds()).toEqual(18);
    });
});
