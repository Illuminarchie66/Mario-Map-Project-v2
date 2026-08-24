import { z } from "zod";

export const ImageLeftBlockSchema = z.object({
    type: z.literal("image-left"),
    alignImage: z.string().optional(),
    image: z.string(),
    imageWidth: z.string().optional(),
    content: z.string(),
    caption: z.string().optional(),
    zoomable: z.boolean().optional()
});
export type ImageLeftBlock = z.infer<typeof ImageLeftBlockSchema>;