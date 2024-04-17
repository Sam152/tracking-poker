import { executeQuery } from "../dynamo/executeQuery";
import { playerIdFromUserInput } from "./validation/playerIdFromUserInput";
import { allDataForPlayer } from "../projection/queries/allDataForPlayer";
import express from "express";
import { asyncCatch } from "../middlewares/asyncCatch";

export const players = express.Router();

players.get(
    "/:playerId",
    asyncCatch(async (req, res, next) => {
        res.send(await executeQuery(allDataForPlayer(playerIdFromUserInput(req.params.playerId))));
    }),
);
