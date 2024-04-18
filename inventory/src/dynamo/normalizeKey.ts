export function normalizeKey(input: string): string {
    return input.toLowerCase().replace(/[^0-9a-z]/g, "");
}
