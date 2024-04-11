import { s3UriToParts } from "./s3UriToParts";

describe("s3UriToParts", () => {
    test("parts to be extracted", () => {
        expect(s3UriToParts("s3://foo-bucket/bar-key/baz-path/biz.jpg")).toEqual({
            bucket: "foo-bucket",
            key: "bar-key/baz-path/biz.jpg",
        });
    });
});
