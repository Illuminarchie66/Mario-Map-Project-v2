import { MapConfig } from "../MapConfig";

export type MapView = { center?: [number, number]; zoom?: number };

/*
The base abstract class for all map types. Provides a common interface for initializing, destroying, and getting the zoom and center of the map.
Also grants access to the container element and the map configuration. All specific map types (TileMap, ImageMap, PlanMap, ModelMap) extend this class.
*/
export abstract class _Map<TConfig extends MapConfig = MapConfig> {
    containerId: string = "mapContainer";
    config: TConfig;
    mapContainer: HTMLElement;

    constructor(config: TConfig) {
        this.config = config;
        this.mapContainer = document.getElementById(this.containerId)! as HTMLElement;
    }

    async init(): Promise<void> {
        return Promise.resolve();
    }

    abstract getZoom(): number 
    abstract getCenter(): { lat: number, lng: number }
    abstract destroy(): void
}

