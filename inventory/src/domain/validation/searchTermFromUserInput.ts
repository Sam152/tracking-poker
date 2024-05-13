export function searchTermFromUserInput(input: string): string {
    if (input.length > 32) {
        throw new Error("Search term too long.");
    }
    return input;
}
