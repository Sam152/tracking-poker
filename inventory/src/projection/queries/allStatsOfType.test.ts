import { allStatsOfType } from "./allStatsOfType";
import { allStatsOfTypeFixture } from "../__fixtures__/queries/allStatsOfTypeFixture";

describe("allStatsOfType", () => {
    test("parser", () => {
        expect(allStatsOfType("cw").parser(allStatsOfTypeFixture)).toMatchSnapshot();
    });
});
