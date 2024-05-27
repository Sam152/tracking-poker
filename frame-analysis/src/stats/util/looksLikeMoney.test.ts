import { looksLikeMoney, parseMoney } from "./looksLikeMoney";

const cases = [
    ["$16,600", true, 16600],
    ["$1,063,000", true, 1063000],
    ["$3M", true, 3000000],
    ["$956K", true, 956000],
    ["$14,400 V", true, 14400],
    ["$689,000 A", true, 689000],
    ["$1.4M", true, 1400000],
    // The "A" is often a misidentified "up arrow" in the cumulative winnings stat.
    ["$335,000 A", true, 335000],
    ["BLINDS $25 / $50/$100 - $50 - (BB)", false, null],
    ["BLINDS $25 (OTB) - $25", false, null],
    ["BRIAN", false, null],
    ["7", false, null],
    ["$2.1M", true, 2100000],
    ["$1.1M", true, 1100000],
    ["$1.6M", true, 1600000],
    ["$588K A", true, 588000],
    ["$1.3M", true, 1300000],
    ["$341K", true, 341000],
    ["$3M", true, 3000000],
    ["$0", true, 0],
    ["$960K", true, 960000],
    ["$289K V", true, 289000],
    ["$640K", true, 640000],
    ["$360K V", true, 360000],
    ["$956K", true, 956000],
    ["$543K V", true, 543000],
    ["$1M", true, 1000000],
    ["$1M V", true, 1000000],
    ["$1M  V", true, 1000000],
    ["$1M  A", true, 1000000],
] as const;

describe.each(cases)("looksLikeMoney", (input, expected, parsedValue) => {
    test(`identified if ${input} ${expected ? "looks like" : "does not look like"} money`, () => {
        expect(looksLikeMoney(input)).toEqual(expected);
        if (parsedValue === null) {
            expect(() => parseMoney(input)).toThrow();
        } else {
            expect(parseMoney(input)).toEqual(parsedValue);
        }
    });
});
