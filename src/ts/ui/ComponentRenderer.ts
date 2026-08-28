import { Component } from './components/Component';
import { HeaderComponent } from "./components/Header";
import { ExploreButtonComponent } from "./components/ExploreButton";
import { AppearedTableComponent } from "./components/AppearedTable";
import { TextComponent } from "./components/Text";
import { ListComponent } from "./components/List";
import { ImageComponent } from "./components/ImageSingle";
import { ImageLeftComponent, ImageRightComponent } from "./components/ImageText";
import { HorizontalRuleComponent } from "./components/HorizontalRule";
import { CarouselComponent } from "./components/Carousel";
import { SpacerComponent } from "./components/Spacer";
import { ImageBottomComponent } from "./components/ImageBottom";

import { BaseComponent } from "./components/BaseComponent";
import { ContentBlock } from "./components/Content";

type ComponentConstructor<T extends ContentBlock = ContentBlock> = new (
    data: T,
    path?: string
) => BaseComponent<T>;
type ComponentRegistryMap = {
    [K in ContentBlock["type"]]: ComponentConstructor<Extract<ContentBlock, { type: K }>>
}

class ComponentRenderer {

    private readonly components: ComponentRegistryMap = {
        "appeared-table": AppearedTableComponent,
        "carousel": CarouselComponent,
        "explore-button": ExploreButtonComponent,
        "header": HeaderComponent,
        "horizontal-rule": HorizontalRuleComponent,
        "image": ImageComponent,
        "image-left": ImageLeftComponent,
        "image-right": ImageRightComponent,
        "image-bottom": ImageBottomComponent,
        "list": ListComponent,
        "spacer": SpacerComponent,
        "text": TextComponent
    };

    render(block: ContentBlock, path?: string): HTMLElement {
        const ComponentClass = this.components[block.type];

        if (!ComponentClass) {
            throw new Error(`No component exists for type: ${block.type}`);
        }

        const componentInstance = new ComponentClass(block as any, path);
        return componentInstance.render();
    }

}

export const componentRenderer = new ComponentRenderer();