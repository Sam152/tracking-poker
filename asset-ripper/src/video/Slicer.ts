import { exec, ExecOutput } from "../util/exec";

export class Slicer {
    private readonly videoFile: string;

    private constructor(videoFile: string) {
        this.videoFile = videoFile;
    }

    public static fromVideoFile(videoFile: string): Slicer {
        return new Slicer(videoFile);
    }

    public async sliceFrames(
        framerate: number,
        destination: string,
    ): Promise<ExecOutput> {
        return exec("ffmpeg", [
            `-i ${this.videoFile}`,
            `-vf fps=${framerate}`,
            `${destination}/frame_%04d.jpg`,
        ]);
    }
}
