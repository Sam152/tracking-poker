import { executeQuery } from "../dynamo/executeQuery";
import express from "express";
import { allStatsOfType } from "../projection/queries/allStatsOfType";

export const leaderboards = express.Router();

leaderboards.get("/winning", async (req, res, next) => {
    const results = await executeQuery(allStatsOfType("cw"));
    res.send({ foo: "bar" });
});

leaderboards.get("/not-so-winning", async (req, res, next) => {
    const results = await executeQuery(allStatsOfType("cw"));
    res.send();
});
