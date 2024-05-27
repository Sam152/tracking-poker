import { playerNameShouldNotBeRepresented } from "./playerNameShouldNotBeRepresented";

describe("playerNameShouldNotBeRepresented", () => {
    test("non-players are not represented", () => {
        expect(playerNameShouldNotBeRepresented("BOUNTY POOL")).toEqual(true);
    });
    test("players are represented", () => {
        expect(playerNameShouldNotBeRepresented("FOO BAR")).toEqual(false);
    });
});
