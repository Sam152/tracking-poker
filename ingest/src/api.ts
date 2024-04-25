import { z } from "zod";

export const serviceInvocationEventsSchema = z.union([
    z.object({
        "detail-type": z.literal("CheckForNewStreams"),
    }),
    z.object({
        "detail-type": z.literal("IngestLegacyStream"),
    }),
]);

export type ServiceInvocationEvents = z.infer<typeof serviceInvocationEventsSchema>;
