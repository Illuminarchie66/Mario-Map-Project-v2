import { Loader } from "../core/Loader";
import { MapConfig } from "./MapConfig";
import { _Map } from "./Map";

interface MapIdentifier {
    id: string;
    label: string;
    configPath: string;
}

class MapRegistry {
    private readonly maps: Record<string, MapIdentifier> = {
        "globe": {
            id: "globe",
            label: "Globe",
            configPath: "/data/maps/globe/config.json5" 
        }
    };

    async getById(id: string): Promise<MapConfig> {
        const identifier = this.maps[id];
        if (!identifier) 
            throw new Error(`Map with id "${id}" not found in registry.`);
        
        const rawData = await Loader.loadData<any>(identifier.configPath);
        return MapConfig.create(rawData);
    }

    async getByLabel(label: string): Promise<MapConfig> {
        const identifier = Object.values(this.maps).find(m => m.label === label);
        if (!identifier) 
            throw new Error(`Map with label "${label}" not found in registry.`);
        return this.getById(identifier.id);
    }
}

export const mapRegistry = new MapRegistry();