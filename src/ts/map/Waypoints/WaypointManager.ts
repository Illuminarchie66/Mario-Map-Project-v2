import * as L from "leaflet";

import { Waypoint } from "./Waypoint";
import { _Map } from "../maps/Map";
import { LeafletMap } from "../maps/LeafletMap";
import { Loader } from "../../core/Loader";
import { iconRegistry } from "./IconRegistry";
import { eventBus } from "../../core/EventBus";
import { ModelMap } from "../maps/ModelMap";

class WaypointManager {
    waypoints: Waypoint[] = [];
    markers: (L.Marker | L.ImageOverlay)[] = [];

    _wrapHandler: (() => void) | null = null;

    constructor() {
    }

    async loadWaypointsByMap(map: _Map): Promise<void> {
        this.reset();
        const waypointPath = map.config.waypointPath;
        if (!waypointPath) return;

        await this.loadWaypointsByPath(waypointPath);
        if (map instanceof LeafletMap) {
            this.attachToLeafletMap(map);
        } else if (map instanceof ModelMap) {
            this.attachToModelMap(map);
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

    attachToLeafletMap(map: LeafletMap): void {
        this.waypoints.forEach(waypoint => {
            const icon = iconRegistry.getById(waypoint.icon ?? waypoint.id);
            const marker = map.addMarker(waypoint, icon)

            marker.on("click", (event: L.LeafletMouseEvent) => {
                L.DomEvent.stopPropagation(event);
                if (waypoint.displayType === "popup" && marker instanceof L.Marker) {
                    waypoint.markerCoords = [marker.getLatLng().lat, marker.getLatLng().lng];
                }
                this.handleLeafletWaypointClick(waypoint, event);
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

    handleLeafletWaypointClick(waypoint: Waypoint, event: L.LeafletMouseEvent): void {
        eventBus.emit("waypoint:click", waypoint);
        event.originalEvent?.stopPropagation();
    }

    attachToModelMap(map: ModelMap): void {
        map.setupWaypoints();
        this.waypoints.forEach(waypoint => {
            const icon = iconRegistry.getById(waypoint.icon ?? waypoint.id);
            map.addMarker(waypoint, icon);
        })
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