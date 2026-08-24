import { z } from "zod";
import { Component } from "./BaseComponent";

export const SpacerBlockSchema = z.object({
    type: z.literal("spacer")
});

export type SpacerBlock = z.infer<typeof SpacerBlockSchema>;

export class SpacerComponent extends Component<SpacerBlock> {
    constructor(data: SpacerBlock) {
        super(data);
    }

    render(): HTMLElement {
        const el = document.createElement("div");
        el.className = "c-spacer";
        return el;
    }
}