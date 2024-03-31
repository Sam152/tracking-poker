import path from "path";
import fs from "fs";
import {StatType} from "../stats/types/StatType";

export function fixturePath(asset: string | string[]): string {
    return path.join(__dirname, ...Array.isArray(asset) ? asset : [asset]);
}

export function writeFixture(filePath: string, contents: string) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, {recursive: true});
    }
    fs.writeFileSync(filePath, contents);
}

export type TestFrame = {
    videoId: string;
    frameId: string;
    frameFilename: string;
    framePath: string;
    labelledType: StatType | undefined,

    ocr: {
        cachePath: string;
        exists: boolean;
    }
    extract: {
        cachePath: string;
        exists: boolean;
    }
};

const fixtureFilenameTypeMap: Array<[string, StatType | undefined]> = [
    ['cc', StatType.ChipCount],
    ['cw', StatType.CumulativeWinnings],
    ['pfr', StatType.PreflopRaise],
    ['vpip', StatType.VPIP],
    ['zilch', undefined],
];
export function testFrames(): TestFrame[] {
    const frames = [];

    for (const videoId of fs.readdirSync(fixturePath('frames'))) {
        for (const frameFilename of fs.readdirSync(fixturePath(['frames', videoId]))) {

            const frameId = path.basename(frameFilename, '.jpg');
            const ocrPath = fixturePath(["ocr", videoId, frameId + '.txt']);
            const extractPath = fixturePath(["extract", videoId, frameId + '.json']);

            const fixtureType = fixtureFilenameTypeMap.find(([fileFragment, type]) => frameFilename.indexOf(fileFragment) !== -1);

            frames.push({
                videoId,
                frameId,
                frameFilename,
                framePath: fixturePath(["frames/", videoId, frameFilename]),
                labelledType: fixtureType ? fixtureType[1] : undefined,

                ocr: {
                    cachePath: ocrPath,
                    exists: fs.existsSync(ocrPath),
                },
                extract: {
                    cachePath: extractPath,
                    exists: fs.existsSync(extractPath),
                }
            });
        }
    }

    return frames;
}
