import { executeQuery } from "../dynamo/executeQuery";
import express from "express";
import { allStatsOfType } from "../projection/queries/allStatsOfType";
import { asyncCatch } from "../middlewares/asyncCatch";
import { sumLeaderboard } from "../domain/leaderboard/sumLeaderboard";
import { averageLeaderboard } from "../domain/leaderboard/averageLeaderboard";

export const leaderboards = express.Router();

leaderboards.get(
    "/winning",
    asyncCatch(async (req, res, next) => {
        const stats = await executeQuery(allStatsOfType("cw"));
        res.send(sumLeaderboard(stats).slice(0, 50));
    }),
);

leaderboards.get(
    "/not-so-winning",
    asyncCatch(async (req, res, next) => {
        const stats = await executeQuery(allStatsOfType("cw"));
        res.send(sumLeaderboard(stats).reverse().slice(0, 50));
    }),
);

leaderboards.get(
    "/highest-vpip",
    asyncCatch(async (req, res, next) => {
        res.send(averageLeaderboard(await executeQuery(allStatsOfType("vpip"))).slice(0, 50));
    }),
);

leaderboards.get(
    "/lowest-vpip",
    asyncCatch(async (req, res, next) => {
        res.send(
            averageLeaderboard(await executeQuery(allStatsOfType("vpip")))
                .reverse()
                .slice(0, 50),
        );
    }),
);
