import '../../css/ui/navigation-display.css';
import { mapRegistry } from '../map/MapRegistry';
import { MapConfig } from '../map/MapConfig';
import { eventBus } from '../core/EventBus';

export class NavigationDisplayManager {
    panel: HTMLElement;
    mapContainer: HTMLElement;

    constructor() {
        this.panel = document.createElement("div");
        this.panel.id = "navigationPanel";
        this.panel.className = "panel navigation";

        const title = document.createElement("h1");
        title.className = "navigation__title";
        title.textContent = "Map Navigation";
        this.panel.appendChild(title);

        this.mapContainer = document.createElement("div");
        this.mapContainer.className = "navigation__map-container";

        mapRegistry.getAll().then((configs) => {
            this.populateMapList(configs);
        }).catch((error) => {
            console.error("Error fetching map configs:", error);
        });

        this.panel.appendChild(this.mapContainer);
        document.body.appendChild(this.panel);

        eventBus.on("map:click", () => {
            this.hide();
        });

        document.addEventListener("keydown", (e) => { 
            if (e.key === "Escape") this.hide(); 
            if (e.key === "n" || e.key === "N") this.show();
        });
    }

    populateMapList(configs: MapConfig[]) {
        for (const config of configs) {
            const mapSelector = document.createElement("div");
            mapSelector.className = "navigation__map-selector";
            mapSelector.addEventListener("click", () => {
                eventBus.emit("map:load", {id: config.id});
            });

            const previewImage = document.createElement("img");
            previewImage.className = "navigation__map-preview";
            previewImage.src = config.mapPreview ?? "assets/core/images/black_default.jpg";
            mapSelector.appendChild(previewImage);

            const mapText = document.createElement("div");
            mapText.className = "navigation__map-text";

            const mapTitle = document.createElement("h2");
            mapTitle.className = "navigation__map-title";
            mapTitle.textContent = config.label ?? config.id
            mapText.appendChild(mapTitle);
            
            if (config.attribution) {
                const mapAttribution = document.createElement("p");
                mapAttribution.className = "navigation__map-attribution";
                
                let link;
                if (config.attribution.source) {
                    link = config.attribution.source;
                } else if (config.attribution.links && config.attribution.links.length > 0) {
                    link = config.attribution.links[0];
                }

                if (link) {
                    const anchor = document.createElement("a");
                    anchor.href = link;
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
            this.mapContainer.appendChild(mapSelector);
        }
    }

    show() {
        this.panel.classList.add("open");
    }

    hide() {
        this.panel.classList.remove("open");
    }
} 