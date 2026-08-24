import { z } from "zod";

export const ImageBottomBlockSchema = z.object({
    type: z.literal("image-bottom"),
    image: z.string(),
    height: z.string().optional()
});
export type ImageBottomBlock = z.infer<typeof ImageBottomBlockSchema>;