import { z } from "zod";

export const HeaderBlockSchema = z.object({
    type: z.literal("header"),
    title: z.string(),
    tagline: z.string().optional(),
    image: z.string().optional(),
    link: z.string().optional()
});
export type HeaderBlock = z.infer<typeof HeaderBlockSchema>;