import { Panel } from './Panel';

export class TogglesPanel extends Panel {
    mapsContainer!: HTMLElement;
    
    constructor(panelContainer: HTMLElement) {
        super("toggles", panelContainer);
        this.addContent();
    }

    addContent(): void {
        const titleElement = this.createTitle("Toggles");
        this.panel.appendChild(titleElement);
    }
}