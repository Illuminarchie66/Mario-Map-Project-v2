import { z } from "zod";

export const CarouselBlockSchema = z.object({
    type: z.literal("carousel"),
    images: z.array(z.object({
        image: z.string(),
        caption: z.string().optional()
    }))
});
export type CarouselBlock = z.infer<typeof CarouselBlockSchema>;