import * as L from "leaflet";

import { PopupWaypoint } from "../../map/waypoints/Waypoint";
import { PopupComponent } from "../components/Popup";
import { iconRegistry } from "../../map/waypoints/IconRegistry";
import { eventBus } from "../../core/EventBus";

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