import { z } from "zod";
import { HeaderBlockSchema } from "./Header";
import { ExploreButtonBlockSchema } from "./ExploreButton";
import { AppearedTableBlockSchema } from "./AppearedTable";
import { TextBlockSchema } from "./Text";
import { ListBlockSchema } from "./List";
import { ImageBlockSchema } from "./ImageSingle";
import { ImageLeftBlockSchema, ImageRightBlockSchema } from "./ImageText";
import { HorizontalRuleBlockSchema } from "./HorizontalRule";
import { CarouselBlockSchema } from "./Carousel";
import { SpacerBlockSchema } from "./Spacer";
import { ImageBottomBlockSchema } from "./ImageBottom";

/*
Definitions of the different content display types. This is because the pamphlet and doc content types are different, but they share some common content types.
This allows for the content to be checked by zod so we can find errors before rendering.
If we need a new display type we can add it here with little change to the rest of the code.
*/

const ContentBlockSchema = z.discriminatedUnion("type", [
    HeaderBlockSchema,
    ExploreButtonBlockSchema,
    AppearedTableBlockSchema,
    TextBlockSchema,
    ListBlockSchema,
    ImageBlockSchema,
    ImageRightBlockSchema,
    ImageLeftBlockSchema,
    HorizontalRuleBlockSchema,
    CarouselBlockSchema,
    SpacerBlockSchema,
    ImageBottomBlockSchema
]);

export type ContentBlock = z.infer<typeof ContentBlockSchema>;

export const PamphletContentSchema = z.object({
    left: z.array(ContentBlockSchema),
    right: z.array(ContentBlockSchema)
});
export type PamphletContent = z.infer<typeof PamphletContentSchema>;

export const DocContentSchema = z.object({
    title: z.string(),
    content: z.array(ContentBlockSchema)
});
export type DocContent = z.infer<typeof DocContentSchema>;