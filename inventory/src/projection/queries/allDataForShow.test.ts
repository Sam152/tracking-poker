import { stamp } from "../../util/nominalType";
import { allDataForShow } from "./allDataForShow";
import { ShowId } from "../entity/show";
import { allDataForShowFixture } from "../__fixtures__/queries/allDataForShowFixture";

describe("allDataForShow", () => {
    test("parser", () => {
        expect(allDataForShow(stamp<ShowId>("dVs7ORBHsF0")).parser(allDataForShowFixture)).toMatchSnapshot();
    });
});
