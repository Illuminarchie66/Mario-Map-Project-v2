import '../../../css/ui/pamphlet.css';

import { Waypoint } from "../../map/Waypoints/Waypoint";
import { PamphletWaypoint } from "../../map/Waypoints/Waypoint";
import { componentRenderer } from "../ComponentRenderer";

export class PamphletManager {
    left: HTMLElement = document.getElementById("leftPanel")!;
    right: HTMLElement = document.getElementById("rightPanel")!;
    currentId: string | null = null;

    constructor() {
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") this.hide(); });
    }

    show(waypoint: PamphletWaypoint): void {
        if (this.currentId === waypoint.id) return;
        this.currentId = waypoint.id;
        this.clear();

        const path = waypoint.path;

        for (const component of waypoint.content.left) {
            const element = componentRenderer.render(component, path);
            this.left.appendChild(element);
        }

        const closeButton = this.createCloseButton();
        this.right.appendChild(closeButton);

        for (const component of waypoint.content.right) {
            const element = componentRenderer.render(component, path);
            this.right.appendChild(element);
        }

        this.left.classList.add("open");
        this.right.classList.add("open");
    }

    hide(): void {
        this.currentId = null;
        this.left.classList.remove("open");
        this.right.classList.remove("open");
        this.clear();
    }

    clear(): void {
        this.left.innerHTML = "";
        this.right.innerHTML = "";
    }

    createCloseButton(): HTMLElement {
        const btn = document.createElement("button");
        btn.className = "panel__close";
        btn.innerHTML = "&times;";

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.hide();
        });

        return btn;
    }

}