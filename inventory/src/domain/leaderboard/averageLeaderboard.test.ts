import { Stat } from "../../projection/entity/stat";
import { stamp } from "../../util/nominalType";
import { PlayerId } from "../../projection/entity/playerAppearance";
import { ShowId } from "../../projection/entity/show";
import { averageLeaderboard } from "./averageLeaderboard";

describe("averageLeaderboard", () => {
    test("leaderboard is average of all stats", () => {
        const stats: Stat[] = [
            {
                player: stamp<PlayerId>("sam"),
                show: stamp<ShowId>("show-1"),
                value: 67,
                type: "vpip",
                player_name: "Sam",
            },
            {
                player: stamp<PlayerId>("sam"),
                show: stamp<ShowId>("show-2"),
                value: 76,
                type: "vpip",
                player_name: "Sam",
            },
            {
                player: stamp<PlayerId>("jerry"),
                show: stamp<ShowId>("show-2"),
                value: 25,
                type: "vpip",
                player_name: "Jerry",
            },
            {
                player: stamp<PlayerId>("jerry"),
                show: stamp<ShowId>("show-3"),
                value: 20,
                type: "vpip",
                player_name: "Jerry",
            },
            {
                player: stamp<PlayerId>("paul"),
                show: stamp<ShowId>("show-3"),
                value: 54,
                type: "vpip",
                player_name: "Paul",
            },
        ];

        expect(averageLeaderboard(stats)).toEqual([
            {
                playerName: "Sam",
                playerId: "sam",
                statValue: 71.5,
                dataPoints: 2,
            },
            {
                playerName: "Paul",
                playerId: "paul",
                statValue: 54,
                dataPoints: 1,
            },
            {
                playerName: "Jerry",
                playerId: "jerry",
                statValue: 22.5,
                dataPoints: 2,
            },
        ]);
    });
});
