import * as L from 'leaflet';
import z from 'zod';

const MapTypeSchema = z.enum([
    "tiles", // leaflet tile layer maps
    "image", // leaflet single image maps
    "plan", // leaflet maps with multiple images and layers
    "model" // 3D model maps using three.js
]);
type MapType = z.infer<typeof MapTypeSchema>;

const MapFeaturesSchema = z.object({
    backgroundColor: z.string().optional(),
    wrapX: z.boolean().optional(),
    wrapY: z.boolean().optional()
});
type MapFeatures = z.infer<typeof MapFeaturesSchema>;

const MapAttributionSchema = z.object({
    creator: z.string().optional(),
    source: z.string().optional(),
    links: z.array(z.string()).optional(),
    license: z.string().optional()
});
type MapAttribution = z.infer<typeof MapAttributionSchema>;

const BaseMapConfigSchema = z.object({
    id: z.string(),
    type: MapTypeSchema,
    features: MapFeaturesSchema,
    label: z.string().optional(),
    attribution: MapAttributionSchema.optional(),
    waypointPath: z.string().optional(),
    mapPreview: z.string().optional()
});
type BaseMapConfig = z.infer<typeof BaseMapConfigSchema>;

const MapOptionsSchema = z.object({
    zoom: z.number(),
    center: z.tuple([z.number(), z.number()]),
    crs: z.string().optional(),
    minZoom: z.number().optional(),
    maxZoom: z.number().optional(),
    zoomDelta: z.number().optional(),
    zoomSnap: z.number().optional(),
    attributionControl: z.boolean().optional()
});
type MapOptions = z.infer<typeof MapOptionsSchema>;

const LeafletMapOptionsSchema = BaseMapConfigSchema.extend({
    options: MapOptionsSchema,
});
type LeafletMapConfigData = z.infer<typeof LeafletMapOptionsSchema>;

const TileMapConfigSchema = LeafletMapOptionsSchema.extend({
    type: z.literal("tiles"),
    tilePath: z.string(),
    tileFileType: z.string().optional(),
    bounds: z.array(z.tuple([z.number(), z.number()])),
});
type TileMapConfigData = z.infer<typeof TileMapConfigSchema>;

const ImageMapConfigSchema = LeafletMapOptionsSchema.extend({
    type: z.literal("image"),
    imagePath: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    bounds: z.array(z.tuple([z.number(), z.number()])).optional(),
});
type ImageMapConfigData = z.infer<typeof ImageMapConfigSchema>;

const PlanMapConfigSchema = LeafletMapOptionsSchema.extend({
    type: z.literal("plan"),
    width: z.number().optional(),
    height: z.number().optional(),
    plans: z.array(z.object({
        imagePath: z.string(),
        label: z.string().optional(),
    }))
});
type PlanMapConfigData = z.infer<typeof PlanMapConfigSchema>;

const ModelMapConfigSchema = BaseMapConfigSchema.extend({
    type: z.literal("model"),
    modelPath: z.string(),
});
type ModelMapConfigData = z.infer<typeof ModelMapConfigSchema>;

const MapConfigSchema = z.discriminatedUnion("type", [
    TileMapConfigSchema,
    ImageMapConfigSchema,
    PlanMapConfigSchema,
    ModelMapConfigSchema
]);
type MapConfigData = z.infer<typeof MapConfigSchema>;

abstract class MapConfig {
    id: string;
    type: MapType;
    features: MapFeatures;

    label?: string;
    attribution?: MapAttribution;
    waypointPath?: string;
    mapPreview?: string;

    protected constructor(data: BaseMapConfig) {
        this.id = data.id;
        this.type = data.type;
        this.features = data.features;

        this.label = data.label;
        this.attribution = data.attribution;
        this.waypointPath = data.waypointPath;
        this.mapPreview = data.mapPreview;
    }

    static create(data: unknown): MapConfig {
        const res = MapConfigSchema.safeParse(data);
        if (!res.success) {
            throw new Error(`Invalid map config data: ${res.error.message}`);
        }

        switch (res.data.type) {
            case "tiles":
                return new TileMapConfig(res.data);
            case "image":
                return new ImageMapConfig(res.data);
            case "plan":
                return new PlanMapConfig(res.data);
            case "model":
                return new ModelMapConfig(res.data);
            default:
                throw new Error(`Unsupported map type: ${res.data}`);
        }
    }

}

abstract class LeafletMapConfig extends MapConfig {
    options: MapOptions;
    bounds?: [number, number][];

    protected constructor(data: LeafletMapConfigData) {
        super(data);
        this.options = data.options;
    }

    get leafletOptions(): L.MapOptions {
        if (!this.options) return {};

        let crs: L.CRS;
        switch (this.options.crs) {
            case "simple":
                crs = L.CRS.Simple;
            case "earth":
                crs = L.CRS.Earth;
            default:
                crs = L.CRS.Simple;
        }

        if (this.options.center === undefined || this.options.zoom === undefined) {
            throw new Error("Leaflet map options must include both center and zoom.");
        }

        const center = L.latLng(this.options.center[0], this.options.center[1]);

        return {
            crs,
            minZoom: this.options.minZoom,
            maxZoom: this.options.maxZoom,
            zoom: this.options.zoom,
            center: center,
            zoomDelta: this.options.zoomDelta,
            zoomSnap: this.options.zoomSnap,
            attributionControl: this.options.attributionControl
        };
    }
}


class TileMapConfig extends LeafletMapConfig {
    tilePath: string;
    tileFileType?: string;
    bounds: [number, number][];

    constructor(data: TileMapConfigData) {
        super(data);
        this.tilePath = data.tilePath;
        this.tileFileType = data.tileFileType;
        this.bounds = data.bounds;
    }
}

class ImageMapConfig extends LeafletMapConfig {
    imagePath: string;
    width?: number;
    height?: number;
    bounds?: [number, number][];

    constructor(data: ImageMapConfigData) {
        super(data);
        this.imagePath = data.imagePath;
        this.width = data.width;
        this.height = data.height;
        this.bounds = data.bounds;
    }
}

class PlanMapConfig extends LeafletMapConfig {
    plans: Array<{ imagePath: string; label?: string; }>;
    width?: number;
    height?: number;

    constructor(data: PlanMapConfigData) {
        super(data);
        this.plans = data.plans;
        this.width = data.width;
        this.height = data.height;
    }
}

class ModelMapConfig extends MapConfig {
    modelPath: string;

    constructor(data: ModelMapConfigData) {
        super(data);
        this.modelPath = data.modelPath;
    }
}

export { MapConfig, LeafletMapConfig, TileMapConfig, ImageMapConfig, PlanMapConfig, ModelMapConfig };