import { WaypointDisplayManager } from './waypointdisplay/WaypointDisplayManager';
import { CoordDisplay } from './modals/CoordDisplay';
import { PanelManager } from './panels/PanelManager';
import { eventBus } from '../core/EventBus';
import { NavBar } from './NavBar';

export class UIManager {
    navBar: NavBar;
    waypointDisplayManager: WaypointDisplayManager;
    panelManager: PanelManager;
    coordDisplay: CoordDisplay;
    
    constructor() {
        this.waypointDisplayManager = new WaypointDisplayManager();
        this.panelManager = new PanelManager();
        this.navBar = new NavBar(this.panelManager);

        this.coordDisplay = new CoordDisplay();
        this.coordDisplay.show();

        eventBus.on("map:load", (payload) => {
            this.hideAll();
        });
    }

    hideAll() {
        this.waypointDisplayManager.hideAll();
        this.panelManager.hideCurrentPanel();
    }
}