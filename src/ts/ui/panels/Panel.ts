import { _Map } from "../../map/maps/Map";

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
