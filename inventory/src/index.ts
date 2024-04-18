import express from "express";
import { shows } from "./routes/shows";
import { players } from "./routes/players";
import { leaderboards } from "./routes/leaderboards";
import AWSXRay from "aws-xray-sdk";
import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";
import { cacheMiddleware } from "./middlewares/cacheMiddleware";

const app = express();

app.use(express.json());
app.use(AWSXRay.express.openSegment("inventory-api"));

app.use(cacheMiddleware);

app.use("/shows", shows);
app.use("/players", players);
app.use("/leaderboards", leaderboards);

app.use("/healthz", (req, res, next) => {
    res.send({ status: "healthy" });
});

app.use(errorNotFoundHandler);

app.use(AWSXRay.express.closeSegment());
app.use(errorHandler);

app.listen(process.env.PORT || 80, () => {
    console.log(`App started.`);
});
