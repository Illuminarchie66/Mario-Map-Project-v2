import 'leaflet/dist/leaflet.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../css/core/main.css';
import '../css/core/fonts.css';

import { MapManager } from "./map/MapManager";
import { UIManager } from "./ui/UIManager";

const uiManager = new UIManager();
const mapManager = new MapManager("globe");