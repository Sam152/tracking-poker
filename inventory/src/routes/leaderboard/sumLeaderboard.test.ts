import { Stat } from "../../projection/entity/stat";
import { stamp } from "../../util/nominalType";
import { PlayerId } from "../../projection/entity/playerAppearance";
import { ShowId } from "../../projection/entity/show";
import { sumLeaderboard } from "./sumLeaderboard";

describe("subLeaderboard", () => {
    test("leaderboard is sum of all stats", () => {
        const stats: Stat[] = [
            {
                player: stamp<PlayerId>("sam"),
                show: stamp<ShowId>("show-1"),
                value: 100,
                type: "cw",
                player_name: "Sam",
            },
            {
                player: stamp<PlayerId>("sam"),
                show: stamp<ShowId>("show-2"),
                value: 50,
                type: "cw",
                player_name: "Sam",
            },
            {
                player: stamp<PlayerId>("jerry"),
                show: stamp<ShowId>("show-2"),
                value: -100,
                type: "cw",
                player_name: "Jerry",
            },
            {
                player: stamp<PlayerId>("jerry"),
                show: stamp<ShowId>("show-3"),
                value: 75,
                type: "cw",
                player_name: "Jerry",
            },
            {
                player: stamp<PlayerId>("paul"),
                show: stamp<ShowId>("show-3"),
                value: 300,
                type: "cw",
                player_name: "Paul",
            },
        ];

        expect(sumLeaderboard(stats)).toEqual([
            {
                playerName: "Paul",
                playerId: "paul",
                statValue: 300,
                dataPoints: 1,
            },
            {
                playerName: "Sam",
                playerId: "sam",
                statValue: 150,
                dataPoints: 2,
            },
            {
                playerName: "Jerry",
                playerId: "jerry",
                statValue: -25,
                dataPoints: 2,
            },
        ]);
    });
});
