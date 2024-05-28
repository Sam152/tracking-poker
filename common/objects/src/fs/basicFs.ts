import { mkdirSync, readFileSync } from "fs";
import { existsSync, readdirSync, rmSync, writeFileSync } from "node:fs";

export type BasicFs = {
    readFileSync: typeof readFileSync;
    rmSync: typeof rmSync;
    writeFileSync: typeof writeFileSync;
    existsSync: typeof existsSync;
    readdirSync: typeof readdirSync;
    mkdirSync: typeof mkdirSync;
};

// Choose a subset of fs operations we use and ensure an in-memory implementation implements the same operations
// faithfully, for the purposes of testing.
export const basicFs: BasicFs = {
    readFileSync,
    rmSync,
    writeFileSync,
    existsSync,
    readdirSync,
    mkdirSync,
};
