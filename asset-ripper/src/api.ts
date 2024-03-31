import { z } from "zod";

export const serviceInvocationEventsSchema = z.union([
    z.object({
        "detail-type": z.literal("StartAssetRipByVideoId"),
        detail: z.object({
            videoId: z.string(),
        }),
    }),
    z.object({
        "detail-type": z.literal("StartAssetRipByVideoUrl"),
        detail: z.object({
            videoUrl: z.string(),
        }),
    }),
]);

export type ServiceInvocationEvents = z.infer<typeof serviceInvocationEventsSchema>;
