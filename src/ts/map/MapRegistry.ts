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

            "dinosaur-land": {
                id: "dinosaur-land",
                label: "Dinosaur Land",
                configPath: "/data/maps/dinosaur-land/config.json5"
            }
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

        console.log("Map registry cache filled:", this.cache);
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

    async getById(id: string): Promise<MapConfig> {
        if (this.cache[id]) {
            return this.cache[id];
        }

        const identifier = this.maps[id];
        if (!identifier) 
            throw new Error(`Map with id "${id}" not found in registry.`);
        
        const rawData = await Loader.loadData<MapConfig>(identifier.configPath);
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
await mapRegistry.fillCache()