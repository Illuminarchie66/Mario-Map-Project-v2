import { WaypointDisplayManager } from './WaypointDisplay/WaypointDisplayManager';
import { CoordDisplay } from './modals/CoordDisplay';
import { NavigationDisplayManager } from './NavigationDisplayManager';
import { eventBus } from '../core/EventBus';

export class UIManager {
    waypointDisplayManager: WaypointDisplayManager;
    navigationDisplayManager: NavigationDisplayManager;
    coordDisplay: CoordDisplay;
    
    constructor() {
        this.waypointDisplayManager = new WaypointDisplayManager();
        this.navigationDisplayManager = new NavigationDisplayManager();

        this.coordDisplay = new CoordDisplay();
        this.coordDisplay.show();

        eventBus.on("map:load", (payload) => {
            this.hideAll();
        });
    }

    hideAll() {
        this.waypointDisplayManager.hideAll();
        this.navigationDisplayManager.hide();
    }
}