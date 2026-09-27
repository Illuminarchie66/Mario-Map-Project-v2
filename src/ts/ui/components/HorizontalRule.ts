import '../../../css/ui/components/horizontal-rule.css';

import { z } from "zod";
import { AlignSchema } from "./Generics";
import { Component } from "./Component";

/*
Simple class that renders a horizontal rule. This can be used to separate content in a pamphlet or doc.
Known issue is that color is set by the data, but this fails for a pamphlet split. 
*/

export const HorizontalRuleBlockSchema = z.object({
    type: z.literal("horizontal-rule"),
    align: AlignSchema.optional(),
    color: z.string().optional()
});

export type HorizontalRuleBlock = z.infer<typeof HorizontalRuleBlockSchema>;

export class HorizontalRuleComponent extends Component<HorizontalRuleBlock> {
    constructor(data: HorizontalRuleBlock) {
        super(data);
    }

    render(): HTMLElement {
        const hr = document.createElement("hr");
        hr.className = "c-horizontal-rule c-horizontal-rule--" + (this.data.align || "center");
        hr.style.borderTopColor = this.data.color || "#ccc";

        return hr;
    }
}