import * as L from 'leaflet';

interface MapOptions { 
    crs?: string;
    minZoom?: number;
    maxZoom?: number;
    zoom?: number;
    center?: [number, number];
    zoomDelta?: number;
    zoomSnap?: number;
    attributionControl?: boolean;
}

interface MapFeatures {
    backgroundColor?: string;
    usesTiles?: boolean;
    wrapX?: boolean;
    wrapY?: boolean;
}

class MapConfig {
    id: string;
    type: string;
    options: MapOptions;
    features: MapFeatures;

    waypointPath?: string;
    bounds?: [number, number][];

    constructor(data: MapConfig) {
        this.id = data.id;
        this.type = data.type;
        this.options = data.options;
        this.features = data.features;
        this.waypointPath = data.waypointPath;
        this.bounds = data.bounds;
    }

    static create(data: any): MapConfig {
        if (data.tilePath) return new TileMapConfig(data);
        if (data.imagePath) return new ImageMapConfig(data);
        return new MapConfig(data);
    }

    get leafletOptions(): L.MapOptions {
        const crs = this.options.crs === "simple" ? L.CRS.Simple : L.CRS.EPSG3857;
        
        return {
            crs: crs,
            minZoom: this.options.minZoom,
            maxZoom: this.options.maxZoom,
            zoom: this.options.zoom,
            center: this.options.center ? L.latLng(this.options.center[0], this.options.center[1]) : undefined,
            zoomDelta: this.options.zoomDelta,
            zoomSnap: this.options.zoomSnap,
            attributionControl: this.options.attributionControl
        };
    }
}

class TileMapConfig extends MapConfig {
    tilePath: string;
    tileFileType?: string;

    constructor(data: TileMapConfig) {
        super(data);
        this.tilePath = data.tilePath;
        this.tileFileType = data.tileFileType;
    }
}

class ImageMapConfig extends MapConfig {
    imagePath: string;
    width?: number;
    height?: number;

    constructor(data: ImageMapConfig) {
        super(data);
        this.imagePath = data.imagePath;
        this.width = data.width;
        this.height = data.height;
    }
}

export { MapConfig, TileMapConfig, ImageMapConfig };