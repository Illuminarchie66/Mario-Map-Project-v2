import * as L from 'leaflet';

import { LeafletMapConfig } from "../MapConfig";
import { _Map, MapView } from "./Map";
import { eventBus } from '../../core/EventBus';

import { Waypoint } from "../Waypoints/WaypointManager";
import { iconRegistry, IconIdentifier } from "../Waypoints/IconRegistry";

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
        const backgroundColor = this.config.features.backgroundColor || "#e8e8e8";
        this.mapContainer.style.backgroundColor = backgroundColor;
    }

    handleBounds(bounds: L.LatLngBounds): void {
        const imgWidth = 3780
        const imgHeight = 1281
        const southWest = this.map.unproject([0, imgHeight], this.map.getMaxZoom());
        const northEast = this.map.unproject([imgWidth, 0], this.map.getMaxZoom());
        const newbounds = new L.LatLngBounds(southWest, northEast);
        console.log(newbounds);

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
