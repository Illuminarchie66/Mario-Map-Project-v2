import { Globe3D } from "../models/Globe3D";
import { ModelMapConfig } from "../MapConfig";
import { ModelMap } from "../maps/ModelMap";
import { Registry } from "../../core/Registry";

/*
The registry for all 3D model maps in the application.
It simply contains a list of their ids and corresponding class that inherits from ModelMap. 
This is used in the CreateMap factory to create a new instance of the model map based on the given config.
*/
export class ModelRegistry extends Registry<new (config: ModelMapConfig) => ModelMap> {
    constructor() {
        super();
        this.register("globe-3d", Globe3D);
    }

}