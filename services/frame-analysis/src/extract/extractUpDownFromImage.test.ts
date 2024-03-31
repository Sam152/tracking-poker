import fs from "fs";
import path from "path";
import {extractUpDownFromImage} from "./extractUpDownFromImage";

describe("extractUpDownFromImage", () => {
    for (const arrowFilename of fs.readdirSync(path.resolve(__dirname, '__fixtures__/arrows'))) {
        const classification = arrowFilename.indexOf('up') !== -1 || arrowFilename.indexOf('misc') !== -1 ? 1 : -1;
        test(`classifying ${arrowFilename} as ${classification === 1 ? 'up' : 'down'}`, async () => {
            const arrow = fs.readFileSync(path.resolve(__dirname, '__fixtures__/arrows', arrowFilename));
            expect(await extractUpDownFromImage(arrow)).toEqual(classification);
        });
    }
});
