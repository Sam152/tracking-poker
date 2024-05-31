import { BasicFs } from "./basicFs";
import { Volume } from "memfs";
import { DirectoryJSON } from "memfs/lib/volume";
import { mkdirSync, readFileSync } from "fs";
import { readdirSync, writeFileSync } from "node:fs";

export function createMemoryFs(json?: DirectoryJSON, cwd?: string): BasicFs {
    const vol = Volume.fromJSON(json || {}, cwd);
    return {
        // Reconcile some differences in the types, the differences seem superficial (such as some optional params
        // accepting both null and undefined) and the implementation is tested within the scope of how we're using the
        // fs functions.
        readFileSync: vol.readFileSync.bind(vol) as typeof readFileSync,
        rmSync: vol.rmSync.bind(vol),
        writeFileSync: vol.writeFileSync.bind(vol) as typeof writeFileSync,
        existsSync: vol.existsSync.bind(vol),
        readdirSync: vol.readdirSync.bind(vol) as typeof readdirSync,
        mkdirSync: vol.mkdirSync.bind(vol) as typeof mkdirSync,
    };
}
