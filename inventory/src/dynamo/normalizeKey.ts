export function normalizeKey(input: string): string {
    return input.toLowerCase().replace(/[^a-z0-9]/g, "");
}
