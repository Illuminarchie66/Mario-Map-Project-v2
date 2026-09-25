import '../../../css/ui/panels/pamphlet.css';

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

    widthControl!: HTMLElement;
    isDragging: boolean = false;
    initialWidth: number = 0;
    initialHeight: number = 0;
    initialMouseX: number = 0;
    initialMouseY: number = 0;

    previousWindowWidth: number = window.innerWidth;

    panelHeight: number = 60; //in vh
    panelWidth: number = 600; //in px

    constructor() {
        this.left = document.createElement("div");
        this.left.id = "leftPanel";
        this.left.className = "panel pamphlet left";
        this.leftContent = document.createElement("div");
        this.leftContent.className = "panel__content";
        this.left.appendChild(this.leftContent);

        this.right = document.createElement("div");
        this.right.id = "rightPanel";
        this.right.className = "panel pamphlet right";
        this.rightContent = document.createElement("div");
        this.rightContent.className = "panel__content";
        this.right.appendChild(this.rightContent);

        document.body.appendChild(this.left);
        document.body.appendChild(this.right);

        document.addEventListener("keydown", (e) => { if (e.key === "Escape") this.hide(); });

        this.widthControl = document.createElement("div");
        this.widthControl.className = "panel__width-control";
        const widthControlDisplay = document.createElement("div");
        widthControlDisplay.className = "panel__width-control-display";
        this.widthControl.appendChild(widthControlDisplay);

        this.widthControl.addEventListener("pointerdown", (e: PointerEvent) => {
            if (!this.currentWaypoint) return;
            e.preventDefault();
            e.stopPropagation();
            this.isDragging = true;
            this.initialWidth = this.left.offsetWidth;
            this.initialHeight = this.left.offsetHeight;
            this.initialMouseX = e.clientX;
            this.initialMouseY = e.clientY;
            this.widthControl.setPointerCapture(e.pointerId);
        });

        document.addEventListener("pointerup", (e: PointerEvent) => {
            this.isDragging = false;
            if (this.widthControl.hasPointerCapture(e.pointerId)) {
                this.widthControl.releasePointerCapture(e.pointerId);
            }
        });

        document.addEventListener("pointercancel", () => {
            this.isDragging = false;
        });

        document.addEventListener("pointermove", (e: PointerEvent) => {
            if (this.isDragging && this.currentWaypoint) {
                e.preventDefault();
                if (window.innerWidth < 768) {
                    const newHeight = (this.initialHeight - e.clientY + this.initialMouseY)
                    const percentageHeight = Math.min(80, (newHeight / window.innerHeight) * 100);
                    
                    if (percentageHeight < 20) {
                        this.panelHeight = 20;
                        this.left.style.height = "20vh";
                        this.hide();
                    } else {
                        this.panelHeight = percentageHeight;
                        this.left.style.height = percentageHeight + "vh";
                    }
                    
                } else {
                    const newWidth = Math.max(400, Math.min(this.initialWidth + e.clientX - this.initialMouseX, 700));
                    this.panelWidth = newWidth;
                    this.left.style.width = newWidth + "px";
                    this.right.style.width = newWidth + "px";
                }
            }
        }, { passive: false });

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
            if (waypoint.content.right.length > 0) {
                const closeButton = this.createCloseButton();
                this.right.appendChild(closeButton);

                for (const component of waypoint.content.right) {
                    const element = componentRenderer.render(component, path);
                    this.rightContent.appendChild(element);
                }

                this.left.classList.add("open");
                this.right.classList.add("open");
            } else {
                this.left.classList.add("open");
            }
        }

        this.left.appendChild(this.widthControl);

        if (window.innerWidth < 768) {
            this.left.style.width = "100%";
            this.left.style.height = this.panelHeight + "vh";
        } else {
            this.left.style.width = this.panelWidth + "px";
            this.right.style.width = this.panelWidth + "px";
            this.left.style.height = "100%";
        }

    }

    hide(): void {
        this.currentId = null;
        this.currentWaypoint = null;
        this.left.classList.remove("open");
        this.right.classList.remove("open");
        this.clear();
        if (this.left.contains(this.widthControl))
            this.left.removeChild(this.widthControl);
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