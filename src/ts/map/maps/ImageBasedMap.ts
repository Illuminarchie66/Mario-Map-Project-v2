import * as L from 'leaflet';
import { ImageMapConfig, PlanMapConfig } from "../MapConfig";
import { LeafletMap } from "./LeafletMap";
import { getPortableURL } from "../../core/portableURL";

export abstract class ImageBasedMap<TConfig extends ImageMapConfig | PlanMapConfig> extends LeafletMap<TConfig> {
    abstract addLayers(): void;

    loadImageDimensions(imagePath: string): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = reject;
            img.src = getPortableURL(imagePath);
        });
    }

    createBounds(width: number, height: number): L.LatLngBounds {
        return L.latLngBounds(
            [-height, 0],
            [0, width]
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
            imagePath = getPortableURL(this.config.imagePath);
        } else if (this.config instanceof PlanMapConfig) {
            imagePath = getPortableURL(this.config.plans[0].imagePath);
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