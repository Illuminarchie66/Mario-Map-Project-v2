import * as L from 'leaflet';
import { TileMapConfig } from "../MapConfig";
import { LeafletMap } from "./LeafletMap";

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
            this.map.setMaxBounds(this.config.bounds);
            this.map.options.maxBoundsViscosity = 1.0;
        }
    }
}
