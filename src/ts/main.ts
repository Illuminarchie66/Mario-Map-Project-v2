import 'leaflet/dist/leaflet.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../css/core/fonts.css';

import { MapManager } from "./map/MapManager";
import { WaypointDisplayManager } from './ui/WaypointDisplay/WaypointDisplayManager';

const mapManager = new MapManager();
const waypointDisplayManager = new WaypointDisplayManager();
await mapManager.loadMapById({ id: "globe"});