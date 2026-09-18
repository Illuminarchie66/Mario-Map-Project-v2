import { Panel } from './Panel';

export class AttributionPanel extends Panel {
    
    constructor(panelContainer: HTMLElement) {
        super("attribution", panelContainer);
        this.addContent();
    }

    addContent(): void {
        const titleElement = this.createTitle("Attribution");
        this.panel.appendChild(titleElement);
    }
}