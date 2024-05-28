import { InMemoryObjectStorage } from "./InMemoryObjectStorage";

describe("InMemoryS3Client", () => {
    test("can query for file exists or not", async () => {
        expect(
            await new InMemoryObjectStorage({
                fancyFile: "xyz",
            }).exists("fancyFile"),
        ).toEqual(true);

        expect(
            await new InMemoryObjectStorage({
                fancyFile: "xyz",
            }).exists("notAFile"),
        ).toEqual(false);
    });

    test("can put and retrieve a string file", async () => {
        const client = new InMemoryObjectStorage();
        await client.put("foo", "bar");
        expect(await client.getString("foo")).toEqual("bar");
    });

    test("can put and retrieve a buffer", async () => {
        const client = new InMemoryObjectStorage();
        await client.put("foo", Buffer.from([1, 8, 44]));
        expect(await client.get("foo")).toEqual(Buffer.from([1, 8, 44]));
    });

    test("can list files by prefix", async () => {
        const client = new InMemoryObjectStorage({
            "2001/01/01": "foo1",
            "2001/02/02": "foo23",
            "2002/01/01": "foo345",
            "2003/01/01": "foo5678",
        });
        expect(await client.list("2001/")).toEqual([
            {
                Key: "2001/01/01",
                Size: 4,
            },
            {
                Key: "2001/02/02",
                Size: 5,
            },
        ]);
    });

    test("can list all files", async () => {
        const client = new InMemoryObjectStorage({
            "2001/01/01": "foo1",
        });
        expect(await client.list("")).toEqual([
            {
                Key: "2001/01/01",
                Size: 4,
            },
        ]);
    });
});
