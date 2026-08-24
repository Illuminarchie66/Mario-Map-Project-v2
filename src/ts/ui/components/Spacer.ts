import { z } from "zod";

export const SpacerBlockSchema = z.object({
    type: z.literal("spacer")
});
export type SpacerBlock = z.infer<typeof SpacerBlockSchema>;