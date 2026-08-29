import '../../../css/ui/components/image.css';

import { z } from "zod";
import { Component } from "./Component";

export const ImageBottomBlockSchema = z.object({
    type: z.literal("image-bottom"),
    image: z.string(),
    height: z.string().optional()
});

export type ImageBottomBlock = z.infer<typeof ImageBottomBlockSchema>;

export class ImageBottomComponent extends Component<ImageBottomBlock> {
    constructor(data: ImageBottomBlock, path?: string) {
        super(data, path);
    }

    render(): HTMLElement {
        const container = document.createElement("div");
        container.className = "c-image-bottom";

        const img = document.createElement("img");
        let imagePath = this.data.image;
        if (this.path)
            imagePath = this.path + "/" + imagePath;
        img.src = imagePath;
        img.className = "c-image-bottom__img";

        if (this.data.height) {
            img.style.height = this.data.height;
        }

        container.appendChild(img);

        return container;
    }
}