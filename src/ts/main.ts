import 'leaflet/dist/leaflet.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { MapManager } from "./map/MapManager";

const mapManager = new MapManager();
await mapManager.loadMapById({ id: "globe"});
