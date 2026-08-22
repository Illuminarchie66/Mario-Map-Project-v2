import 'leaflet/dist/leaflet.css';

import { Loader } from "./core/Loader";
import { MapManager } from "./map/MapManager";
import { MapConfig } from "./map/MapConfig";

const mapManager = new MapManager();
const rawData = await Loader.loadData<any>("/data/maps/globe/config.json5");
const mapConfig = MapConfig.create(rawData);

if (mapConfig) 
    mapManager.loadMap(mapConfig);
