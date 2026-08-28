import { eventBus } from "../../core/EventBus";
import { Waypoint } from "../../map/Waypoints/Waypoint";
import { DocManager } from "./DocManager";
import { PamphletManager } from "./PamphletManager";
import { PopupManager } from "./PopupManager";
import { PamphletWaypoint, DocWaypoint, PopupWaypoint } from "../../map/Waypoints/Waypoint";

export class WaypointDisplayManager {
    pamphletManager: PamphletManager;
    docManager: DocManager;
    popupManager: PopupManager;

    constructor() {
        this.pamphletManager = new PamphletManager();
        this.docManager = new DocManager();
        this.popupManager = new PopupManager();

        eventBus.on("waypoint:click", (waypoint) => {
            this.displayWaypoint(waypoint);
        });

        eventBus.on("map:click", () => {
            this.hideAll();
        });
    }

    displayWaypoint(waypoint: Waypoint): void {
        switch (waypoint.displayType) {
            case "pamphlet":
                this.pamphletManager.show(waypoint as PamphletWaypoint);
                break;
            case "doc":
                this.docManager.show(waypoint as DocWaypoint);
                break;
            case "popup":
                this.popupManager.show(waypoint as PopupWaypoint);
                break;
        }
    }

    hideAll(): void {
        this.pamphletManager.hide();
        this.popupManager.hide();
        this.docManager.hide();
    }
}