import '../../../css/ui/components/carousel.css';

import { z } from "zod";
import { Component } from "./Component";
import { imageViewer } from "../ImageViewer";

import $ from 'jquery';
import 'slick-carousel';
import { getPortableURL } from '../../core/portableURL';

export const CarouselBlockSchema = z.object({
    type: z.literal("carousel"),
    title: z.string().optional(),
    titleColor: z.string().optional(),
    alignTitle: z.string().optional(),
    images: z.array(z.object({
        image: z.string(),
        caption: z.string().optional(),
        alignCaption: z.string().optional(),
        zoomable: z.boolean().optional(),
    }))
});

export type CarouselBlock = z.infer<typeof CarouselBlockSchema>;

export class CarouselComponent extends Component<CarouselBlock> {
    constructor(data: CarouselBlock, path?: string) {
        super(data, path);
    }

    render(): HTMLElement {
        const container = document.createElement("div");
        container.className = "c-carousel__container";

        if (this.data.title) {
            const title = document.createElement("h2");
            title.className = `
                c-carousel__title 
                c-carousel__title--${this.data.alignTitle || "left"}
            `;

            if (this.data.titleColor) 
                title.style.color = this.data.titleColor;

            title.textContent = this.data.title;
            container.appendChild(title);
        }
        
        const carousel = document.createElement("div");
        carousel.className = "c-carousel";

        this.data.images.forEach(imgData => {
            const slide = document.createElement("div");
            slide.className = "c-carousel__slide";

            const imgWrap = document.createElement("div");
            imgWrap.className = "c-carousel__image";

            const img = document.createElement("img");
            let imagePath = imgData.image;
            if (this.path)
                imagePath = this.path + "/" + imagePath;

            img.src = getPortableURL(imagePath);
            img.alt = imgData.caption || "";
            img.className = "c-carousel__main-image";

            const finalImage = (imgData.zoomable !== false)
                ? imageViewer.makeZoomableImage(img, imgData.caption)
                : img;

            imgWrap.appendChild(finalImage);
            slide.appendChild(imgWrap);

            if (imgData.caption) {
                const cap = document.createElement("div");
                cap.className = `
                    c-carousel__caption 
                    c-carousel__caption--${imgData.alignCaption || "right"}
                `;
                cap.textContent = imgData.caption;
                slide.appendChild(cap);
            }

            carousel.appendChild(slide);
        });

        setTimeout(() => {
            $(carousel).slick({
                dots: true,
                arrows: true,
                infinite: true,
                adaptiveHeight: true
            });
        });

        container.appendChild(carousel);

        return container;
    }
}