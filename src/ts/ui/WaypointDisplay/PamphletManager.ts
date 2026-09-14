import '../../../css/ui/pamphlet.css';

import { PamphletWaypoint } from "../../map/waypoints/Waypoint";
import { componentRenderer } from "../ComponentRenderer";
import { eventBus } from "../../core/EventBus";

export class PamphletManager {
    left: HTMLElement;
    leftContent: HTMLElement;
    right: HTMLElement;
    rightContent: HTMLElement;
    currentId: string | null = null;
    currentWaypoint: PamphletWaypoint | null = null;
    previousWindowWidth: number = window.innerWidth;

    constructor() {
        this.left = document.createElement("div");
        this.left.id = "leftPanel";
        this.left.className = "panel left";
        this.leftContent = document.createElement("div");
        this.leftContent.className = "panel__content";
        this.left.appendChild(this.leftContent);

        this.right = document.createElement("div");
        this.right.id = "rightPanel";
        this.right.className = "panel right";
        this.rightContent = document.createElement("div");
        this.rightContent.className = "panel__content";
        this.right.appendChild(this.rightContent);

        document.body.appendChild(this.left);
        document.body.appendChild(this.right);

        document.addEventListener("keydown", (e) => { if (e.key === "Escape") this.hide(); });

        window.addEventListener("resize", () => {
            if ((window.innerWidth < 1440 && this.previousWindowWidth >= 1440) ||
                (window.innerWidth >= 1440 && this.previousWindowWidth < 1440)) {
                    if (this.currentWaypoint) {
                        this.hide();
                    }
            }
            this.previousWindowWidth = window.innerWidth;
        });
    }

    show(waypoint: PamphletWaypoint, _bypass: boolean = false): void {
        if (this.currentId === waypoint.id && !_bypass) return;
        console.log("Showing pamphlet for waypoint:", waypoint.id, "with content:", waypoint.content);
        this.currentId = waypoint.id;
        this.currentWaypoint = waypoint;
        this.clear();

        const path = waypoint.path;

        for (const component of waypoint.content.left) {
            const element = componentRenderer.render(component, path);
            this.leftContent.appendChild(element);
        }

        if (window.innerWidth < 1440) {
            for (const component of waypoint.content.right) {
                const element = componentRenderer.render(component, path);
                this.leftContent.appendChild(element);
            }

            this.left.classList.add("open");
        } else {
            const closeButton = this.createCloseButton();
            this.right.appendChild(closeButton);

            for (const component of waypoint.content.right) {
                const element = componentRenderer.render(component, path);
                this.rightContent.appendChild(element);
            }

            this.left.classList.add("open");
            this.right.classList.add("open");
        }

    }

    hide(): void {
        this.currentId = null;
        this.currentWaypoint = null;
        this.left.classList.remove("open");
        this.right.classList.remove("open");
        this.clear();
    }

    clear(): void {
        this.leftContent.innerHTML = "";
        this.rightContent.innerHTML = "";
    }

    createCloseButton(): HTMLElement {
        const btn = document.createElement("button");
        btn.className = "panel__close";
        btn.innerHTML = "&times;";

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.hide();
            eventBus.emit("waypoint:close", {});
        });

        return btn;
    }

}