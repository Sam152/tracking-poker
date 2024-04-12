import { parseShowDate } from "./parseShowDate";

describe("parseShowDate", () => {
    test("should correctly parse a valid date string", () => {
        const date = "20230102"; // January 2, 2023
        expect(parseShowDate(date)).toBe("2023/01/02");
    });
});
