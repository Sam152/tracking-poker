import { handler } from "./index";
import { ripAssetsToS3 } from "./ripAssetsToS3";

jest.mock("./ripAssetsToS3", () => ({
    ripAssetsToS3: jest.fn(),
}));
jest.mock("tp-events", () => ({
    recordThat: jest.fn(),
}));

describe("index", () => {
    test("handler throws on invalid event schema", async () => {
        await expect(
            handler(
                {
                    "not-a-nice-event": 99,
                } as any,
                { awsRequestId: "foo" },
                () => null,
            ),
        ).rejects.toThrow("invalid_type");
    });

    test("valid events are invoked with a video", async () => {
        await handler(
            {
                "detail-type": "StartAssetRipByVideoId",
                detail: {
                    videoId: "123",
                },
            } as any,
            { awsRequestId: "foo" },
            () => null,
        );
        expect(ripAssetsToS3).toHaveBeenCalled();
    });
});
