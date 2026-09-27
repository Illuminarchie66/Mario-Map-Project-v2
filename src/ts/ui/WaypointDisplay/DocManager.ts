import '../../../css/ui/doc.css';

import { DocWaypoint } from "../../map/waypoints/Waypoint";
import { componentRenderer } from "../ComponentRenderer";

/*
Manages the creation and display of the doc viewer overlay. 
Displays the content of a DocWaypoint when it is clicked, and hides the overlay when the user clicks outside of it or presses the Escape key.
Uses the componentRenderer to render the content of the DocWaypoint.
*/

export class DocManager {
    overlay: HTMLElement;
    content: HTMLElement;
    currentId: string | null = null;

    constructor() {
        const overlay = document.createElement("div");
        overlay.className = "doc-viewer";

        const scroller = document.createElement("div");
        scroller.className = "doc-viewer__scroller";

        const doc = document.createElement("div");
        doc.className = "doc-viewer__doc";

        const close = document.createElement("button");
        close.className = "doc-viewer__close";
        close.innerHTML = "&times;";
        close.addEventListener("click", (e) => {
            e.stopPropagation();
            this.hide();
        });

        this.content = document.createElement("div");
        this.content.className = "doc-viewer__content";

        doc.appendChild(close);
        doc.appendChild(this.content);
        scroller.appendChild(doc);
        overlay.appendChild(scroller);

        overlay.addEventListener("click", () => this.hide());
        scroller.addEventListener("click", e => e.stopPropagation());

        this.overlay = overlay;
        document.body.appendChild(overlay);

        document.addEventListener("keydown", (e) => { if (e.key === "Escape") this.hide(); });
    }

    show(waypoint: DocWaypoint) {
        if (this.currentId === waypoint.id) return;
        this.currentId = waypoint.id;
        this.clear();

        if (waypoint.content.title) {
            const title = document.createElement("h1");
            title.className = "doc-viewer__title";
            title.textContent = waypoint.content.title.toUpperCase();
            this.content.appendChild(title);
        }

        for (const component of waypoint.content.content) {
            const element = componentRenderer.render(component, waypoint.path);
            this.content.appendChild(element);
        }

        this.overlay.classList.add("open");
    }

    hide() {
        this.currentId = null;
        this.overlay.classList.remove("open");
        this.clear();
    }

    clear() {
        this.content.innerHTML = "";
    }

}