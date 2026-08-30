import * as L from 'leaflet';
import { MapConfig } from './MapConfig';
import { _Map, LeafletMap } from './Map';
import { mapRegistry } from './MapRegistry';
import { WaypointManager } from './Waypoints/WaypointManager';
import { eventBus } from '../core/EventBus';

class MapManager {
    map: _Map | null = null;
    waypointManager: WaypointManager;

    constructor(initialMapId?: string) {
        this.waypointManager = new WaypointManager();

        eventBus.on("map:load", (payload) => {
            const { id, center, zoom } = payload;
            this.loadMapById({ id, center, zoom }).catch(error => {
                console.error(`Failed to load map: "${id}": `, error);
            });
        });

        if (initialMapId) {
            this.loadMapById({ id: initialMapId }).catch(error => {
                console.error(`Failed to load initial map: "${initialMapId}": `, error);
            });
        }
    }

    async loadMap({ config, center, zoom }: {
        config: MapConfig;
        center?: [number, number];
        zoom?: number;
    }): Promise<void> {
        if (this.map?.config.id === config.id) return;

        if (this.map) {
            this.reset();
        }
    
        if (config.type === "tiles" || config.type === "image") {
            this.map = new LeafletMap({config: config, center: center, zoom: zoom});
        } else if (config.type === "model") {
            // not implemented
            // will use three.js
            throw new Error("Model maps are not yet supported.");
        }

        await this.waypointManager.loadWaypointsByMap(this.map as LeafletMap);

        if (this.map instanceof LeafletMap) {
            this.map.on("mousemove", (e: L.LeafletMouseEvent) => {
                eventBus.emit("map:mousemove", {
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                });
            });

            const map = this.map;
            map.on("zoomend", () => {
                eventBus.emit("map:zoom", {
                    zoom: map.getZoom(),
                });
            });

            eventBus.emit("map:zoom", {
                zoom: map.getZoom(),
            });
        }
        
    }

    async loadMapById({ id, center, zoom }: {
        id: string;
        center?: [number, number];
        zoom?: number;
    }): Promise<void> {
        const config = await mapRegistry.getById(id)
        await this.loadMap({config: config, center: center, zoom: zoom})
    }

    reset(): void {
        if (this.map instanceof LeafletMap) {
            this.map.destroy();
        }

        this.map = null;
        this.waypointManager.reset();
    }
}

export { MapManager };