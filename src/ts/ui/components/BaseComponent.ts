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

    abstract render(): HTMLElement;
}