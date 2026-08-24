import { z } from "zod";
import { GameRefSchema } from "./Generics";

export const AppearedTableBlockSchema = z.object({
    type: z.literal("appeared-table"),
    firstAppeared: GameRefSchema.optional(),
    lastAppeared: GameRefSchema.optional()
});
export type AppearedTableBlock = z.infer<typeof AppearedTableBlockSchema>;