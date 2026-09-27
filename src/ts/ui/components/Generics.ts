import { z } from "zod";

/*
Helpful generics used for the rest of the components, defining common types used across multiple components.
*/

export const GameRefSchema = z.object({
    game: z.string(),
    year: z.number(),
    link: z.string().optional()
});
export type GameRef = z.infer<typeof GameRefSchema>;

export const AlignSchema = z.enum(["left", "center", "right", "top", "bottom"]);
export type Align = z.infer<typeof AlignSchema>;