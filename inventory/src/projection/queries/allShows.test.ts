import { allShows } from "./allShows";
import { allShowsFixture } from "../__fixtures__/queries/allShowsFixture";

describe("allShows", () => {
    test("parser", () => {
        expect(allShows().parser(allShowsFixture)).toMatchSnapshot();
    });
});
