import * as L from 'leaflet';
import { TileMapConfig } from "../MapConfig";
import { LeafletMap } from "./LeafletMap";
import { getPortableURL } from '../../core/Loader';

/*
TileMap is an implementation of LeafletMap that uses a tile approach of (z, x, y) approach for rendering maps. 
The tiles are generated via gdal2tiles.py, and the path and type is provided by the config. 
The bounds currently have to be set manually in the config, as I'm unsure how to compute the bounds from the tiles themselves.

If wrapX is set to true, the map will wrap horizontally, allowing for infinite scrolling in the x direction, useful for globe maps. Similarly true for wrapY.
*/
export class TileMap extends LeafletMap<TileMapConfig> {
    addLayers(): void {
        let { tilePath, features } = this.config;
        tilePath = getPortableURL(tilePath);
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
