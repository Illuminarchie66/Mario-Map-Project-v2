import '../../../css/ui/components/spacer.css';

import { z } from "zod";
import { Component } from "./Component";

/*
This is a simple spacer component that is used to add a space of variable height between components.
Helpful when stuff needs to be a bit more spaced out, or you want a gap for the bottom image.
*/

export const SpacerBlockSchema = z.object({
    type: z.literal("spacer"),
    height: z.string().optional(),
});

export type SpacerBlock = z.infer<typeof SpacerBlockSchema>;

export class SpacerComponent extends Component<SpacerBlock> {
    constructor(data: SpacerBlock) {
        super(data);
    }

    render(): HTMLElement {
        const el = document.createElement("div");
        el.className = "c-spacer";
        el.style.minHeight = this.data.height || "20px";
        return el;
    }
}