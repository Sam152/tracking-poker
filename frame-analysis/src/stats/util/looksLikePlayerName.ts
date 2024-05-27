export function looksLikePlayerName(candidate: string): boolean {
    // Detect incorrectly classified bounties.
    if (candidate.match(/^BOUNTY POOL$|HAND WITH|HANDS IN A/) !== null) {
        return false;
    }

    // Individual numbers are not usually player names.
    if (candidate.match(/^\d+$/)) {
        return false;
    }

    // Detect incorrectly classified artefacts in the image, this can be things from ad-text, supporting words or
    // individual characters coming from random shapes or textures in the image.
    if (candidate.match(/^VPIP$|^I$|^C$|^O$|^LIVE$|^KUNGJ$|^PRE-FLOP RAISE$|^\d+ BB$/)) {
        return false;
    }

    // Names are uppercase and only have a handful of special characters in them.
    return candidate.match(/^[0-9A-Z-.#' ]+$/) !== null;
}
