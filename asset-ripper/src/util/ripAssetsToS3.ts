import { Workspace } from "../files/Workspace";
import { YouTubeVideo } from "../youtube/YouTubeVideo";
import { Slicer } from "../video/Slicer";
import { listFiles } from "../files/listFiles";
import { createObject } from "./createObject";

export async function ripAssetsToS3(video: YouTubeVideo) {
    const workspace = Workspace.create();
    console.log(`Starting rip in workspace ${workspace.directory()}`);

    // Download the last 10 minutes of a video for analysis.
    const videoFilename = await video.downloadLastTenMinutes(workspace.directory());
    console.log(`Downloaded video to location: ${videoFilename}`);
    await createObject(`${video.id}/video.webm`, videoFilename);

    // Slice into individual frame images at a very low framerate, only need to capture final statistics.
    const framesDirectory = workspace.createSubDirectory("frames");
    await Slicer.fromVideoFile(videoFilename).sliceFrames(0.25, framesDirectory);
    const frames = listFiles(framesDirectory);
    console.log(`Sliced frames from video: ${frames.join(", ")}`);
    for (const frame of frames) {
        await createObject(`${video.id}/frames/${frame}`, `${framesDirectory}/${frame}`);
    }

    workspace.cleanUp();
    console.log(`Completed upload and cleaned workspace.`);
}
