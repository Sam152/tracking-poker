import { Stat } from "../../projection/entity/stat";
import { Leaderboard, LeaderboardItem } from "./Leaderboard";

/**
 * Build a leaderboard by averaging data points.
 */
export function averageLeaderboard(stats: Stat[]): Leaderboard {
    return Object.values(
        stats.reduce((acc: Record<string, LeaderboardItem>, stat: Stat) => {
            const { player, value, player_name } = stat;
            if (!acc[player]) {
                acc[player] = { playerName: player_name, playerId: player, statValue: 0, dataPoints: 0 };
            }

            acc[player].statValue = (value + acc[player].dataPoints * acc[player].statValue) / (acc[player].dataPoints + 1);
            acc[player].dataPoints += 1;
            return acc;
        }, {}),
    ).sort((a, b) => b.statValue - a.statValue);
}
