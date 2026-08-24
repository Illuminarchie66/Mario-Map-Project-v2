import * as L from 'leaflet';

import { MapConfig, TileMapConfig, ImageMapConfig } from "./MapConfig";
import { Waypoint } from "./Waypoints/WaypointManager";
import { IconIdentifier, IconRegistry } from "./Waypoints/IconRegistry";

abstract class _Map {
    containerId: string = "mapContainer";
    config: MapConfig;

    constructor(config: MapConfig) {
        this.config = config;
    }

    abstract getZoom(): number 

    abstract getCenter(): { lat: number, lng: number }
}

class LeafletMap extends _Map {
    map: L.Map;

    constructor({ config, center, zoom }: {
        config: MapConfig;
        center?: [number, number];
        zoom?: number;
    }) {
        if (center) 
            config.options.center = center;

        if (zoom)
            config.options.zoom = zoom;

        super(config);
        this.map = L.map(this.containerId, this.config.leafletOptions);

        const mapContainer = document.getElementById(this.containerId);
        const backgroundColor = this.config.features.backgroundColor || "#e8e8e8";
        if (mapContainer) 
            mapContainer.style.backgroundColor = backgroundColor;

        switch (this.config.type) {
            case "tiles":
                this.addTileLayer(this.config as TileMapConfig);
                break;
            case "image":
                this.addImageLayer(this.config as ImageMapConfig);
                break;
            case "model":
                // not implemented
                // will use three.js
                break;
            default:
                throw new Error(`Unsupported map type: ${this.config.type}`);
        }

    }

    on(type: string, fn: L.LeafletEventHandlerFn, context?: any): this {
        this.map.on(type, fn, context);
        return this;
    }

    off(type: string, fn?: L.LeafletEventHandlerFn, context?: any): this {
        this.map.off(type, fn, context);
        return this;
    }

    addTileLayer(config: TileMapConfig): void {
        const fileType = config.tileFileType || 'png';
        const TileLayer = L.TileLayer.extend({
            getTileUrl: function(coords: L.Coords) {
                const n = Math.pow(2, coords.z);
                let x = coords.x; 
                let y = coords.y;

                if (config.features.wrapX) {
                    x = ((x % n) + n) % n; 
                }

                if (config.features.wrapY) {
                    y = ((y % n) + n) % n; 
                }
                return `${config.tilePath}/${coords.z}/${x}/${y}.${fileType}`;
            }
        });

        new TileLayer().addTo(this.map);

        if (this.config.bounds) {
            this.handleBounds(L.latLngBounds(this.config.bounds));
        }
    }

    addImageLayer(config: ImageMapConfig): void {
        let bounds: L.LatLngBounds;

        if (this.config.bounds) {
            bounds = L.latLngBounds(this.config.bounds);
            const overlay = L.imageOverlay(config.imagePath, bounds).addTo(this.map);
            this.handleBounds(bounds);
        } else {
            const fallbackWidth = config.width || 1000;
            const fallbackHeight = config.height || 1000;
            bounds = L.latLngBounds(
                [-fallbackHeight / 2, -fallbackWidth / 2],
                [fallbackHeight / 2, fallbackWidth / 2]
            );
            const overlay = L.imageOverlay(config.imagePath, bounds).addTo(this.map);
            
            overlay.on('load', (event: any) => {
                const img = event.target._image;
                if (img) {
                    const width = img.naturalWidth;
                    const height = img.naturalHeight;
                    
                    const newBounds = L.latLngBounds(
                        [-height / 2, -width / 2],
                        [height / 2, width / 2]
                    );

                    overlay.setBounds(newBounds);
                    this.handleBounds(newBounds);
                }
            });
        }
    }

    handleBounds(bounds: L.LatLngBounds): void {
        this.map.setMaxBounds(bounds);
        this.map.options.maxBoundsViscosity = 1.0;

        if (!this.config.leafletOptions.zoom || !this.config.leafletOptions.center) {
            this.map.fitBounds(bounds);
        }
    }

    getZoom(): number {
        return this.map.getZoom();
    }

    getCenter(): { lat: number, lng: number } {
        return this.map.getCenter();
    }

    addMarker(waypoint: Waypoint, icon: IconIdentifier): L.ImageOverlay | L.Marker {
        if (icon.static) {
            // we use an image overlay for static icons, which do not scale with zoom
            const [lat, lng] = waypoint.coords;
            const scale = icon.staticScale || 1;
            const halfHeight = (icon.iconSize[1] / 2) * scale;
            const halfWidth = (icon.iconSize[0] / 2) * scale;

            const bounds: L.LatLngBoundsExpression = [
                [lat - halfHeight, lng - halfWidth],
                [lat + halfHeight, lng + halfWidth]
            ]

            return L.imageOverlay(
                icon.iconPath, bounds,
                { interactive: true, zIndex: 1000 }
            ).addTo(this.map);
            
        } else {
            const options: L.MarkerOptions = {
                icon: IconRegistry.createIcon(icon)
            }

            return L.marker(waypoint.coords, options).addTo(this.map);
        }
    }

    destroy(): void {
        this.map.remove();
    }
}

export { _Map, LeafletMap }