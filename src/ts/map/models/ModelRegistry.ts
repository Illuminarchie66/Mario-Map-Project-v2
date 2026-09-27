import { Globe3D } from "../models/Globe3D";
import { ModelMapConfig } from "../MapConfig";
import { ModelMap } from "../maps/ModelMap";

/*
The registry for all 3D model maps in the application.
It simply contains a list of their ids and corresponding class that inherits from ModelMap. 
This is used in the CreateMap factory to create a new instance of the model map based on the given config.
*/
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