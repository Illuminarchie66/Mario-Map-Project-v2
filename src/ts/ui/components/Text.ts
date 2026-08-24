import { z } from "zod";
import { AlignSchema } from "./Generics";

export const TextBlockSchema = z.object({
    type: z.literal("text"),
    title: z.string().optional(),
    titleColor: z.string().optional(),
    alignTitle: AlignSchema.optional(),
    content: z.string(),
    alignContent: AlignSchema.optional()
});
export type TextBlock = z.infer<typeof TextBlockSchema>;