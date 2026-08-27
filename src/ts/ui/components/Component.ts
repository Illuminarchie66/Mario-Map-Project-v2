import { ContentBlock } from "./Content";
import { BaseComponent } from "./BaseComponent";

export abstract class Component<T extends ContentBlock = ContentBlock> extends BaseComponent<T> {}