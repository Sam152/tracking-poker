import { PlayerId } from "../../projection/entity/playerAppearance";

export type LeaderboardItem = {
    playerName: string;
    playerId: PlayerId;
    statValue: number;
    dataPoints: number;
};

export type Leaderboard = LeaderboardItem[];
