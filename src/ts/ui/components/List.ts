import '../../../css/ui/components/list.css';

import { z } from "zod";
import { AlignSchema } from "./Generics";
import { Component } from "./Component";

/*
This is a list component that displays a list of items. It does so as two columns, with the left column having one more item than the right column if there is an odd number of items.
This is to fill the space better and make it look more balanced.
*/

export const ListBlockSchema = z.object({
    type: z.literal("list"),
    title: z.string().optional(),
    titleColor: z.string().optional(),
    alignTitle: AlignSchema.optional(),
    content: z.string().array(),
});

export type ListBlock = z.infer<typeof ListBlockSchema>;

export class ListComponent extends Component<ListBlock> {
    constructor(data: ListBlock) {
        super(data);
    }

    buildColumn(items: string[]): HTMLElement {
        const col = document.createElement("div");
        col.className = "c-list__column";

        items.forEach(text => {
            const li = document.createElement("div");
            li.className = "c-list__item";
            li.innerHTML = this.formatText(text);
            col.appendChild(li);
        });

        return col;
    }

    render(): HTMLElement {
        const container = document.createElement("div");
        container.className = "c-list";

        if (this.data.title) {
            const title = document.createElement("h2");
            title.className = `
                c-list__title 
                c-list__title--${this.data.alignTitle || "left"}
            `;
            if (this.data.titleColor) 
                title.style.color = this.data.titleColor;
            title.innerHTML = this.formatText(this.data.title);
            container.appendChild(title);
        }

        const items = this.data.content ?? [];
        const total = items.length;
        const leftCount = Math.ceil(total / 2);
        const leftItems = items.slice(0, leftCount);
        const rightItems = items.slice(leftCount);

        const columns = document.createElement("div");
        columns.className = "c-list__columns";

        columns.appendChild(this.buildColumn(leftItems));
        columns.appendChild(this.buildColumn(rightItems));

        container.appendChild(columns);

        return container;
    }
}