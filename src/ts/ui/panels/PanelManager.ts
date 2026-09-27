import '../../../css/ui/panels/ui.css'
import { Panel } from "./Panel";
import { MapSelectorPanel } from "./MapSelector";
import { TogglesPanel } from "./Toggles";
import { SettingsPanel } from "./Settings";
import { AttributionPanel } from "./Attribution";
import { eventBus } from "../../core/EventBus";

/*
This class manages all of the panels, with a map of panel names to panel instances. 
It handles showing and hiding panels, as well as resizing them based on the window size and user input. 
It also handles the resizing of the panels when the user drags with the width control. Width control is horizontal for mobile (and really is height control but you know, naming).
We need to update the initial width to be dependent on the window size.
*/

export class PanelManager {
    private panels: Map<string, Panel> = new Map();
    panelsContainer: HTMLElement;
    currentPanel: Panel | null = null;

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
        this.panelsContainer = document.createElement("div");
        this.panelsContainer.id = "panels-container";
        document.body.appendChild(this.panelsContainer);

        this.panels.set("map-selector", new MapSelectorPanel(this.panelsContainer));
        this.panels.set("toggles", new TogglesPanel(this.panelsContainer));
        this.panels.set("settings", new SettingsPanel(this.panelsContainer));
        this.panels.set("attribution", new AttributionPanel(this.panelsContainer));

        eventBus.on("map:loaded", (payload) => {
            this.panels.forEach((panel) => {
                panel.updateContent(payload.map);
            });
        });

        eventBus.on("map:click", () => {
            this.hideCurrentPanel();
        });

        eventBus.on("waypoint:click", (wp) => {
            if (wp.displayType === "pamphlet") {
                this.hideCurrentPanel();
            }
        })

        document.addEventListener("keydown", (e) => { 
            if (e.key === "Escape") this.hideCurrentPanel(); 
            if (e.key === "n" || e.key === "N") this.showPanel("map-selector");
        });

        this.widthControl = document.createElement("div");
        this.widthControl.className = "panel__width-control";
        const widthControlDisplay = document.createElement("div");
        widthControlDisplay.className = "panel__width-control-display";
        this.widthControl.appendChild(widthControlDisplay);

        this.widthControl.addEventListener("pointerdown", (e: PointerEvent) => {
            if (!this.currentPanel) return;
            e.preventDefault();
            e.stopPropagation();
            this.isDragging = true;
            this.initialWidth = this.currentPanel.panel.offsetWidth;
            this.initialHeight = this.currentPanel.panel.offsetHeight;
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
            if (this.isDragging && this.currentPanel) {
                e.preventDefault();
                if (window.innerWidth < 768) {
                    const newHeight = (this.initialHeight - e.clientY + this.initialMouseY)
                    const percentageHeight = Math.min(80, (newHeight / window.innerHeight) * 100);
                    
                    if (percentageHeight < 20) {
                        this.panelHeight = 20;
                        this.currentPanel.panel.style.height = "20vh";
                        this.hideCurrentPanel();
                    } else {
                        this.panelHeight = percentageHeight;
                        this.currentPanel.panel.style.height = percentageHeight + "vh";
                    }
                    
                } else {
                    const newWidth = Math.max(400, Math.min(this.initialWidth + e.clientX - this.initialMouseX, 700));
                    this.panelWidth = newWidth;
                    this.currentPanel.panel.style.width = newWidth + "px";
                }
            }
        }, { passive: false });

        window.addEventListener("resize", () => {
            if (window.innerWidth < 768 && this.previousWindowWidth >= 768) {
                this.hideCurrentPanel();
            } else if (window.innerWidth >= 768 && this.previousWindowWidth < 768) {
                this.hideCurrentPanel();
            }

            this.previousWindowWidth = window.innerWidth;
        });
    }

    showPanel(name: string) {
        const panel = this.panels.get(name);
        if (!panel) throw new Error(`Panel with name "${name}" does not exist.`);

        if (this.currentPanel?.panelName === name) {
            return;
        }

        if (this.currentPanel) {
            this.currentPanel.hide();
        }

        panel.show();
        this.currentPanel = panel;
        this.currentPanel.panel.appendChild(this.widthControl);

        if (window.innerWidth < 768) {
            this.currentPanel.panel.style.width = "100%";
            this.currentPanel.panel.style.height = this.panelHeight + "vh";
        } else {
            this.currentPanel.panel.style.width = this.panelWidth + "px";
            this.currentPanel.panel.style.height = "100%";
        }
    }

    hideCurrentPanel() {
        if (this.currentPanel) {
            this.currentPanel.hide();
            this.currentPanel.panel.removeChild(this.widthControl);
            this.currentPanel = null;
        }
    }
}