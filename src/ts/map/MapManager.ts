import * as L from 'leaflet';
import { MapConfig } from './MapConfig';
import { _Map } from './maps/Map';
import { LeafletMap } from './maps/LeafletMap';
import { mapRegistry } from './MapRegistry';
import { WaypointManager } from './waypoints/WaypointManager';
import { eventBus } from '../core/EventBus';
import { MapView } from './maps/Map';
import { createMap } from './maps/CreateMap';

/*
This is the primary manager for handling maps and waypoints.
It has an event listener for "map:load" events, which will load the specified map by its ID and map view.
Core function is loadMap, which takes a config and optional view, and initializes the map and waypoints.
*/
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

        this.map = createMap(config, view);
        await this.map.init(); //use init for async initialization of the map, mainly for three.js

        await this.waypointManager.loadWaypointsByMap(this.map as LeafletMap); //when the map is loaded, load the waypoints for that map
        
        // Update the URL to reflect the loaded map and reset lat/lng/zoom parameters
        const url = new URL(window.location.href);
        if (url.searchParams.get('map') !== config.id) {
            url.searchParams.set('map', config.id);
            url.searchParams.delete('lat');
            url.searchParams.delete('lng');
            url.searchParams.delete('zoom');
            window.history.pushState({}, '', url);
        }
        
        // Tell the UI that the map has updated
        eventBus.emit("map:loaded", { id: config.id, view: view, map: this.map });
    }

    // Wraps loadMap to load a map by its ID, fetching the config from the registry first
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