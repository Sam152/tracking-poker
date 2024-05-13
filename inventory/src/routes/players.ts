import { executeQuery } from "../dynamo/executeQuery";
import { allDataForPlayer } from "../projection/queries/allDataForPlayer";
import express from "express";
import { asyncCatch } from "../middlewares/asyncCatch";
import { playerIdFromUserInput } from "../domain/validation/playerIdFromUserInput";

export const players = express.Router();

players.get(
    "/:playerId",
    asyncCatch(async (req, res, next) => {
        res.send(await executeQuery(allDataForPlayer(playerIdFromUserInput(req.params.playerId))));
    }),
);
