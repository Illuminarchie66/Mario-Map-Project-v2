import { Panel } from './Panel';

/*
This class is the toggle panel, which will contain various toggles for different maps.
Right now is empty.
It will include:
- Waypoint visibility toggles (which waypoints to show/hide)
- Waypoint path toggles (paths of routes between waypoints)
- Overlay toggles (different map overlays like grids, distance markers, sepia style, political borders, etc.)
- Text map toggles (adds text to the map, like names of locations, cities, etc.)
*/

export class TogglesPanel extends Panel {
    mapsContainer!: HTMLElement;
    
    constructor(panelContainer: HTMLElement) {
        super("toggles", panelContainer);
        this.addContent();
    }

    addContent(): void {
        const titleElement = this.createTitle("Toggles");
        this.panel.appendChild(titleElement);
    }
    updateContent(): void {}
}