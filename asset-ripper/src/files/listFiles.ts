import * as fs from "fs";

export function listFiles(directory: string) {
    return fs
        .readdirSync(directory, { withFileTypes: true })
        .filter((item) => !item.isDirectory())
        .map((item) => item.name);
}
