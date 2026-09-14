
import { MapConfig, TileMapConfig, ImageMapConfig, PlanMapConfig, ModelMapConfig } from "../MapConfig";
import { _Map, MapView } from "./Map";
import { TileMap } from "./TileMap";
import { ImageMap } from "./ImageMap";
import { PlanMap } from "./PlanMap";
import { modelRegistry } from "../models/ModelRegistry";

export class CreateMap {
    static createMap(config: MapConfig, view?: MapView): _Map {
        if (config instanceof TileMapConfig) return new TileMap(config, view);
        if (config instanceof ImageMapConfig) return new ImageMap(config, view);
        if (config instanceof PlanMapConfig) return new PlanMap(config, view);
        if (config instanceof ModelMapConfig) {
            const modelClass = modelRegistry.getById(config.id);
            return new modelClass(config);
        }
    
        throw new Error(`Unsupported map type: ${config.type}`);
    }
}

