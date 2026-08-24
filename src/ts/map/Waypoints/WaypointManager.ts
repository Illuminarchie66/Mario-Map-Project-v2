import * as L from "leaflet";

import { Waypoint } from "./Waypoint";
import { _Map, LeafletMap } from "../Map";
import { Loader } from "../../core/Loader";
import { IconRegistry } from "./IconRegistry";
import { eventBus } from "../../core/EventBus";

class WaypointManager {
    waypoints: Waypoint[] = [];
    markers: (L.Marker | L.ImageOverlay)[] = [];
    iconRegistry: IconRegistry;

    _wrapHandler: (() => void) | null = null;

    constructor() {
        this.iconRegistry = new IconRegistry();
    }

    async loadWaypointsByMap(map: LeafletMap): Promise<void> {
        this.reset();
        const waypointPath = map.config.waypointPath;

        if (waypointPath) {
            await this.loadWaypointsByPath(waypointPath);
            this.attachToMap(map);
            console.log(this.waypoints);
        }
    }

    async loadWaypointsByPath(path: string): Promise<void> {
        try {
            const data = await Loader.loadData<Waypoint[]>(path);
            this.waypoints = data?.map(item => Waypoint.create(item)) || [];
        } catch (error) {
            this.waypoints = [];
            throw new Error(`Failed to load waypoints from path "${path}": ${error}`);
        }
    }

    attachToMap(map: LeafletMap): void {
        this.waypoints.forEach(waypoint => {
            const icon = this.iconRegistry.getById(waypoint.icon || "default");
            const marker = map.addMarker(waypoint, icon)

            marker.on("click", (e) => {
                L.DomEvent.stopPropagation(e);
                this.handleWaypointClick(waypoint, marker);
            });
            this.markers.push(marker);
        })

        if (map.config.features?.wrapX) {
            this._wrapHandler = () => {
                const centerLng = map.getCenter().lng;

                for (let i = 0; i < this.waypoints.length; i++) {
                    const waypoint = this.waypoints[i];
                    const marker = this.markers[i];

                    const [lat, lng] = waypoint.coords;
                    const offset = Math.round((centerLng - lng) / 256) * 256;
                    if (marker instanceof L.Marker) {
                        marker.setLatLng([lat, lng + offset]);
                    }
                }
            }

            map.on("move", this._wrapHandler);
            this._wrapHandler();
        }
    }

    handleWaypointClick(waypoint: Waypoint, marker: L.Marker | L.ImageOverlay): void {
        console.log(`Waypoint clicked: ${waypoint.id}`);
        eventBus.emit("waypoint:click", waypoint);
    }

    reset(): void {
        this.waypoints = [];
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
        if (this._wrapHandler) {
            this._wrapHandler = null;
        }
    }

}

export { WaypointManager, Waypoint }