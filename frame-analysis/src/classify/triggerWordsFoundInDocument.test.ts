import { triggerWordsFoundInDocument } from "./triggerWordsFoundInDocument";

describe("findByWholeWords", () => {
    test("single matching phrase", () => {
        expect(triggerWordsFoundInDocument("ZZZZ", ["ZZZZ"])).toEqual(true);
    });

    test("single matching phrase not exists", () => {
        expect(triggerWordsFoundInDocument("ZZZZ", ["AAAA"])).toEqual(false);
    });

    test("all words in a single phrase must exist", () => {
        expect(triggerWordsFoundInDocument("ZZZZ", ["ZZZZ AAAA"])).toEqual(false);
    });

    test("only one phrase in the list needs to match", () => {
        expect(triggerWordsFoundInDocument("ZZZZ", ["AAAA", "ZZZZ"])).toEqual(true);
    });
});
