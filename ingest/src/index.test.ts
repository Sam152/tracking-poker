import { handleEvent } from "./index";

describe("index", () => {
    test("legacy streams are imported one at a time, and only if they are new", async () => {
        const recordThat = jest.fn().mockReturnValue(Promise.resolve());
        await handleEvent(
            {
                "detail-type": "IngestLegacyStream",
            },
            () => Promise.resolve([]),
            () => Promise.resolve(false),
            () => Promise.resolve(["PzTAD77ay78", "Bxz80vvDHEk"]),
            recordThat,
        );
        expect(recordThat).toHaveBeenCalledWith("NewCompletedBroadcastDiscovered", { operator: "hcl", videoId: "5SeSd5nf2w4" });
    });
});
