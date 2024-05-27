/**
 * Sometimes artefacts appear in stat tables that are indistinguishable from players in both layout and text. For
 * example, the bounty pool for bounty games will appear in the stats table. Resolve these cases while building
 * projections.
 */
export function playerNameShouldNotBeRepresented(input: string): boolean {
    return ["BOUNTY POOL"].includes(input);
}
