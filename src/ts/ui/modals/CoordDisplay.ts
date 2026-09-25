import '../../../css/ui/coord-display.css';

import { eventBus } from "../../core/EventBus";

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