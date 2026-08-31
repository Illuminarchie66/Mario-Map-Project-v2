import * as L from 'leaflet';
import { MapConfig } from './MapConfig';
import { _Map, LeafletMap, createMap } from './Map';
import { mapRegistry } from './MapRegistry';
import { WaypointManager } from './Waypoints/WaypointManager';
import { eventBus } from '../core/EventBus';
import { MapView } from './Map';

class MapManager {
    map: _Map | null = null;
    waypointManager: WaypointManager;

    constructor(initialMapId?: string) {
        this.waypointManager = new WaypointManager();

        eventBus.on("map:load", (payload) => {
            const { id, view } = payload;
            this.loadMapById({ id, view }).catch(error => {
                console.error(`Failed to load map: "${id}": `, error);
            });
        });

        if (initialMapId) {
            this.loadMapById({ id: initialMapId }).catch(error => {
                console.error(`Failed to load initial map: "${initialMapId}": `, error);
            });
        }
    }

    async loadMap({ config, view }: {
        config: MapConfig;
        view?: MapView;
    }): Promise<void> {
        if (this.map?.config.id === config.id) return;

        if (this.map) {
            this.reset();
        }
    
        if (config.type === "tiles" || config.type === "image" || config.type === "plan") {
            this.map = createMap(config, view);
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

    async loadMapById({ id, view }: {
        id: string;
        view?: MapView;
    }): Promise<void> {
        const config = await mapRegistry.getById(id);
        await this.loadMap({config: config, view: view});
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