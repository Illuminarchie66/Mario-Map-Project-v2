import { z } from "zod";
import { HeaderBlockSchema } from "./Header";
import { ExploreButtonBlockSchema } from "./ExploreButton";
import { AppearedTableBlockSchema } from "./AppearedTable";
import { TextBlockSchema } from "./Text";
import { ListBlockSchema } from "./List";
import { ImageBlockSchema } from "./ImageSingle";
import { ImageRightBlockSchema } from "./ImageRight";
import { ImageLeftBlockSchema } from "./ImageLeft";
import { HorizontalRuleBlockSchema } from "./HorizontalRule";
import { CarouselBlockSchema } from "./Carousel";
import { SpacerBlockSchema } from "./Spacer";
import { ImageBottomBlockSchema } from "./ImageBottom";

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

type ContentBlock = z.infer<typeof ContentBlockSchema>;

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