import { z } from "zod";
import { AlignSchema } from "./Generics";

export const ImageBlockSchema = z.object({
    type: z.literal("image"),
    image: z.string(),
    caption: z.string().optional(),
    alignCaption: AlignSchema.optional(),
    zoomable: z.boolean().optional(),
    imageWidth: z.string().optional(),
    imageHeight: z.string().optional()
});
export type ImageBlock = z.infer<typeof ImageBlockSchema>;