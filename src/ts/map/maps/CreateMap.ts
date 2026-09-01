
import { MapConfig, TileMapConfig, ImageMapConfig, PlanMapConfig, ModelMapConfig } from "../MapConfig";
import { _Map, MapView } from "./Map";
import { TileMap } from "./TileMap";
import { ImageMap } from "./ImageMap";
import { PlanMap } from "./PlanMap";
import { ModelMap } from "./ModelMap";

export class CreateMap {
    static createMap(config: MapConfig, view?: MapView): _Map {
        if (config instanceof TileMapConfig) return new TileMap(config, view);
        if (config instanceof ImageMapConfig) return new ImageMap(config, view);
        if (config instanceof PlanMapConfig) return new PlanMap(config, view);
        if (config instanceof ModelMapConfig) return new ModelMap(config);
    
        throw new Error(`Unsupported map type: ${config.type}`);
    }
}

