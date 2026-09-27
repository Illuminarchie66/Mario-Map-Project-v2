import '../../../css/ui/components/image.css';

import { z } from "zod";
import { AlignSchema } from "./Generics";
import { Component } from "./Component";

import { imageViewer } from "../ImageViewer";
import { getPortableURL } from '../../core/Loader';

/*
This component is for a single image. This will have no text only a caption. 
Very similar to a carousel but only one image. We may want to merge this with the carousel component in the future.
*/

export const ImageBlockSchema = z.object({
    type: z.literal("image"),
    image: z.string(),
    caption: z.string().optional(),
    alignCaption: AlignSchema.optional(),
    zoomable: z.boolean().optional(),
    imageWidth: z.string().optional(),
    imageHeight: z.string().optional()
});

export type ImageBlock = z.infer<typeof ImageBlockSchema>;

export class ImageComponent extends Component<ImageBlock> {
    constructor(data: ImageBlock, path?: string) {
        super(data, path);
    }

    render(): HTMLElement {
        const container = document.createElement("div");
        container.className = "c-image-single";

        const imageWrapper = document.createElement("div");
        imageWrapper.className = "c-image-single__wrapper";

        if (this.data.imageWidth) 
            imageWrapper.style.width = this.data.imageWidth;

        const img = document.createElement("img");
        let imagePath = this.data.image;
        if (this.path)
            imagePath = this.path + "/" + imagePath;
        img.src = getPortableURL(imagePath);
        img.alt = this.data.caption || "";
        img.className = "c-image-single__img";

        if (this.data.imageHeight) 
            img.style.height = this.data.imageHeight;

        const finalImage = (this.data.zoomable !== false)
            ? imageViewer.makeZoomableImage(img, this.data.caption)
            : img;

        imageWrapper.appendChild(finalImage);

        if (this.data.caption) {
            const cap = document.createElement("div");
            cap.className = `
                c-image-single__caption 
                c-image-single__caption--${this.data.alignCaption || "center"}
            `;
            cap.innerHTML = this.formatText(this.data.caption);
            imageWrapper.appendChild(cap);
        }

        container.appendChild(imageWrapper);

        return container;
    }
}