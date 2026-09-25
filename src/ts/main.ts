import 'leaflet/dist/leaflet.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../css/core/main.css';
import '../css/core/fonts.css';

import { MapManager } from "./map/MapManager";
import { UIManager } from "./ui/UIManager";
import { mapRegistry } from './map/MapRegistry';
import { MapView } from './map/maps/Map';

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

const uiManager = new UIManager();
const mapManager = new MapManager(mapId, mapView);