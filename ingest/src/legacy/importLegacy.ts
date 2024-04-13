import { recordThat } from "tp-events";

export async function importLegacy() {
    await recordThat("NewCompletedBroadcastDiscovered", {
        videoId: "9h5dLQ3QFoE",
        operator: "hcl",
    });
}
