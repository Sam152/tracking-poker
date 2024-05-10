import { looksLikeMoney, parseMoney } from "./looksLikeMoney";

const cases = [
    ["$16,600", true, 16600],
    ["$1,063,000", true, 1063000],
    ["$3M", true, 3000000],
    ["$956K", true, 956000],
    ["$14,400 V", true, 14400],
    ["$689,000 A", true, 689000],
    // The "A" is often a misidentified "up arrow" in the cumulative winnings stat.
    ["$335,000 A", true, 335000],
    ["BLINDS $25 / $50/$100 - $50 - (BB)", false, null],
    ["BLINDS $25 (OTB) - $25", false, null],
    ["BRIAN", false, null],
    ["7", false, null],
] as const;

describe.each(cases)("looksLikeMoney", (input, expected, parsedValue) => {
    test(`money that looks like ${input} is correctly identified as ${expected ? "true" : "false"}`, () => {
        expect(looksLikeMoney(input)).toEqual(expected);
        if (parsedValue === null) {
            expect(() => parseMoney(input)).toThrow();
        } else {
            expect(parseMoney(input)).toEqual(parsedValue);
        }
    });
});
