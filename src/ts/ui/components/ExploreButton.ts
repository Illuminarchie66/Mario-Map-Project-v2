import { z } from "zod";

export const ExploreButtonBlockSchema = z.object({
    type: z.literal("explore-button"),
    target: z.string(),
    label: z.string().optional()
});
export type ExploreButtonBlock = z.infer<typeof ExploreButtonBlockSchema>;