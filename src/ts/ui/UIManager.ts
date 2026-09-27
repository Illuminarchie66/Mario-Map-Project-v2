import '../../css/ui/panels/panels.css'

import { WaypointDisplayManager } from './waypointdisplay/WaypointDisplayManager';
import { CoordDisplay } from './modals/CoordDisplay';
import { PanelManager } from './panels/PanelManager';
import { eventBus } from '../core/EventBus';
import { NavBar } from './NavBar';

/*
Central manager of the UI. This handles the waypoint display, panel display, navbar and coordinate display. 
It also listens for events to hide all panels and waypoints when a new map is loaded.
*/
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

        eventBus.on("map:loaded", (payload) => {
            this.hideAll();
        });
    }

    hideAll() {
        this.waypointDisplayManager.hideAll();
        this.panelManager.hideCurrentPanel();
    }
}