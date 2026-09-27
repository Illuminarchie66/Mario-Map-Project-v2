import { ContentBlock } from "./Content";
import { BaseComponent } from "./BaseComponent";

// Component class that extends the BaseComponent class and adds a generic type parameter for the content block type.
// Helped with the weird typing nonsense.
export abstract class Component<T extends ContentBlock = ContentBlock> extends BaseComponent<T> {}