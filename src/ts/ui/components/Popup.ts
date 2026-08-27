import { z } from "zod";
import { BaseComponent } from "./BaseComponent";

export const PopupContentSchema = z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    caption: z.string().optional(),
    description: z.string().optional()
});

export type PopupContent = z.infer<typeof PopupContentSchema>;

export class PopupComponent extends BaseComponent<PopupContent> {
    render(): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.className = "map-popup__wrapper";
        wrapper.style.width = "400px";

        const inner = document.createElement("div");
        inner.className = "map-popup__inner";

        if (this.data.image) {
            const imageBlock = document.createElement("div");
            imageBlock.className = "map-popup__image-block";

            const img = document.createElement("img");
            img.className = "map-popup__image";
            img.src = this.path + "/" + this.data.image;
            img.alt = this.data.caption || "";

            // const finalImage = (data.zoomable !== false)
            //     ? makeZoomableImage(img, data, services.imageViewer)
            //     : img;

            const finalImage = img;

            imageBlock.appendChild(finalImage);

            const fade = document.createElement("div");
            fade.className = "map-popup__image-fade";
            imageBlock.appendChild(fade);

            inner.appendChild(imageBlock);
        }

        const body = document.createElement("div");
        body.className = "map-popup__body";

        if (this.data.title) {
            const title = document.createElement("h3");
            title.className = "map-popup__title";
            title.textContent = this.data.title;
            body.appendChild(title);

            const rule = document.createElement("hr");
            rule.className = "map-popup__rule";
            body.appendChild(rule);
        }

        if (this.data.description) {
            const desc = document.createElement("p");
            desc.className = "map-popup__description";
            desc.textContent = this.data.description;
            body.appendChild(desc);
        }

        inner.appendChild(body);
        wrapper.appendChild(inner);

        return wrapper;
    }
}