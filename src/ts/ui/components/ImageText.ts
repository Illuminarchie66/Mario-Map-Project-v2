import { z } from "zod";
import { AlignSchema } from "./Generics";
import { Component } from "./Component";

const ImageTextBlockSchema = z.object({
    title: z.string().optional(),
    alignTitle: AlignSchema.optional(),
    titleColor: z.string().optional(),
    titleOnTop: z.boolean().optional(),
    image: z.string(),
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
        const left = this.data.type === "image-left";

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
            title.textContent = this.data.title;
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
        img.src = this.path + "/" + this.data.image;
        img.alt = this.data.title || "";
        img.className = "c-media-block__main-image";
        img.style.height = this.data.imageHeight || "200px";
        
        // const finalImage = (data.zoomable !== false)
        //     ? makeZoomableImage(img, data, services.imageViewer)
        //     : img;
        const finalImage = img; 

        imageWrapper.appendChild(finalImage);

        if (this.data.caption) {
            const cap = document.createElement("div");
            cap.className = `
                c-media-block__caption 
                c-media-block__caption--${this.data.alignCaption || "right"}
            `;
            cap.textContent = this.data.caption;
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
            title.textContent = this.data.title;
            textWrapper.appendChild(title);
        }

        const text = document.createElement("p");
        text.className = `
            c-media-block__content 
            c-media-block__content--${this.data.alignContent || "left"}`;
        text.textContent = this.data.content;
        textWrapper.appendChild(text);

        block.appendChild(imageWrapper);
        block.appendChild(textWrapper);
        container.appendChild(block);

        return container;

    }
}

export class ImageLeftComponent extends ImageTextComponentBase<ImageLeftBlock> {}
export class ImageRightComponent extends ImageTextComponentBase<ImageRightBlock> {}