import { Globe3D } from "../models/Globe3D";
import { ModelMapConfig } from "../MapConfig";
import { ModelMap } from "../maps/ModelMap";

class ModelRegistry {
    private readonly models: Record<string, new (config: ModelMapConfig) => ModelMap> = {
        "globe-3d": Globe3D
    };

    getById(id: string): new (config: ModelMapConfig) => ModelMap {
        const modelClass = this.models[id];
        if (!modelClass) {
            throw new Error(`Model with id "${id}" not found in registry.`);
        }

        return modelClass;
    }

}

export const modelRegistry = new ModelRegistry();