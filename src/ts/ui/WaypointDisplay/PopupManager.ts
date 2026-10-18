import * as L from "leaflet";

import { PopupWaypoint } from "../../map/waypoints/Waypoint";
import { PopupComponent } from "../components/Popup";
import { iconRegistry } from "../../main";
import { eventBus } from "../../core/EventBus";

/*
The weird popup manager handles the creation and display of the popup when a waypoint is clicked.
This is weird as it has to communicate back to the map to attach itself to the map, as the UI element is dependent on the map element. 
Makes use of the Leaflet popup system. Will be hidden when the user clicks outside of it or presses the Escape key.
*/

export class PopupManager {

    popup: L.Popup | null;

    constructor() {
        this.popup = null;

        document.addEventListener("keydown", (e) => { if (e.key === "Escape") this.hide(); });
    }

    show(waypoint: PopupWaypoint) {
        const popup = new PopupComponent(waypoint.content, waypoint.path);
        const icon = iconRegistry.getById(waypoint.icon ?? waypoint.id);
        const popupAnchor = icon?.popupAnchor ?? [0, 0];

        this.popup = L.popup({
            closeButton: false,
            autoClose: true,
            closeOnClick: true,
            className: "map-popup-custom",
            autoPan: false,
            minWidth: 30,
            maxWidth: 500,
            offset: L.point(popupAnchor)
        })

        this.popup.setLatLng(waypoint.markerCoords ?? waypoint.coords).setContent(popup.render());
        eventBus.emit("popup:show", this.popup);

    }

    hide() {
        if (!this.popup) return;
        eventBus.emit("popup:hide", this.popup);
        this.popup = null;
    }

}