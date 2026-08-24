import 'leaflet/dist/leaflet.css';

import { MapManager } from "./map/MapManager";

const mapManager = new MapManager();
await mapManager.loadMapById({ id: "globe"});
