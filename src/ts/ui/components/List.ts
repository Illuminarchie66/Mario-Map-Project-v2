import { z } from "zod";
import { AlignSchema } from "./Generics";

export const ListBlockSchema = z.object({
    type: z.literal("list"),
    title: z.string().optional(),
    titleColor: z.string().optional(),
    alignTitle: AlignSchema.optional(),
    content: z.string().array(),
});
export type ListBlock = z.infer<typeof ListBlockSchema>;