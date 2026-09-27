import { Panel } from './Panel';

/*
This class is the settings panel, which will contain various settings for the application.
Right now is empty.
*/

export class SettingsPanel extends Panel {
    mapsContainer!: HTMLElement;
    
    constructor(panelContainer: HTMLElement) {
        super("settings", panelContainer);
        this.addContent();
    }

    addContent(): void {
        const titleElement = this.createTitle("Settings");
        this.panel.appendChild(titleElement);
    }
    updateContent(): void {}
}