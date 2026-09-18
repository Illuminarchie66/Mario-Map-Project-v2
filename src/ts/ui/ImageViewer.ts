import '../../css/ui/image-viewer.css';
import { getPortableURL } from '../core/portableURL';

class ImageViewer {
    overlay: HTMLDivElement;
    img: HTMLImageElement
    caption: HTMLDivElement;

    constructor() {
        this.overlay = document.createElement("div");
        this.overlay.className = "image-viewer";

        this.img = document.createElement("img");
        this.img.className = "image-viewer__img";

        this.caption = document.createElement("div");
        this.caption.className = "image-viewer__caption";

        const wrapper = document.createElement("div");
        wrapper.className = "image-viewer__content";

        wrapper.appendChild(this.img);
        wrapper.appendChild(this.caption);

        this.overlay.appendChild(wrapper);
        document.body.appendChild(this.overlay);

        this.overlay.addEventListener("click", () => this.hide());
    }

    makeZoomableImage(img: HTMLImageElement, caption?: string) {
        const wrapper = document.createElement("div");
        wrapper.className = "image-zoom";

        const button = document.createElement("button");
        button.className = "image-zoom__btn";

        const icon = document.createElement("img");
        icon.src = getPortableURL("/assets/icons/mag_glass.svg");
        icon.alt = "Zoom";
        icon.className = "image-zoom__icon";
        button.appendChild(icon);

        button.addEventListener("click", (e) => {
            e.stopPropagation();
            this.show(img.src, caption);
        });

        wrapper.appendChild(img);
        wrapper.appendChild(button);

        return wrapper;
    }

    show(src: string, caption?: string) {
        this.img.src = getPortableURL(src);
        if (caption) {
            this.caption.textContent = caption;
            this.caption.style.display = "block";
        } else {
            this.caption.style.display = "none";
        }

        this.overlay.classList.add("open");
    }

    hide() {
        this.overlay.classList.remove("open");   
    }
}

export const imageViewer = new ImageViewer();