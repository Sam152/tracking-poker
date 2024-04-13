import express from "express";
import { executeQuery } from "../dynamo/executeQuery";
import { allShows } from "../projection/queries/allShows";
import { allDataForShow } from "../projection/queries/allDataForShow";
import { showIdFromUserInput } from "./validation/showIdFromUserInput";

export const shows = express.Router();

shows.get("/", async (req, res, next) => {
    res.send(await executeQuery(allShows()));
});

shows.get("/:showId", async (req, res, next) => {
    res.send(await executeQuery(allDataForShow(showIdFromUserInput(req.params.showId))));
});
