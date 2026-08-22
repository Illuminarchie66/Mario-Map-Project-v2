import 'leaflet/dist/leaflet.css';

import { MapManager } from "./map/MapManager";

const mapManager = new MapManager();
mapManager.loadMapById({ id: "globe", center: [0, 230]});
