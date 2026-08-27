import { Waypoint } from "../../map/Waypoints/Waypoint";
import { PamphletWaypoint } from "../../map/Waypoints/Waypoint";
import { componentRenderer } from "../ComponentRenderer";

export class PamphletManager {

    constructor() {

    }

    show(waypoint: PamphletWaypoint): void {
        const left = waypoint.content.left;
        left.forEach(block => {
            const elem = componentRenderer.render(block, waypoint.path);
            console.log(elem);
        });

    }

}