import z from 'zod';
import { Registry } from "../core/Registry";
import { loadData } from "../core/Loader";
import { MapConfig, MapConfigData } from "./MapConfig";
import { _Map } from "./maps/Map";

const MapIdentifierSchema = z.object({
    id: z.string(),
    label: z.string(),
    configPath: z.string()
});
type MapIdentifier = z.infer<typeof MapIdentifierSchema>;

/*
The registry for all maps in the application.
It contains a list of all maps with their ids, labels, and config paths.
We use a config path to load json5 files, so that the data is not hardcoded into the application, and can be easily modified or added to.
The registry also contains a cache of loaded map configs, so that we don't have to load them from disk multiple times.
*/
export class MapRegistry extends Registry<MapConfig> {
    constructor(maps: MapConfig[]) {
        super();
        maps.forEach(map => {
            this.register(map.id, map);
        });
    }

    static async create(): Promise<MapRegistry> {
        const data = await loadData<MapIdentifier[]>("/data/maps/maps.json5");
        if (!data) {
            throw new Error(`Failed to load map registry from "/data/maps/maps.json5".`);
        }

        const maps = await Promise.all(
            data.map(async item => {
                const rawData = await loadData<MapConfigData>(item.configPath);
                if (!rawData) {
                    throw new Error(`Failed to load map config from "${item.configPath}".`);
                }
                return new MapConfig(rawData);
            })
        );

        return new MapRegistry(maps);
    }
}