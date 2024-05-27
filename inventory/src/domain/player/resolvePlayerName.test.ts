import { resolvePlayerName } from "./resolvePlayerName";

describe("resolvePlayerName", () => {
    test("player names with aliases are resolved", () => {
        expect(resolvePlayerName("FRANCISCO C")).toEqual("FRANCISCO");
    });
    test("player names without aliases are defaulted", () => {
        expect(resolvePlayerName("FOO BAR")).toEqual("FOO BAR");
    });
});
