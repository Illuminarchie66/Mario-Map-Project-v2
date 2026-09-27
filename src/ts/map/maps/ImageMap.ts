import * as L from 'leaflet';
import { ImageMapConfig } from "../MapConfig";
import { ImageBasedMap } from "./ImageBasedMap";
import { getPortableURL } from '../../core/Loader';

/*
ImageMap is an implementation of ImageBasedMap that has a single image overlay. 
It computes the bounds of the image either from the provided configuration or by loading the image dimensions.
*/
export class ImageMap extends ImageBasedMap<ImageMapConfig> {
    
    addLayers(): void {
        this.computeBounds().then(bounds => {
            const overlay = L.imageOverlay(getPortableURL(this.config.imagePath), bounds).addTo(this.map);
            
            this.map.setMaxBounds(bounds);
            this.map.options.maxBoundsViscosity = 1.0;
        });
    }
}