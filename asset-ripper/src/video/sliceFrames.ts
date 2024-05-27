import { exec, ExecOutput } from "../util/exec";

export function sliceFrames(videoFile: string, framerate: number, destination: string): Promise<ExecOutput> {
    return exec("ffmpeg", [`-i ${videoFile}`, `-vf fps=${framerate}`, `${destination}/frame_%04d.jpg`]);
}
