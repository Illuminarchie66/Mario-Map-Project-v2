import { _Map } from "../../map/maps/Map";

/*
This is the abstract class that all panels extend. It provides the basic structure and functionality for panels, including the ability to add content, update content based on the current map, and show/hide the panel.
The addContent() method is called on construction of the panel, and updateContent() is called whenever the map is loaded. The show() and hide() methods are used by the manager to display or hide the panel.
*/

export abstract class Panel {
    panel: HTMLElement;
    panelName: string;

    constructor(name: string, panelContainer: HTMLElement) {
        this.panel = document.createElement("div");
        this.panelName = name;
        this.panel.id = name;
        this.panel.className = "panel ui " + name;

        panelContainer.appendChild(this.panel);
    }

    abstract addContent(): void;
    abstract updateContent(map: _Map): void;

    createTitle(title: string): HTMLElement {
        const titleElement = document.createElement("h1");
        titleElement.className = "ui__title";
        titleElement.textContent = title;
        return titleElement;
    }

    show() {
        this.panel.classList.add("open");
    }

    hide() {
        this.panel.classList.remove("open");
    }
}
