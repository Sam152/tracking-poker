import { BasicFs } from "objects";

export function listFiles(fs: BasicFs, directory: string) {
    return fs
        .readdirSync(directory, { withFileTypes: true })
        .filter((item) => !item.isDirectory())
        .map((item) => item.name);
}
