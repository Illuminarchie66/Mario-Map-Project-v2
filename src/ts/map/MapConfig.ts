import * as L from 'leaflet';
import z from 'zod';

const MapOptionsSchema = z.object({
    crs: z.string().optional(),
    minZoom: z.number().optional(),
    maxZoom: z.number().optional(),
    zoom: z.number().optional(),
    center: z.tuple([z.number(), z.number()]).optional(),
    zoomDelta: z.number().optional(),
    zoomSnap: z.number().optional(),
    attributionControl: z.boolean().optional()
});
type MapOptions = z.infer<typeof MapOptionsSchema>;

const MapFeaturesSchema = z.object({
    backgroundColor: z.string().optional(),
    usesTiles: z.boolean().optional(),
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

const MapTypeSchema = z.enum(["tiles", "image", "model"]);
type MapType = z.infer<typeof MapTypeSchema>;

const MapConfigBaseSchema = z.object({
    id: z.string(),
    type: MapTypeSchema,
    options: MapOptionsSchema,
    features: MapFeaturesSchema,
    label: z.string().optional(),
    attribution: MapAttributionSchema.optional(),
    waypointPath: z.string().optional(),
    bounds: z.array(z.tuple([z.number(), z.number()])).optional(),
    mapPreview: z.string().optional()
});
type MapConfigData = z.infer<typeof MapConfigBaseSchema>;

const TileMapConfigSchema = MapConfigBaseSchema.extend({
    type: z.literal("tiles"),
    tilePath: z.string(),
    tileFileType: z.string().optional()
});
type TileMapConfigData = z.infer<typeof TileMapConfigSchema>;

const ImageMapConfigSchema = MapConfigBaseSchema.extend({
    type: z.literal("image"),
    imagePath: z.string(),
    width: z.number().optional(),
    height: z.number().optional()
});
type ImageMapConfigData = z.infer<typeof ImageMapConfigSchema>;

const ModelMapConfigSchema = MapConfigBaseSchema.extend({
    type: z.literal("model"),
    modelPath: z.string(),
});
type ModelMapConfigData = z.infer<typeof ModelMapConfigSchema>;

const MapConfigSchema = z.discriminatedUnion("type", [
    TileMapConfigSchema,
    ImageMapConfigSchema,
    ModelMapConfigSchema
]);

abstract class MapConfig {
    id: string;
    type: MapType;
    options: MapOptions;
    features: MapFeatures;

    label?: string;
    attribution?: MapAttribution;
    waypointPath?: string;
    bounds?: [number, number][];
    mapPreview?: string;

    constructor(data: {
        id: string;
        type: MapType;
        options: MapOptions;
        features: MapFeatures;
        label?: string;
        attribution?: MapAttribution;
        waypointPath?: string;
        bounds?: [number, number][];
        mapPreview?: string;
    }) {
        this.id = data.id;
        this.type = data.type;
        this.options = data.options;
        this.features = data.features;
        this.label = data.label;
        this.attribution = data.attribution;
        this.waypointPath = data.waypointPath;
        this.bounds = data.bounds;
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
            case "model":
                return new ModelMapConfig(res.data);
            default:
                throw new Error(`Unsupported map type: ${res.data}`);
        }
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

    constructor(data: TileMapConfigData) {
        super(data);
        this.tilePath = data.tilePath;
        this.tileFileType = data.tileFileType;
    }
}

class ImageMapConfig extends MapConfig {
    imagePath: string;
    width?: number;
    height?: number;

    constructor(data: ImageMapConfigData) {
        super(data);
        this.imagePath = data.imagePath;
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

export { MapConfig, TileMapConfig, ImageMapConfig, ModelMapConfig };