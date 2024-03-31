import { randomUUID } from "crypto";
import * as fs from "fs";

export class Workspace {
    private readonly id: string;

    private constructor(id: string) {
        this.id = id;
    }

    static create(): Workspace {
        return new Workspace(randomUUID());
    }

    public directory(): string {
        return `/tmp/${this.id}`;
    }

    public cleanUp(): void {
        fs.rmSync(this.directory(), { recursive: true, force: true });
    }

    public createSubDirectory(folder: string) {
        const path = `${this.directory()}/${folder}`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        return path;
    }
}
