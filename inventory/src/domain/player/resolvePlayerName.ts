/**
 * Players can play under multiple names, attempt to normalize them somewhat.
 *
 * Player names can also occasionally include artefacts from images, such as indicators for the button game (hence the
 * additional O appended to some players). We can build a list of aliases and OCR mistakes here, and deal with the
 * mismatch while building projections. This allows corrections to be made with a rebuild of the projections.
 */
const aliases: Record<string, string> = {
    "FRANCISCO C": "FRANCISCO",
    "JBOOGS C": "JEREMY",
    JBOOGS: "JEREMY",
    "NICK NITUCCI": "NICK VERTUCCI",
    "NICK V": "NICK VERTUCCI",
    "MARIANO O": "MARIANO",
    "ANDY O": "ANDY",
    "LEX 0": "LEX O",
    "4 HILARY": "HILARY",
    "S MARS": "MARS",
    "MARS O": "MARS",
    "PATRICK O": "PATRICK",
    "SANTA O": "SANTA",
};

export function resolvePlayerName(name: string): string {
    return aliases.hasOwnProperty(name) ? aliases[name] : name;
}
