import { MapConfig } from "../MapConfig";

export type MapView = { center?: [number, number]; zoom?: number };

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

