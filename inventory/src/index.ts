import express from "express";
import { shows } from "./routes/shows";
import { players } from "./routes/players";
import { leaderboards } from "./routes/leaderboards";
import AWSXRay from "aws-xray-sdk";

const app = express();

app.use(express.json());
app.use(AWSXRay.express.openSegment("inventory-api"));

app.use((req, res, next) => {
    res.header("Cache-Control", "public, max-age=600, s-max-age=3600");
    next();
});

app.use("/shows", shows);
app.use("/players", players);
app.use("/leaderboards", leaderboards);

app.use("/healthz", (req, res, next) => {
    res.send({ status: "healthy" });
});

app.listen(process.env.PORT || 80, () => {
    console.log(`App started.`);
});
