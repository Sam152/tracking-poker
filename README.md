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

![diagram](./docs/00-09%20System/01%20Images/arch-diagram.png)

-   _[Asset Ripper](./asset-ripper/src/)_ - Downloads and slices streams into individual frames for analysis.
-   _[Frame Analysis](./frame-analysis/src)_ - Detects frames of interest and extracts statistics.

### Asset ripper

This service is responsible for downloading a segment of the target show and slicing out a number of individual frames
for further analysis.

Commands dispatched to this service can either be a video URL or ID and it will subsequently
dispatch details on the success of failure of the download and the individual frames extracted from the video. This
service is powered by:

-   `yt-dlp` - A python package written to download YouTube videos and metadata.
-   `ffmpeg` - The swiss army knife of video, used to extract individual frames.

![asset](./docs/00-09%20System/01%20Images/example-rip.png)

### Frame analysis

This service is dispatched commands to do analysis on individual frames. The following takes place during
analysis:

![analysis](./docs/00-09%20System/01%20Images/analysis.png)

1. A frame is taken as input.
    1. The service was tested with [35 random samples](./frame-analysis/src/__fixtures__/frames/) from the corpus.
    2. The samples were pre-labelled or validated at each stage of the analysis.
2. Frames are [preprocessed](./frame-analysis/src/preprocess/).
    1. The center area is cropped.
    2. A binary threshold is applied to clear up noise.
3. OCR is applied to classify the frame as interesting or not.
    1. This service runs a classification process as a cost saving measure, since detailed analysis with the more
       accurate Textract service is costly.
    2. The OCR document is [fuzzy matched](./frame-analysis/src/classify/triggerWordsFoundInDocument.ts) to certain trigger words.
4. If classified as interesting, [Textract](https://aws.amazon.com/textract/) is used for a more accurate OCR.
    1. The results include words, tables and geometry of detected words.
5. The geometry of certain words are used to locate the arrows indicating if a figure represents a win or a loss.
    1. A [traditional algo](./frame-analysis/src/stats/up-down/) is applied to detect if a shape is an up or down arrow.
6. The extracted statistics are recorded.
