import * as L from 'leaflet';
import { MapConfig } from './MapConfig';
import { _Map } from './maps/Map';
import { LeafletMap } from './maps/LeafletMap';
import { ModelMap } from './maps/ModelMap';
import { mapRegistry } from './MapRegistry';
import { WaypointManager } from './waypoints/WaypointManager';
import { eventBus } from '../core/EventBus';
import { MapView } from './maps/Map';
import { CreateMap } from './maps/CreateMap';

class MapManager {
    map: _Map | null = null;
    waypointManager: WaypointManager;

    constructor(initialMapId?: string, initialMapView?: MapView) {
        this.waypointManager = new WaypointManager();

        eventBus.on("map:load", (payload) => {
            const { id, view } = payload;
            this.loadMapById({ id, view }).catch(error => {
                console.error(`Failed to load map: "${id}": `, error);
            });
        });

        if (initialMapId) {
            eventBus.emit("map:load", { id: initialMapId, view: initialMapView });
            // this.loadMapById({ id: initialMapId }).catch(error => {
            //     console.error(`Failed to load initial map: "${initialMapId}": `, error);
            // });
        }
    }

    async loadMap({ config, view }: {
        config: MapConfig;
        view?: MapView;
    }): Promise<void> {
        if (this.map?.config.id === config.id) return;

        if (this.map) {
            this.reset();
        }

        this.map = CreateMap.createMap(config, view);
        await this.map.init();

        await this.waypointManager.loadWaypointsByMap(this.map as LeafletMap);

        if (this.map instanceof LeafletMap) {
            this.map.on("mousemove", (e: L.LeafletMouseEvent) => {
                eventBus.emit("map:mousemove", {
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                });
            });

            const map = this.map;
            map.on("zoomend", () => {
                eventBus.emit("map:zoom", {
                    zoom: map.getZoom(),
                });
            });

            eventBus.emit("map:zoom", {
                zoom: map.getZoom(),
            });
        }
        
        const url = new URL(window.location.href);
        if (url.searchParams.get('map') !== config.id) {
            url.searchParams.set('map', config.id);
            url.searchParams.delete('lat');
            url.searchParams.delete('lng');
            url.searchParams.delete('zoom');
            window.history.pushState({}, '', url);
        }
        
        eventBus.emit("map:loaded", { id: config.id, view: view, map: this.map });
    }

    async loadMapById({ id, view }: {
        id: string;
        view?: MapView;
    }): Promise<void> {
        const config = await mapRegistry.getById(id);
        await this.loadMap({config: config, view: view});
    }

    reset(): void {
        this.map?.destroy();

        this.map = null;
        this.waypointManager.reset();
    }
}

export { MapManager };