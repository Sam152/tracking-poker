export const stakesMatch = /(?<stakes>((\$[\d,]+\/\$?[\d,]+\/\$?[\d,]+)|(\$[\d,]+\/\$?[\d,]+)))/;

export function extractStakes(input: string): string | undefined {
    const match = stakesMatch.exec(input)?.groups as { stakes: string } | undefined;
    return match?.stakes ? match?.stakes.replaceAll(",", "") : undefined;
}
