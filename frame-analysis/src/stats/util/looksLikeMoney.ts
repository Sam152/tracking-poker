const moneyExpression = /^\$(?<numbers>[0-9,. ]+)(?<million>M)?(?<thousand>K)?(?<arrows>[AV])?$/;

export function looksLikeMoney(input: string): boolean {
    return !!input.match(moneyExpression);
}

export function parseMoney(input: string): number {
    const matches = input.match(moneyExpression);
    if (!matches) {
        throw new Error("Money could not be parsed from string");
    }

    let rawNumber = parseFloat(matches.groups!.numbers!.replace(/[, ]/g, ""));
    if (matches.groups!.thousand) {
        rawNumber *= 1_000;
    }
    if (matches.groups!.million) {
        rawNumber *= 1_000_000;
    }

    return rawNumber;
}
