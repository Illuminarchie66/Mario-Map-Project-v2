import '../../../css/ui/control.css';

import * as L from 'leaflet';
import { PlanMapConfig } from "../MapConfig";
import { ImageBasedMap } from "./ImageBasedMap";
import { getPortableURL } from '../../core/portableURL';

export class PlanMap extends ImageBasedMap<PlanMapConfig> {
    private layers: Record<string, L.LayerGroup> = {};
    private control: L.Control.Layers | null = null;

    async addLayers(): Promise<void> {

        // for now assume all plans have the same dimensions
        this.computeBounds().then(bounds => {
            for (const plan of this.config.plans) {
                const overlay = L.imageOverlay(getPortableURL(plan.imagePath), bounds);
                const group = L.layerGroup([overlay]);
                this.layers[plan.label ?? plan.imagePath] = group;
                group.addTo(this.map);
            }

            this.control = L.control.layers({}, this.layers, { }).addTo(this.map);
            
            this.map.setMaxBounds(bounds);
            this.map.options.maxBoundsViscosity = 1.0;
        });
    }
}

