import '../../../css/ui/coord-display.css';

import { eventBus } from "../../core/EventBus";

/*
A simple component that displays the current coordinates of the mouse on the map, as well as the current zoom level.
Works dependent on the map emitting "map:mousemove" and "map:zoom" events with the appropriate data.
Is optional and will be hidden by default, turned on via debug mode in settings.
*/

export class CoordDisplay {
    modal: HTMLDivElement;
    lat: number;
    lng: number
    zoom: number;

    constructor() {
        this.modal = document.createElement("div");
        this.modal.className = "coord-display";
        this.modal.textContent = "zoom: -,  (-, -)";

        document.body.appendChild(this.modal);

        this.lat = 0;
        this.lng = 0;
        this.zoom = 0;

        eventBus.on("map:mousemove", ({lat, lng}: {lat: number, lng: number}) => {
            this.lat = lat;
            this.lng = lng;
            this.updateDisplay();
        });

        eventBus.on("map:zoom", ({zoom}: {zoom: number}) => {
            this.zoom = zoom;
            this.updateDisplay();
        });

        // Add a click event listener to the window to copy the coordinates to the clipboard when clicked
        // Turned off for now, as it was causing issues with other click events on the page. Can be re-enabled if needed.
        // window.addEventListener("pointerdown", (event) => {
        //     if (event.target instanceof HTMLElement) {
        //         navigator.clipboard.writeText(`[${this.lat.toFixed(0)}, ${this.lng.toFixed(0)}]`).then(() => {
        //             console.log("Coordinates copied to clipboard.");
        //         }).catch((err) => {
        //             console.error("Failed to copy coordinates: ", err);
        //         });
        //     }
        // });
    }

    show() {
        this.modal.classList.add("open");
    }

    hide() {
        this.modal.classList.remove("open");
    }

    updateDisplay() {
        this.modal.textContent = `zoom: ${this.zoom.toFixed(2)}, (${this.lat.toFixed(2)}, ${this.lng.toFixed(2)})`;
    }

}