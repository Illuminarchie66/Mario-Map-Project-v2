import { ContentBlock } from "./Content";

export abstract class Component<T extends ContentBlock = ContentBlock> {
    path: string;
    data: T;
    constructor(data: T, path?: string) {
        this.data = data;
        this.path = path || "";
    } 

    abstract render(): HTMLElement;
}