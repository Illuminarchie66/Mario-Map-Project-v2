import * as L from 'leaflet';
import { MapConfig } from './MapConfig';
import { _Map, LeafletMap } from './Map';
import { MapRegistry } from './MapRegistry';

class MapManager {
    map: _Map | null = null;
    registry: MapRegistry;

    constructor() {
        this.registry = new MapRegistry();
    }

    loadMap({ config, center, zoom }: {
        config: MapConfig;
        center?: [number, number];
        zoom?: number;
    }): void {
        if (this.map) {
            this.reset();
        }
    
        if (config.type === "leaflet") {
            this.map = new LeafletMap({config: config, center: center, zoom: zoom});
        }

    }

    loadMapById({ id, center, zoom }: {
        id: string;
        center?: [number, number];
        zoom?: number;
    }): void {
        this.registry.getById(id)
            .then(config => this.loadMap({config: config, center: center, zoom: zoom}))
            .catch(err => console.error(err));
    }

    reset(): void {
        this.map = null;
    }
}

export { MapManager };