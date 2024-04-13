import { fetchRecentVideoIds } from "./fetchRecentVideoIds";
import { apiResponseFixture } from "./__fixtures__/apiResponseFixture";

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(apiResponseFixture),
    } as Response),
);

describe("fetchRecentVideos", () => {
    test("new videos fetched", async () => {
        expect(await fetchRecentVideoIds("UCQe7wB0o_cZgv1miyYB9TMA")).toEqual([
            "PQDwmMUnTLI",
            "wV0HR5Kbgpo",
            "Upk-Dao0wis",
            "_93liyLqbAU",
            "KDoAPYAPjUw",
        ]);
    });
});
