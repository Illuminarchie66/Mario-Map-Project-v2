import { z } from "zod";

export const ImageRightBlockSchema = z.object({
    type: z.literal("image-right"),
    title: z.string().optional(),
    titleColor: z.string().optional(),
    alignImage: z.string().optional(),
    image: z.string(),
    imageHeight: z.string().optional(),
    content: z.string(),
    caption: z.string().optional()
});
export type ImageRightBlock = z.infer<typeof ImageRightBlockSchema>;