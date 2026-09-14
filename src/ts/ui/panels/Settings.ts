import { Panel } from './Panel';

export class SettingsPanel extends Panel {
    mapsContainer!: HTMLElement;
    
    constructor(panelContainer: HTMLElement) {
        super("settings", panelContainer);
        this.addContent();
    }

    addContent(): void {
        const titleElement = this.createTitle("Settings");
        titleElement.className += " ui__title";
        this.panel.appendChild(titleElement);
    }
}