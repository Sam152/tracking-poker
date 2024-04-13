import { z } from "zod";

export const serviceInvocationEventsSchema = z.object({
    "detail-type": z.literal("CheckForNewStreams"),
});
