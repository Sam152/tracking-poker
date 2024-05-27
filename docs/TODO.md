# Todo

List of tasks to complete:

-   [x] Increase stat collection accuracy.
-   [x] Allow stat extraction to run again on pre-OCRd frames.
-   [x] Preserve video metadata in asset ripper service.
-   [ ] Clear events and reimport?
    -   [ ] Possibly allow asset ripper to skip downloading already downloaded assets.
-   [ ] Add aliases for names, for players who have used multiple names.
-   [ ] Add disclaimers and methodology to client.
-   [ ] Extract and generalise an S3 client from `asset-ripper/src/util/S3.ts`, use to refactor `frame-analysis/src/stats/cache/fetchBlocksCached.ts`.
-   [x] Cache textract extractions for refinement.
-   [x] Debug mode to link UI to pipeline assets.
-   [x] Create a list of players + search.
-   [x] Optimise inventory node container to use slim image.
-   [ ] Add a leaderboard for BB/hour.
-   [ ] Add script to rebuild projections.
-   [ ] Tighten VPC on inventory EC2 instance.
