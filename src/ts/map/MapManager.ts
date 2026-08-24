import * as L from 'leaflet';
import { MapConfig } from './MapConfig';
import { _Map, LeafletMap } from './Map';
import { MapRegistry } from './MapRegistry';
import { WaypointManager } from './Waypoints/WaypointManager';

class MapManager {
    map: _Map | null = null;
    mapRegistry: MapRegistry;
    waypointManager: WaypointManager;

    constructor() {
        this.mapRegistry = new MapRegistry();
        this.waypointManager = new WaypointManager();
    }

    async loadMap({ config, center, zoom }: {
        config: MapConfig;
        center?: [number, number];
        zoom?: number;
    }): Promise<void> {
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
    }

    async loadMapById({ id, center, zoom }: {
        id: string;
        center?: [number, number];
        zoom?: number;
    }): Promise<void> {
        await this.mapRegistry.getById(id)
            .then(config => this.loadMap({config: config, center: center, zoom: zoom}))
            .catch(error => console.error(error));
    }

    reset(): void {
        this.map = null;
        this.waypointManager.reset();
    }
}

export { MapManager };