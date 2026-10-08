import 'leaflet/dist/leaflet.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../css/core/main.css';
import '../css/core/fonts.css';

import { MapManager } from "./map/MapManager";
import { UIManager } from "./ui/UIManager";
import { MapRegistry } from './map/MapRegistry';
import { IconRegistry } from './map/waypoints/IconRegistry';
import { ModelRegistry } from './map/models/ModelRegistry';
import { MapView } from './map/maps/Map';

export const mapRegistry = await MapRegistry.create();
export const iconRegistry = await IconRegistry.create();
export const modelRegistry = new ModelRegistry();

/* 
This code reads the URL parameters to determine which map to load in initially. 
If no map is specified it defaults to the "globe" map. If a map is specified, it checks if the map exists in the registry.
If the map exists it sets the mapId to that specified map. Additionally if there are lat, lng, and zoom parameters specified in the URL it will set the mapView to those values.
Zoom is optional and if not specified it will default to 0. 
*/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let mapId: string = "globe"
let mapView: MapView | undefined = undefined;
const mapParam = urlParams.get('map');
if (mapParam) {
    if (mapRegistry.containsId(mapParam)) mapId = mapParam; 
    const latParam = parseFloat(urlParams.get('lat') ?? "");
    const lngParam = parseFloat(urlParams.get('lng') ?? "");
    const zoomParam = parseFloat(urlParams.get('zoom') ?? "");
    if (latParam && lngParam && !zoomParam)
        mapView = { center: [latParam, lngParam], zoom: 0 }
    if (latParam && lngParam && zoomParam) mapView = { center: [latParam, lngParam], zoom: zoomParam }
}

/*
This sets up the two main managers for the application. 
The UIManager handles all the UI elements such as the NavBar, Panels, WaypointDisplay and CoordDisplay.
The MapManager handles the loading and management of maps and waypoints.
They interact via the event bus.
*/
const uiManager = new UIManager();
const mapManager = new MapManager(mapId, mapView);