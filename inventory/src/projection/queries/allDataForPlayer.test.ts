import { allDataForPlayer } from "./allDataForPlayer";
import { stamp } from "../../util/nominalType";
import { PlayerId } from "../entity/playerAppearance";
import { allDataForPlayerFixture } from "../__fixtures__/queries/allDataForPlayerFixture";

describe("allDataFroPlayer", () => {
    test("parser", () => {
        expect(allDataForPlayer(stamp<PlayerId>("sashimi")).parser(allDataForPlayerFixture)).toMatchSnapshot();
    });
});
