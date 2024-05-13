import { ShowId } from "../../projection/entity/show";
import { stamp } from "../../util/nominalType";

export function showIdFromUserInput(input: string): ShowId {
    if (input !== input.replace(/[^a-zA-Z0-9_-]/, "") || input.length !== 11) {
        throw new Error("Invalid show ID provided.");
    }
    return stamp<ShowId>(input);
}
