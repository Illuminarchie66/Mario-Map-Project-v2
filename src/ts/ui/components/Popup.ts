import '../../../css/ui/components/popup.css';

import { z } from "zod";
import { BaseComponent } from "./BaseComponent";
import { ExploreButtonBlockSchema } from "./ExploreButton";
import { componentRenderer } from "../ComponentRenderer";
import { imageViewer } from "../ImageViewer";

import $ from 'jquery';
import 'slick-carousel';

export const PopupContentSchema = z.object({
    title: z.string().optional(),
    link: z.string().optional(),
    image: z.string().optional(),
    images: z.array(z.object({
        image: z.string(),
        caption: z.string().optional(),
    })).optional(),
    caption: z.string().optional(),
    description: z.string().optional(),
    exploreButton: ExploreButtonBlockSchema.optional()
});

export type PopupContent = z.infer<typeof PopupContentSchema>;

export class PopupComponent extends BaseComponent<PopupContent> {
    renderSingleImage(imagePath: string, caption?: string): HTMLElement {
        const imageBlock = document.createElement("div");
        imageBlock.className = "map-popup__image-block";

        const img = document.createElement("img");
        img.className = "map-popup__image";
        if (this.path)
            imagePath = this.path + "/" + imagePath;

        img.src = imagePath;
        img.alt = caption || "";

        const finalImage = imageViewer.makeZoomableImage(img, caption)

        imageBlock.appendChild(finalImage);

        const fade = document.createElement("div");
        fade.className = "map-popup__image-fade";
        imageBlock.appendChild(fade);

        return imageBlock;
    }

    renderImageCarousel(images: { image: string, caption?: string }[]): HTMLElement {
        const carouselContainer = document.createElement("div");
        carouselContainer.className = "map-popup__carousel-container";

        const carousel = document.createElement("div");
        carousel.className = "map-popup__carousel";

        images.forEach(image => {
            const slide = document.createElement("div");
            slide.className = "map-popup__carousel-slide";
            
            const imgWrap = document.createElement("div");
            imgWrap.className = "map-popup__carousel-image";

            const img = document.createElement("img");
            let imagePath = image.image;
            if (this.path)
                imagePath = this.path + "/" + imagePath;

            img.src = imagePath;
            img.alt = this.data.caption || "";
            img.className = "map-popup__carousel-main-image";

            const finalImage = imageViewer.makeZoomableImage(img, image.caption);

            imgWrap.appendChild(finalImage);
            slide.appendChild(imgWrap);

            carousel.appendChild(slide);
        });

        setTimeout(() => {
            $(carousel).slick({
                dots: false,
                arrows: true,
                infinite: true,
                adaptiveHeight: true
            });
        })

        carouselContainer.appendChild(carousel);

        const fade = document.createElement("div");
        fade.className = "map-popup__image-fade";
        carouselContainer.appendChild(fade);

        return carouselContainer;
    }

    render(): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.className = "map-popup__wrapper";

        const inner = document.createElement("div");
        inner.className = "map-popup__inner";

        if (this.data.images && this.data.images.length > 1) {
            // render a slick carousel of images
            const carousel = this.renderImageCarousel(this.data.images);
            inner.appendChild(carousel);
        } else if (this.data.images && this.data.images.length === 1) {
            // render single image
            const imageItem = this.data.images[0];
            const imageBlock = this.renderSingleImage(imageItem.image, imageItem.caption ?? this.data.caption);
            inner.appendChild(imageBlock);
        } else if (this.data.image) {
            const imageBlock = this.renderSingleImage(this.data.image, this.data.caption);
            inner.appendChild(imageBlock);
        }

        const body = document.createElement("div");
        body.className = "map-popup__body";

        if (this.data.title) {
            const title = document.createElement("h3");
            title.className = "map-popup__title";

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
            body.appendChild(title);

            const rule = document.createElement("hr");
            rule.className = "map-popup__rule";
            body.appendChild(rule);
        }

        if (this.data.exploreButton) {
            const exploreButton = componentRenderer.render(this.data.exploreButton, this.path);
            exploreButton.classList.add("map-popup__explore-button");
            body.appendChild(exploreButton);
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