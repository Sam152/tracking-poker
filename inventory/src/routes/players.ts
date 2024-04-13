import { executeQuery } from "../dynamo/executeQuery";
import { playerIdFromUserInput } from "./validation/playerIdFromUserInput";
import { allDataForPlayer } from "../projection/queries/allDataForPlayer";
import express from "express";

export const players = express.Router();

players.get(":playerId", async (req, res, next) => {
    res.send(await executeQuery(allDataForPlayer(playerIdFromUserInput(req.params.playerId))));
});
