import { createMemoryFs } from "./createMemoryFs";

describe("createMemoryFs", () => {
    test("memory fs works like the node one", () => {
        // Can be swapped to the node fs to validate they behave the same.
        const fs = createMemoryFs();

        fs.mkdirSync("/tmp/foo/bar/baz/", { recursive: true });
        fs.writeFileSync("/tmp/foo/bar/test.txt", "sample");

        expect(fs.existsSync("/tmp/foo/bar/test.txt")).toEqual(true);
        expect(fs.existsSync("/tmp/foo/bar/missing.txt")).toEqual(false);

        expect(fs.readFileSync("/tmp/foo/bar/test.txt").toString()).toEqual("sample");

        expect(fs.readdirSync("/tmp/foo/bar/", { withFileTypes: true }).filter((item) => !item.isDirectory())).toEqual([
            {
                mode: 33206,
                name: "test.txt",
                path: "/tmp/foo/bar",
            },
        ]);

        expect(fs.readdirSync("/tmp/foo/bar/", { withFileTypes: true }).filter((item) => item.isDirectory())).toEqual([
            {
                mode: 16895,
                name: "baz",
                path: "/tmp/foo/bar",
            },
        ]);

        fs.rmSync("/tmp/foo/", { recursive: true, force: true });
        expect(fs.existsSync("/tmp/foo/bar/test.txt")).toEqual(false);
        expect(fs.existsSync("/tmp")).toEqual(true);
    });
});
