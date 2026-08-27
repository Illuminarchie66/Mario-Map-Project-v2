import { eventBus } from "../../core/EventBus";
import { Waypoint } from "../../map/Waypoints/Waypoint";
import { DocManager } from "./DocManager";
import { PamphletManager } from "./PamphletManager";
import { PopupManager } from "./PopupManager";

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
    }

    displayWaypoint(waypoint: Waypoint): void {
        switch (waypoint.displayType) {
            case "pamphlet":
                this.pamphletManager.show(waypoint);
            case "doc":
                this.docManager.show(waypoint);
            case "popup":
                this.popupManager.show(waypoint);
        }
    }
}