import util from "node:util";

const promiseExec = util.promisify(require("node:child_process").exec);

export type ExecOutput = Promise<{
    stdout: string;
    stderr: string;
}>;

export async function exec(command: string, args: string[] = []): Promise<ExecOutput> {
    const joinedCommand = `${command} ${args.join(" ")}`;
    console.log(`Executing command: ${joinedCommand}`);
    return promiseExec(joinedCommand, {
        maxBuffer: 1024 * 1024 * 1024,
    });
}
