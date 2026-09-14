import '../../css/ui/navbar.css';
import { PanelManager } from "./panels/PanelManager";

export class NavBar {
    panelManager: PanelManager;
    navbar: HTMLDivElement;

    constructor(panelManager: PanelManager) {
        this.panelManager = panelManager;

        this.navbar = document.getElementById("navbar") as HTMLDivElement;

        const mapSelectorButton = document.createElement("button");
        mapSelectorButton.className = "navbar__button";
        const mapSelectorIcon = document.createElement("img");
        mapSelectorIcon.src = "assets/icons/globe-white.png";
        mapSelectorIcon.alt = "Map Selector";
        mapSelectorButton.appendChild(mapSelectorIcon);
        this.navbar.appendChild(mapSelectorButton);

        const waypointToggleButton = document.createElement("button");
        waypointToggleButton.className = "navbar__button";
        const waypointToggleIcon = document.createElement("img");
        waypointToggleIcon.src = "assets/icons/map.svg";
        waypointToggleIcon.alt = "Waypoint Toggle";
        waypointToggleButton.appendChild(waypointToggleIcon);
        this.navbar.appendChild(waypointToggleButton);

        const starAtlasButton = document.createElement("button");
        starAtlasButton.className = "navbar__button";
        const starAtlasIcon = document.createElement("img");
        starAtlasIcon.src = "assets/icons/book.svg";
        starAtlasIcon.alt = "Star Atlas";
        starAtlasIcon.className = "inverted";
        starAtlasButton.appendChild(starAtlasIcon);
        this.navbar.appendChild(starAtlasButton);

        const settingsButton = document.createElement("button");
        settingsButton.className = "navbar__button";
        const settingsIcon = document.createElement("img");
        settingsIcon.src = "assets/icons/cog.svg";
        settingsIcon.alt = "Settings";
        settingsIcon.className = "inverted";
        settingsButton.appendChild(settingsIcon);
        this.navbar.appendChild(settingsButton);

        mapSelectorButton.addEventListener("click", () => {
            console.log("Map Selector button clicked");
            this.panelManager.showPanel("map-selector");
        });

        waypointToggleButton.addEventListener("click", () => {
            console.log("Waypoint Toggle button clicked");
            this.panelManager.showPanel("toggles");
        });

        settingsButton.addEventListener("click", () => {
            console.log("Settings button clicked");
            this.panelManager.showPanel("settings");
        });
    }

}