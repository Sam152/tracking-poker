export function stringFromParts(inputs: Array<string | undefined>): string {
    return inputs.filter((item) => item).join(" ");
}
