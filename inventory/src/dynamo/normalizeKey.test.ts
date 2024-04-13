import { normalizeKey } from "./normalizeKey";

describe("normalizeKey", () => {
    test("keys are plain", () => {
        expect(normalizeKey("Some string!#foo &*%#")).toEqual("somestringfoo");
    });
});
