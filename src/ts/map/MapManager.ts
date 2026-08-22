import * as L from 'leaflet';
import { MapConfig } from './MapConfig';
import { _Map, LeafletMap } from './Map';

class MapManager {
    map: _Map | null = null;

    constructor() {
        
    }

    loadMap(config: MapConfig, center?: [number, number], zoom?: number): void {
        if (this.map) {
            this.reset();
        }
    
        if (config.type === "leaflet") {
            this.map = new LeafletMap(config, center, zoom);
        }

    }

    reset(): void {

    }
}

export { MapManager };