import * as L from "leaflet";

import { _Map, LeafletMap } from "../Map";
import { Loader } from "../../core/Loader";
import { IconRegistry } from "./IconRegistry";

class Waypoint {
    id: string;
    coords: [number, number];
    
    assetPath?: string;
    label?: string;
    icon?: string;
    
    constructor(data: Waypoint) {
        this.id = data.id;
        this.coords = data.coords;
        this.assetPath = data.assetPath;
        this.label = data.label;
        this.icon = data.icon;
    }

    static create(data: any): Waypoint {
        return new Waypoint(data);
    }
}

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
                console.log(`Waypoint clicked: ${waypoint.id}`);
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