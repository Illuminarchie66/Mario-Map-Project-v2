import { getPortableURL } from '../../core/portableURL';
import { MapConfig } from '../../map/MapConfig';
import { _Map } from '../../map/maps/Map';
import { Panel } from './Panel';

export class AttributionPanel extends Panel {
    attributionContainer!: HTMLElement;
    text!: HTMLElement;
    links!: HTMLElement;
    
    constructor(panelContainer: HTMLElement) {
        super("attribution", panelContainer);
        this.addContent();
    }

    addContent(): void {
        const titleElement = this.createTitle("Attribution");
        this.panel.appendChild(titleElement);

        this.attributionContainer = document.createElement("div");
        this.attributionContainer.className = "attribution__attribution-container";

        this.text = document.createElement("p");
        this.links = document.createElement("ul");
        this.links.className = "attribution__link-list";

        this.attributionContainer.appendChild(this.text);
        this.attributionContainer.appendChild(this.links);
        this.panel.appendChild(this.attributionContainer);
    }

    updateContent(map: _Map): void {
        if (!map.config.attribution) return;

        const attribution = map.config.attribution;
        let sourceLink = undefined;
        if (attribution.source) {
            sourceLink = document.createElement("a");
            sourceLink.href = attribution.source?.url ?? "";
            sourceLink.target = "_blank";
            sourceLink.rel = "noopener noreferrer";
            sourceLink.textContent = attribution.source?.label || "";
        }

        let text: string = "";
        if (attribution.creator === "Nintendo") {
            text += `This map was made by Nintendo and originates from ${attribution.game}. `
            if (sourceLink) text += `The assets were gathered from ${sourceLink.outerHTML}.`
        } else if (attribution.creator === "Illuminarchie") {
            text += `This map was made by yours truly! Feel free to check out my socials below.`
        } else {
            text += `This wonderful map was made by ${attribution.creator}. `
            if (sourceLink) {
                text += `The assets were gathered from ${sourceLink.outerHTML} with their permission! Checkout the creator's socials below.`
            } else {
                text += `The assets were gathered directly from the creator with their permission! Checkout the creator's socials below.`
            }
        }
        this.text.innerHTML = text;

        this.links.innerHTML = '';
        attribution.links?.forEach((link) => {
            const li = document.createElement("li");
            const container = document.createElement("div");
            container.className = "attribution__li-container";
            const icon = document.createElement("img");
            icon.src = getPortableURL("/assets/icons/fat-star.svg");
            icon.alt = link.label;
            icon.classList = "attribution__link-icon inverted"
            container.appendChild(icon);

            const entry = document.createElement("a");
            entry.href = link.url;
            entry.target = "_blank";
            entry.rel = "noopener noreferrer";
            entry.textContent = link.label;
            container.appendChild(entry);
            li.appendChild(container)
            this.links.appendChild(li);
        });
    }
}