export function normalizeKey(input: string): string {
    return input.toLowerCase().replace(/[^a-z]/g, "");
}
