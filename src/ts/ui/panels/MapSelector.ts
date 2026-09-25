import '../../../css/ui/panels/map-selector.css';
import { Panel } from './Panel';
import { eventBus } from '../../core/EventBus';
import { MapConfig } from '../../map/MapConfig';
import { mapRegistry } from '../../map/MapRegistry';
import { getPortableURL } from '../../core/portableURL';
import { _Map } from '../../map/maps/Map';

export class MapSelectorPanel extends Panel {
    mapsContainer!: HTMLElement;
    
    constructor(panelContainer: HTMLElement) {
        super("map-selector", panelContainer);
        this.addContent();
    }

    addContent(): void {
        const titleElement = this.createTitle("Map Selector");
        this.panel.appendChild(titleElement);

        this.mapsContainer = document.createElement("div");
        this.mapsContainer.className = "map-selector__maps-container";

        mapRegistry.getAll().then((configs) => {
            this.populateMapList(configs);
        }).catch((error) => {
            console.error("Error fetching map configs:", error);
        });

        this.panel.appendChild(this.mapsContainer);
    }

    updateContent(map: _Map): void {}

    populateMapList(configs: MapConfig[]) {
        for (const config of configs) {
            const mapSelector = document.createElement("div");
            mapSelector.className = "map-selector__map-option";
            mapSelector.addEventListener("click", () => {
                eventBus.emit("map:load", {id: config.id});
            });

            const previewImage = document.createElement("img");
            previewImage.className = "map-selector__map-preview";
            previewImage.src = getPortableURL(config.mapPreview ?? "/assets/core/images/black_default.jpg");
            mapSelector.appendChild(previewImage);

            const mapText = document.createElement("div");

            const mapTitle = document.createElement("h2");
            mapTitle.className = "map-selector__map-title";
            mapTitle.textContent = config.label ?? config.id
            mapText.appendChild(mapTitle);
            
            if (config.attribution) {
                const mapAttribution = document.createElement("p");
                mapAttribution.className = "map-selector__map-attribution";
                
                let link;
                if (config.attribution.source) {
                    link = config.attribution.source;
                } else if (config.attribution.links && config.attribution.links.length > 0) {
                    link = config.attribution.links[0];
                }

                if (link) {
                    const anchor = document.createElement("a");
                    anchor.href = link.url;
                    anchor.textContent = config.attribution.creator ? config.attribution.creator : "Source";
                    anchor.target = "_blank";
                    anchor.onclick = (e) => e.stopPropagation(); 
                    mapAttribution.appendChild(anchor);
                } else {
                    mapAttribution.textContent = config.attribution.creator ? config.attribution.creator : "Unknown";
                }
                
                mapText.appendChild(mapAttribution);
            }

            mapSelector.appendChild(mapText);
            this.mapsContainer.appendChild(mapSelector);
        }
    }
}