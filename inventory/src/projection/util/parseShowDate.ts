import { ShowDate } from "../entity/show";

export function parseShowDate(input: string): ShowDate {
    return `${input.substring(0, 4)}/${input.substring(4, 6)}/${input.substring(6, 8)}`;
}
