import { Component } from './components/BaseComponent'

export class ComponentRenderer {

    static render(components: Component | Component[]) {
        if (components instanceof Component) {
            components = [components]
        }

        components.forEach(component => {
            
        });
    }

}