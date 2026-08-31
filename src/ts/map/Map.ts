import * as L from 'leaflet';

import { MapConfig, LeafletMapConfig, TileMapConfig, ImageMapConfig, PlanMapConfig, ModelMapConfig } from "./MapConfig";
import { Waypoint } from "./Waypoints/WaypointManager";
import { iconRegistry, IconIdentifier } from "./Waypoints/IconRegistry";
import { eventBus } from '../core/EventBus';

export type MapView = { center?: [number, number]; zoom?: number };

export abstract class _Map<TConfig extends MapConfig = MapConfig> {
    containerId: string = "mapContainer";
    config: TConfig;

    constructor(config: TConfig) {
        this.config = config;
    }

    abstract getZoom(): number 
    abstract getCenter(): { lat: number, lng: number }
    abstract destroy(): void
}

export abstract class LeafletMap<TConfig extends LeafletMapConfig = LeafletMapConfig> extends _Map<TConfig> {
    
    map: L.Map;
    private handlePopupShow = (popup: L.Popup) => this.openPopup(popup);
    private handlePopupHide = (popup: L.Popup) => this.closePopup(popup);

    constructor(config: TConfig, view ?: MapView) {
        super(config);

        const leafletOptions = this.config.leafletOptions;
        if (view?.center) {
            leafletOptions.center = L.latLng(view.center[0], view.center[1]);
        }

        if (view?.zoom) {
            leafletOptions.zoom = view.zoom;
        }
        
        this.map = L.map(this.containerId, this.config.leafletOptions);
        this.applyBackground();

        this.addLayers();

        eventBus.on("popup:show", this.handlePopupShow);
        eventBus.on("popup:hide", this.handlePopupHide);
        this.on("click", () => eventBus.emit("map:click", {}));
    }

    abstract addLayers(): void;

    applyBackground(): void {
        const mapContainer = document.getElementById(this.containerId);
        const backgroundColor = this.config.features.backgroundColor || "#e8e8e8";
        if (mapContainer) 
            mapContainer.style.backgroundColor = backgroundColor;
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

    on(type: string, fn: (e: any) => void, context?: any): this {
        this.map.on(type, fn, context);
        return this;
    }

    off(type: string, fn?: (e: any) => void, context?: any): this {
        this.map.off(type, fn, context);
        return this;
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

            const overlay = L.imageOverlay(
                icon.iconPath, bounds,
                { interactive: true, zIndex: 1000 }
            ).addTo(this.map);

            return overlay;
            
        } else {
            const options: L.MarkerOptions = {
                icon: iconRegistry.createIcon(icon)
            }

            return L.marker(waypoint.coords, options).addTo(this.map);
        }
    }

    openPopup(popup: L.Popup): void {
        popup.openOn(this.map);
    }

    closePopup(popup: L.Popup): void {
        this.map.closePopup(popup);
    }

    destroy(): void {
        eventBus.off("popup:show", this.handlePopupShow);
        eventBus.off("popup:hide", this.handlePopupHide);
        this.map.remove();
    }
}

export class TileMap extends LeafletMap<TileMapConfig> {
    addLayers(): void {
        const { tilePath, features } = this.config;
        const fileType = this.config.tileFileType || 'png';

        const CustomTileLayer = L.TileLayer.extend({
            getTileUrl: function(coords: L.Coords) {
                const n = Math.pow(2, coords.z);
                let x = coords.x; 
                let y = coords.y;

                if (features.wrapX) {
                    x = ((x % n) + n) % n; 
                }

                if (features.wrapY) {
                    y = ((y % n) + n) % n; 
                }
                return `${tilePath}/${coords.z}/${x}/${y}.${fileType}`;
            }
        });

        new CustomTileLayer().addTo(this.map);

        if (this.config.bounds) {
            this.handleBounds(L.latLngBounds(this.config.bounds));
        }
    }
}

abstract class ImageBasedMap<TConfig extends ImageMapConfig | PlanMapConfig> extends LeafletMap<TConfig> {
    abstract addLayers(): void;

    loadImageDimensions(imagePath: string): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = reject;
            img.src = imagePath;
        });
    }

    createBounds(width: number, height: number): L.LatLngBounds {
        return L.latLngBounds(
            [-height / 2, -width / 2],
            [height / 2, width / 2]
        )
    }

    async computeBounds(): Promise<L.LatLngBounds> {
        if (this.config.bounds) {
            return L.latLngBounds(this.config.bounds);
        }
        
        if (this.config.width && this.config.height) {
            return this.createBounds(this.config.width, this.config.height);
        }

        let imagePath: string;
        if (this.config instanceof ImageMapConfig) {
            imagePath = this.config.imagePath;
        } else if (this.config instanceof PlanMapConfig) {
            imagePath = this.config.plans[0].imagePath;
        } else {
            throw new Error("Unsupported map config type for computing bounds.");
        }

        const { width, height } = await this.loadImageDimensions(imagePath).catch(() => {
            console.warn(`Failed to load image dimensions for ${imagePath}. Using fallback dimensions.`);
            return { width: 1000, height: 1000 };
        })

        return this.createBounds(width, height);
    }
}

export class ImageMap extends ImageBasedMap<ImageMapConfig> {
    
    addLayers(): void {
        this.computeBounds().then(bounds => {
            const overlay = L.imageOverlay(this.config.imagePath, bounds).addTo(this.map);
            this.handleBounds(bounds);
        });
    }
}

export class PlanMap extends ImageBasedMap<PlanMapConfig> {
    private layers: Record<string, L.LayerGroup> = {};
    private control: L.Control.Layers | null = null;

    async addLayers(): Promise<void> {

        // for now assume all plans have the same dimensions
        this.computeBounds().then(bounds => {
            for (const plan of this.config.plans) {
                const overlay = L.imageOverlay(plan.imagePath, bounds);
                const group = L.layerGroup([overlay]);
                this.layers[plan.label ?? plan.imagePath] = group;
                group.addTo(this.map);
            }

            this.control = L.control.layers(this.layers, {}, { collapsed: false }).addTo(this.map);
            this.handleBounds(bounds);
        });

    }

}

export class ModelMap extends _Map<ModelMapConfig> {
    constructor(config: ModelMapConfig) {
        super(config);
        // Not Implemented: init three.js scene/camera/renderer using this.config.modelPath
    }
 
    getZoom(): number {
        // Not Implemented: map to camera distance/fov once three.js scene exists
        return 0;
    }
 
    getCenter(): { lat: number, lng: number } {
        // Not Implemented: map to camera target once three.js scene exists
        return { lat: 0, lng: 0 };
    }
 
    destroy(): void {
        // Not Implemented: dispose three.js scene/renderer
    }
}

export function createMap(config: MapConfig, view?: MapView): _Map {
    if (config instanceof TileMapConfig) return new TileMap(config, view);
    if (config instanceof ImageMapConfig) return new ImageMap(config, view);
    if (config instanceof PlanMapConfig) return new PlanMap(config, view);
    if (config instanceof ModelMapConfig) return new ModelMap(config);
 
    throw new Error(`Unsupported map type: ${config.type}`);
}