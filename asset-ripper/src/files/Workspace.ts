import { randomUUID } from "crypto";
import { BasicFs } from "objects";

export class Workspace {
    private readonly id: string;
    private fs: BasicFs;

    private constructor(id: string, fs: BasicFs) {
        this.id = id;
        this.fs = fs;
    }

    static create(fs: BasicFs): Workspace {
        return new Workspace(randomUUID(), fs);
    }

    public directory(): string {
        return `/tmp/${this.id}`;
    }

    public cleanUp(): void {
        this.fs.rmSync(this.directory(), { recursive: true, force: true });
    }

    public createSubDirectory(folder: string) {
        const path = `${this.directory()}/${folder}`;
        if (!this.fs.existsSync(path)) {
            this.fs.mkdirSync(path);
        }
        return path;
    }
}
