import { stamp } from "../../util/nominalType";
import { normalizeKey } from "../../dynamo/normalizeKey";
import { PlayerId } from "../../projection/entity/playerAppearance";

export function playerIdFromUserInput(input: string): PlayerId {
    if (input !== normalizeKey(input)) {
        throw new Error("Invalid player ID provided.");
    }
    return stamp<PlayerId>(input);
}
