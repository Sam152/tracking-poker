const aliases = {
    "FRANCISCO C": "FRANCISCO",
    "JBOOGS C": "FRANCISCO",
    "NICK NITUCCI": "NICK VERTUCCI",
    "NICK V": "NICK VERTUCCI",
    "MARIANO O": "MARIANO",
    "LEX 0": "LEX O",
    "4 HILARY": "HILARY",
};

/**
 * Sometimes players change the name they play under, sometimes there is a classification by OCR and a handful of cases
 * can be manually resolved.
 */
export function resolvePlayerNameAlias(name: string): string {
    return name;
}
