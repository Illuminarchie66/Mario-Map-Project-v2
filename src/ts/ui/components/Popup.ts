import { z } from "zod";

export const PopupContentSchema = z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    caption: z.string().optional(),
    description: z.string().optional()
});
export type PopupContent = z.infer<typeof PopupContentSchema>;