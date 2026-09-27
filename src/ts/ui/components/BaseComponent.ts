/*
A simple base component class that is used to create other components. 
This provides a common interface for all components, and allows for easy rendering of components to the DOM.
*/

export interface RenderableComponent {
    path: string;
    render(): HTMLElement;
}

export abstract class BaseComponent<T> implements RenderableComponent {
    path: string;
    data: T;

    constructor(data: T, path?: string) {
        this.data = data;
        this.path = path || "";
    } 

    formatText(text: string): string {
        const urlRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)/g;
        const boldRegex = /(?<!\*)\*\*([^*]+)\*\*(?!\*)/g;
        const formattedText = text
            .replace(urlRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(boldRegex, '<strong>$1</strong>')
            .replace(italicRegex, '<em>$1</em>');
        return formattedText;
    }

    abstract render(): HTMLElement;
}