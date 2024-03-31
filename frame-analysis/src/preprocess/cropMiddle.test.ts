import { toMatchImageSnapshot } from "jest-image-snapshot";
import { fixturePath } from "../__fixtures__/fixturePath";
import { cropMiddle } from "./cropMiddle";
import fs from "fs";

expect.extend({ toMatchImageSnapshot });

const testCases = ["-bL2jGrq02c/vpip_2.jpg", "-0PTY2_kpRc/cw_3.jpg"];

describe("cropMiddle", () => {
    for (const testCase of testCases) {
        test(`crop middle of ${testCase}`, async () => {
            const frame = fixturePath(["frames", testCase]);
            expect(await cropMiddle(fs.readFileSync(frame))).toBeDefined();
        });
    }
});
