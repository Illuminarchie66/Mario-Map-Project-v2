import '../../../css/ui/components/header.css';

import { z } from "zod";
import { Component } from "./Component";
import { getPortableURL } from '../../core/portableURL';

export const HeaderBlockSchema = z.object({
    type: z.literal("header"),
    title: z.string(),
    tagline: z.string().optional(),
    image: z.string().optional(),
    link: z.string().optional()
});

export type HeaderBlock = z.infer<typeof HeaderBlockSchema>;

export class HeaderComponent extends Component<HeaderBlock> {
    constructor(data: HeaderBlock, path?: string) {
        super(data, path);
    }

    render(): HTMLElement {
        const container = document.createElement("div");
        container.className = "c-header";

        if (this.data.image) {
            const img = document.createElement("img");
            let imagePath = this.data.image;
            if (this.path)
                imagePath = this.path + "/" + imagePath;
            img.src = getPortableURL(imagePath);
            img.alt = this.data.title || "";
            img.className = "c-header__image";
            container.appendChild(img);
        }

        const titleContainer = document.createElement("div");
        titleContainer.className = "c-header__title-container";

        const titleBlock = document.createElement("div");
        titleBlock.className = "c-header__title-block";

        const title = document.createElement("h1");
        title.className = "c-header__title";

        if (this.data.link) {
            const a = document.createElement("a");
            a.href = this.data.link;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = this.data.title;
            title.appendChild(a);
        } else {
            title.textContent = this.data.title;
        }

        titleBlock.appendChild(title);

        if (this.data.tagline) {
            const tagline = document.createElement("p");
            tagline.className = "c-header__tagline";
            tagline.textContent = this.data.tagline;
            titleBlock.appendChild(tagline);
        }

        titleContainer.appendChild(titleBlock);
        container.appendChild(titleContainer);

        return container;
    }
}