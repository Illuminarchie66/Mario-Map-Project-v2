import '../../../css/ui/components/explore-button.css';

import { z } from "zod";
import { Component } from "./Component";
import { eventBus } from "../../core/EventBus";
import { getPortableURL } from '../../core/portableURL';

export const ExploreButtonBlockSchema = z.object({
    type: z.literal("explore-button"),
    target: z.string().optional(),
    center: z.tuple([z.number(), z.number()]).optional(),
    zoom: z.number().optional(),
    label: z.string().optional()
});

export type ExploreButtonBlock = z.infer<typeof ExploreButtonBlockSchema>;

export class ExploreButtonComponent extends Component<ExploreButtonBlock> {
    constructor(data: ExploreButtonBlock) {
        super(data);
    }

    render(): HTMLElement {
        const button = document.createElement("button");
        button.className = "c-explore-button";

        button.append("Explore");

        const icon = document.createElement("img");
        icon.src = getPortableURL("/assets/icons/mag_glass.svg");
        icon.alt = "Zoom";
        icon.className = "c-explore-button__icon";

        button.appendChild(icon);
        
        if (this.data.target) {
            const payload = {
                id: this.data.target,
                center: this.data.center,
                zoom: this.data.zoom
            };

            button.addEventListener("click", () => {
                eventBus.emit("map:load", payload)
            });
        }

        return button;
    }
}