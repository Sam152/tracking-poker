import { asyncCatch } from "../middlewares/asyncCatch";
import express from "express";
import { searchPlayerIndex } from "../domain/search/playerSearchIndex";
import { searchTermFromUserInput } from "../domain/validation/searchTermFromUserInput";

export const search = express.Router();

search.get(
    "/players/:term",
    asyncCatch(async (req, res, next) => {
        res.send({
            hits: (await searchPlayerIndex(searchTermFromUserInput(req.params.term))).slice(0, 15),
        });
    }),
);
