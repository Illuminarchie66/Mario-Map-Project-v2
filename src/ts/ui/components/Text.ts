import '../../../css/ui/components/text.css';

import { z } from "zod";
import { AlignSchema } from "./Generics";
import { Component } from "./Component";

/*
A simple text component that displays a title and content that can be aligned as desired.
In future need to add rendering with italics, bold and hyperlinks. 
*/

export const TextBlockSchema = z.object({
    type: z.literal("text"),
    title: z.string().optional(),
    titleColor: z.string().optional(),
    alignTitle: AlignSchema.optional(),
    content: z.string(),
    alignContent: AlignSchema.optional()
});

export type TextBlock = z.infer<typeof TextBlockSchema>;

export class TextComponent extends Component<TextBlock> {
    constructor(data: TextBlock) {
        super(data);
    }

    render(): HTMLElement {
        const container = document.createElement("div");
        container.className = "c-text-block";

        if (this.data.title) {
            const title = document.createElement("h2");
            title.className = `
                c-text-block__title 
                c-text-block__title--${this.data.alignTitle || "left"}
            `;

            if (this.data.titleColor)
                title.style.color = this.data.titleColor;

            title.innerHTML = this.formatText(this.data.title);
            container.appendChild(title);
        }

        const text = document.createElement("p");
        text.className = `
            c-text-block__content 
            c-text-block__content--${this.data.alignContent || "left"}
        `;
        text.innerHTML = this.formatText(this.data.content);
        container.appendChild(text);

        return container;
    }
}