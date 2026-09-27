import { loadData } from "../core/Loader";
import { MapConfig } from "./MapConfig";
import { _Map } from "./maps/Map";

interface MapIdentifier {
    id: string;
    label: string;
    configPath: string;
}

/*
The registry for all maps in the application.
It contains a list of all maps with their ids, labels, and config paths.
We use a config path to load json5 files, so that the data is not hardcoded into the application, and can be easily modified or added to.
The registry also contains a cache of loaded map configs, so that we don't have to load them from disk multiple times.
*/
class MapRegistry {
    
    private readonly maps: Record<string, MapIdentifier> = {
        "globe": {
            id: "globe",
            label: "Globe",
            configPath: "/data/maps/globe/config.json5" 
        },

        "globe-3d": {
            id: "globe-3d",
            label: "Globe 3D",
            configPath: "/data/maps/globe-3d/config.json5" 
        },

            "mushroom-continent": {
                id: "mushroom-continent",
                label: "Mushroom Continent",
                configPath: "/data/maps/mushroom-continent/config.json5"
            },

                "toad-town": {
                    id: "toad-town",
                    label: "Toad Town",
                    configPath: "/data/maps/toad-town/config.json5"
                },

                    "peachs-castle": {
                        id: "peachs-castle",
                        label: "Peach's Castle",
                        configPath: "/data/maps/peachs-castle/config.json5"
                    },

                "toad-town-sophie": {
                    id: "toad-town-sophie",
                    label: "Toad Town (Lady Sophie)",
                    configPath: "/data/maps/toad-town-sophie/config.json5"
                },

                "challenge-road": {
                    id: "challenge-road",
                    label: "Challenge Road",
                    configPath: "/data/maps/challenge-road/config.json5"
                },

                "flower-kingdom": {
                    id: "flower-kingdom",
                    label: "Flower Kingdom",
                    configPath: "/data/maps/flower-kingdom/config.json5"
                },

            "sunshine-archipelago": {
                id: "sunshine-archipelago",
                label: "Sunshine Archipelago",
                configPath: "/data/maps/sunshine-archipelago/config.json5"
            },

                "isle-delfino": {
                    id: "isle-delfino",
                    label: "Isle Delfino",
                    configPath: "/data/maps/isle-delfino/config.json5"
                },

            "baseball-kingdom": {
                id: "baseball-kingdom",
                label: "Baseball Kingdom",
                configPath: "/data/maps/baseball-kingdom/config.json5"
            },

            "mario-kart-world": {
                id: "mario-kart-world",
                label: "Mario Kart World",
                configPath: "/data/maps/mario-kart-world/config.json5"
            },

            "prism-island": {
                id: "prism-island",
                label: "Prism Island",
                configPath: "/data/maps/prism-island/config.json5"
            },

            // Awaiting permission.
            // "dinosaur-land": {
            //     id: "dinosaur-land",
            //     label: "Dinosaur Land",
            //     configPath: "/data/maps/dinosaur-land/config.json5"
            // }
    };

    cache: Record<string, MapConfig> = {};

    async fillCache(): Promise<void> {
        for (const id in this.maps) {
            try {
                const config = await this.getById(id);
                this.cache[id] = config;
            } catch (error) {
                console.error(`Failed to load map config for id "${id}":`, error);
            }
        }
    }

    async getAll(): Promise<MapConfig[]> {
        if (Object.keys(this.cache).length === Object.keys(this.maps).length) {
            return Object.values(this.cache);
        }

        const configs: MapConfig[] = [];
        for (const id in this.maps) {
            try {
                const config = await this.getById(id);
                configs.push(config);
            } catch (error) {
                console.error(`Failed to load map config for id "${id}":`, error);
            }
        }
        return configs;
    }

    containsId(id: string): boolean {
        const identifier = this.maps[id];
        if (!identifier) return false;
        return true
    }

    // Gets the map config by its id, loading it from the registry if it is not already cached.
    // Uses the Loader to get the JSON object, then uses MapConfig.create to create the appropriate config type.
    async getById(id: string): Promise<MapConfig> {
        if (this.cache[id]) {
            return this.cache[id];
        }

        const identifier = this.maps[id];
        if (!identifier) 
            throw new Error(`Map with id "${id}" not found in registry.`);
        
        const rawData = await loadData<MapConfig>(identifier.configPath);
        return MapConfig.create(rawData);
    }

    async getByLabel(label: string): Promise<MapConfig> {
        const identifier = Object.values(this.maps).find(m => m.label === label);
        if (!identifier) 
            throw new Error(`Map with label "${label}" not found in registry.`);
        return this.getById(identifier.id);
    }
}

// When we create the map registry, we immediately fill the cache with all configs, so we do not load them multiple times.
export const mapRegistry = new MapRegistry();
await mapRegistry.fillCache()