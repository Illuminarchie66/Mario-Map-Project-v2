import '../../css/ui/navbar.css';
import { PanelManager } from "./panels/PanelManager";
import { eventBus } from "../core/EventBus";
import { getPortableURL } from '../core/Loader';

/*
Navbar class handles the creation and management of the navigation bar in the UI. 
It appears on the left for larger screens, and at the bottom for smaller screens. 
It contains buttons for map selection, waypoint toggles, Star Atlas, settings, and attribution.
It makes use of the panel manager to show the appropriate panels when buttons are clicked.
Also has the rocket button which appears when the globe map is loaded, and allows the user to switch to the 3D globe map.
*/
export class NavBar {
    panelManager: PanelManager;
    navbar: HTMLDivElement;

    mapSelectorButton: HTMLButtonElement;
    waypointToggleButton: HTMLButtonElement;
    starAtlasButton: HTMLButtonElement;
    settingsButton: HTMLButtonElement;
    attributionButton: HTMLButtonElement;
    rocketButton: HTMLButtonElement;

    currentMapID: string | null = null;

    constructor(panelManager: PanelManager) {
        this.panelManager = panelManager;

        this.navbar = document.getElementById("navbar") as HTMLDivElement;

        this.mapSelectorButton = document.createElement("button");
        this.setupButton(
            this.mapSelectorButton, 
            "Map Selector", 
            "/assets/icons/globe-white.png", 
            () => { this.panelManager.showPanel("map-selector"); }
        );
        this.navbar.appendChild(this.mapSelectorButton);

        this.waypointToggleButton = document.createElement("button");
        this.setupButton(
            this.waypointToggleButton, 
            "Waypoint Toggles",
            "/assets/icons/waypoint.svg",
            () => { this.panelManager.showPanel("toggles"); }
        );
        this.navbar.appendChild(this.waypointToggleButton);

        this.starAtlasButton = document.createElement("button");
        this.setupButton(
            this.starAtlasButton, 
            "Star Atlas",
            "/assets/icons/fat-star.svg",
            () => { console.log("Star Atlas") }
        );
        this.navbar.appendChild(this.starAtlasButton);

        this.settingsButton = document.createElement("button");
        this.setupButton(
            this.settingsButton, 
            "Settings",
            "/assets/icons/cog2.svg",
            () => { this.panelManager.showPanel("settings"); }
        );
        this.navbar.appendChild(this.settingsButton);

        this.attributionButton = document.createElement("button");
        this.setupButton(
            this.attributionButton, 
            "Attribution",
            "/assets/icons/person.svg",
            () => { this.panelManager.showPanel("attribution"); }
        );
        this.navbar.appendChild(this.attributionButton);

        this.rocketButton = document.createElement("button");
        this.setupButton(
            this.rocketButton, 
            "Rocket",
            "/assets/icons/rocket.svg",
            () => { this.rocketButtonClick() }
        );

        eventBus.on("map:loaded", (payload) => {
            this.currentMapID = payload.id;
            if (this.currentMapID === "globe") {
                this.navbar.appendChild(this.rocketButton);
            } else {
                this.rocketButton.remove();
            }
        });

    }

    setupButton(button: HTMLButtonElement, title: string, iconPath: string, onClick: () => void) {
        button.className = "navbar__button";
        button.title = title;
        const icon = document.createElement("img");
        icon.src = getPortableURL(iconPath);
        icon.alt = title;
        button.appendChild(icon);
        button.addEventListener("click", onClick);
    }

    rocketButtonClick() {
        if (this.currentMapID === "globe") {
            eventBus.emit("map:load", { id: "globe-3d" });
        }
    }

}