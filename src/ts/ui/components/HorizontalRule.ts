import { z } from "zod";
import { AlignSchema } from "./Generics";

export const HorizontalRuleBlockSchema = z.object({
    type: z.literal("horizontal-rule"),
    align: AlignSchema.optional(),
    color: z.string().optional()
});
export type HorizontalRuleBlock = z.infer<typeof HorizontalRuleBlockSchema>;