import { PopupWaypoint } from "../../map/Waypoints/Waypoint";
import { PopupComponent } from "../components/Popup";

export class PopupManager {

    constructor() {

    }

    show(waypoint: PopupWaypoint) {
        const popup = new PopupComponent(waypoint.content, waypoint.path);
        const element = popup.render();
    }

}