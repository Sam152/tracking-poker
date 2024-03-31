import {z} from "zod";

export const serviceInvocationEventsSchema = z.object({
    "detail-type": z.literal("StartAnalysisOfFrame"),
    detail: z.object({
        bucket: z.string(),
        key: z.string(),
        frameId: z.string(),
        videoId: z.string(),
    }),
});

export type ServiceInvocationEvents = z.infer<typeof serviceInvocationEventsSchema>;
