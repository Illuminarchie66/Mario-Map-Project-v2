import 'leaflet/dist/leaflet.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { MapManager } from "./map/MapManager";
import { WaypointDisplayManager } from './ui/WaypointDisplay/WaypointDisplayManager';
import { eventBus } from "./core/EventBus";

const mapManager = new MapManager();
const waypointDisplayManager = new WaypointDisplayManager();
await mapManager.loadMapById({ id: "globe"});
//eventBus.emit("map:load-request", {id: "globe"});