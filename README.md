# Tracking Poker

During a streamed poker game, a show will collect a number of metrics related to player performance and style. Typical
metrics include:

-   _Cumulative winnings_ - The cumulative winnings (or losses) of a given player at the conclusion of the stream.
-   _Chip count_ - The size of a players stack at the conclusion of a stream.
-   _Pre-flop raise_ - The frequency at which a player elects to raise preflop.
-   _VPIP_ - How frequently players voluntarily enter a pot.

This project collects and aggregates these metrics for all players, from the most popular stream (HCL). This provides
some insight into the on-stream performance of players over time.

## Architecture

This project deploys a number of microservices to coordinate the collection of these statistics:

[diagram]

-   _[Asset Ripper](./asset-ripper/src/)_ - Downloads and slices streams into individual frames for analysis.
-   _[Frame Analysis](./frame-analysis/src)_ - Detects frames of interest and extracts statistics.
