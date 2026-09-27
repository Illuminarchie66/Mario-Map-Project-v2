import '../../../css/ui/components/image.css';

import { z } from "zod";
import { AlignSchema } from "./Generics";
import { Component } from "./Component";

import { imageViewer } from "../ImageViewer";
import { getPortableURL } from '../../core/Loader';

/*
This component is for a single image with text. The text can either be on the left or right side, specified by the type being image-left or image-right. 
The text can be aligned to the left, center, or right, and the image can be aligned to the top, middle, or bottom. 
The title can be on top of the image or above the text, which helps for when there is not enough text. 
On small screens, we just stack the image and text on top of each other, with the image on top.
*/

const ImageTextBlockSchema = z.object({
    title: z.string().optional(),
    alignTitle: AlignSchema.optional(),
    titleColor: z.string().optional(),
    titleOnTop: z.boolean().optional(),
    image: z.string(),
    zoomable: z.boolean().optional(),
    alignImage: AlignSchema.optional(),
    imageWidth: z.string().optional(),
    imageHeight: z.string().optional(),
    content: z.string(),
    alignContent: AlignSchema.optional(),
    caption: z.string().optional(),
    alignCaption: AlignSchema.optional(),
});

export const ImageLeftBlockSchema = ImageTextBlockSchema.extend({
    type: z.literal("image-left")
});

export const ImageRightBlockSchema = ImageTextBlockSchema.extend({
    type: z.literal("image-right")
});

export type ImageTextBlock = z.infer<typeof ImageTextBlockSchema>;
export type ImageLeftBlock = z.infer<typeof ImageLeftBlockSchema>;
export type ImageRightBlock = z.infer<typeof ImageRightBlockSchema>;

export abstract class ImageTextComponentBase<T extends ImageLeftBlock | ImageRightBlock> extends Component<T> {
    render(): HTMLElement {
        const left = (window.innerWidth < 425) ? false : (this.data.type === "image-left") ;

        const container = document.createElement("div");
        container.className = `c-media-block__container`;

        if (this.data.title && this.data.titleOnTop) {
            const title = document.createElement("h2");
            title.className = `
                c-media-block__title 
                c-media-block__title--${this.data.alignTitle || "left"}
            `;
            if (this.data.titleColor) 
                title.style.color = this.data.titleColor;
            title.innerHTML = this.formatText(this.data.title);
            container.appendChild(title);
        }

        const block = document.createElement("div");
        block.className = `
            c-media-block c-media-block--${left ? "left" : "right"}
            c-media-block--${this.data.alignImage || "top"}
        `;

        const imageWrapper = document.createElement("div");
        imageWrapper.className = "c-media-block__image";
        imageWrapper.style.width = this.data.imageWidth || "180px";

        const img = document.createElement("img");
        let imagePath = this.data.image;
        if (this.path)
            imagePath = this.path + "/" + imagePath;
        img.src = getPortableURL(imagePath);
        img.alt = this.data.title || "";
        img.className = "c-media-block__main-image";
        img.style.height = this.data.imageHeight || "200px";
        
        const finalImage = (this.data.zoomable !== false)
            ? imageViewer.makeZoomableImage(img, this.data.caption)
            : img;

        imageWrapper.appendChild(finalImage);

        if (this.data.caption) {
            const cap = document.createElement("div");
            cap.className = `
                c-media-block__caption 
                c-media-block__caption--${this.data.alignCaption || "right"}
            `;
            cap.innerHTML = this.formatText(this.data.caption);
            imageWrapper.appendChild(cap);
        }

        const textWrapper = document.createElement("div");
        textWrapper.className = "c-media-block__text";

        if (this.data.title && !this.data.titleOnTop) {
            const title = document.createElement("h2");
            title.className = `
                c-media-block__title 
                c-media-block__title--${this.data.alignTitle || "left"}`;
            if (this.data.titleColor) 
                title.style.color = this.data.titleColor;
            title.innerHTML = this.formatText(this.data.title);
            textWrapper.appendChild(title);
        }

        const text = document.createElement("p");
        text.className = `
            c-media-block__content 
            c-media-block__content--${this.data.alignContent || "left"}`;
        text.innerHTML = this.formatText(this.data.content);
        textWrapper.appendChild(text);
        
        if (left) {
            block.appendChild(imageWrapper);
            block.appendChild(textWrapper);
        } else {
            block.appendChild(textWrapper);
            block.appendChild(imageWrapper);
        }
        
        container.appendChild(block);

        return container;

    }
}

export class ImageLeftComponent extends ImageTextComponentBase<ImageLeftBlock> {}
export class ImageRightComponent extends ImageTextComponentBase<ImageRightBlock> {}