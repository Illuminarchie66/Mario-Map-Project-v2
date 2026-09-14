import * as L from 'leaflet';
import { ImageMapConfig } from "../MapConfig";
import { ImageBasedMap } from "./ImageBasedMap";

export class ImageMap extends ImageBasedMap<ImageMapConfig> {
    
    addLayers(): void {
        this.computeBounds().then(bounds => {
            const overlay = L.imageOverlay(this.config.imagePath, bounds).addTo(this.map);
            
            this.map.setMaxBounds(bounds);
            this.map.options.maxBoundsViscosity = 1.0;
        });
    }
}