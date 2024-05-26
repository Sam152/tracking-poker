import { playerNameTestCases } from "./__fixtures__/playerNameTestCases";
import { looksLikePlayerName } from "./looksLikePlayerName";

describe("looksLikePlayerName", () => {
    test.each<[string, boolean]>(Object.keys(playerNameTestCases).map((name) => [name, playerNameTestCases[name]]))(
        "player name %s classified as %s",
        (input: string, expected: boolean) => {
            expect(looksLikePlayerName(input)).toEqual(expected);
        },
    );
});
