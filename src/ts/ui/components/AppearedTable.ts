import { z } from "zod";
import { GameRefSchema } from "./Generics";
import { Component } from "./Component";

export const AppearedTableBlockSchema = z.object({
    type: z.literal("appeared-table"),
    firstAppeared: GameRefSchema.optional(),
    lastAppeared: GameRefSchema.optional(),
    appeared: GameRefSchema.optional()
});

export type AppearedTableBlock = z.infer<typeof AppearedTableBlockSchema>;

export class AppearedTableComponent extends Component<AppearedTableBlock> {
    constructor(data: AppearedTableBlock) {
        super(data);
    }

    addRow(label: string, value: string, link?: string): HTMLElement {
        const row = document.createElement("div");
        row.className = "c-appeared-table__row";

        const labelEl = document.createElement("span");
        labelEl.className = "c-appeared-table__label";
        labelEl.textContent = label;

        let valueEl;
        if (link) {
            valueEl = document.createElement("a");
            valueEl.href = link;
            valueEl.target = "_blank";
            valueEl.rel = "noopener noreferrer";
            valueEl.className = `
                c-appeared-table__value 
                c-appeared-table__value--link
            `;
        } else {
            valueEl = document.createElement("span");
            valueEl.className = "c-appeared-table__value";
        }
        valueEl.textContent = value;

        row.appendChild(labelEl);
        row.appendChild(valueEl);

        return row;
    }

    render(): HTMLElement {
        const container = document.createElement("div");
        container.className = "c-appeared-table";

        if (this.data.firstAppeared) {
            const fa = this.data.firstAppeared;
            const row = this.addRow(
                "First Appeared",
                `${fa.game} (${fa.year})`,
                fa.link
            );
            container.appendChild(row);
        }

        if (this.data.lastAppeared) {
            const la = this.data.lastAppeared;
            const row = this.addRow(
                "First Appeared",
                `${la.game} (${la.year})`,
                la.link
            );
            container.appendChild(row);
        }

        if (this.data.appeared) {
            const a = this.data.appeared;
            const row = this.addRow(
                "Appeared",
                `${a.game} (${a.year})`,
                a.link
            );
            container.appendChild(row);
        }

        return container;
    }
}