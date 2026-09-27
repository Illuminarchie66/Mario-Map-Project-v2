import { eventBus } from "../../core/EventBus";
import { Waypoint } from "../../map/waypoints/Waypoint";
import { DocManager } from "./DocManager";
import { PamphletManager } from "./PamphletManager";
import { PopupManager } from "./PopupManager";
import { PamphletWaypoint, DocWaypoint, PopupWaypoint } from "../../map/waypoints/Waypoint";

/*
This class manages the display of waypoints, using the appropriate manager based on the waypoint's display type.
It handles the showing and hiding of waypoints, as well as the communication between the different managers and the event bus.
If we introduce new waypoint types in the future we will add new managers for them and add them to this class.
*/

export class WaypointDisplayManager {
    pamphletManager: PamphletManager;
    docManager: DocManager;
    popupManager: PopupManager;

    constructor() {
        this.pamphletManager = new PamphletManager();
        this.docManager = new DocManager();
        this.popupManager = new PopupManager();

        eventBus.on("waypoint:click", (waypoint) => {
            this.hideAll();
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