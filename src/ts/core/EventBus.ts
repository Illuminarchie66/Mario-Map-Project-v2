import { Waypoint } from "../map/waypoints/Waypoint";
import { MapView } from "../map/maps/Map";
import { _Map } from "../map/maps/Map";

type EventMap = {
    "waypoint:click": Waypoint;                              // when you click on a waypoint
    "waypoint:close": {};                                    // when you close a waypoint popup
    "map:load": { id: string, view?: MapView };              // when you request a map load
    "map:loaded": { id: string, view?: MapView, map: _Map }; // when the map has finished loading
    "map:click": {};                                         // when you click on the map - not drag
    "map:mousemove": { lat: number, lng: number };           // when you move the mouse over the map
    "map:zoom": { zoom: number };                            // when you zoom the map
    "popup:show": L.Popup;                                   // when you request to show a popup 
    "popup:hide": L.Popup;                                   // when you request to hide a popup
};

/*
https://dev.to/mohsenfallahnjd/javascript-event-bus-js-typescript-17jp
Implementation by Mohsen Fallahnejad, of a simple event bus in typescript.
on listens for an event.
off removes a listener for an event.
once listens for an event only once, and then removes the listener.
emit emits an event with a payload.
*/

class EventBus<E extends Record<string, any>> {
    private listeners: { [K in keyof E]?: Set<(p: E[K]) => void> } = {};

    on<K extends keyof E>(event: K, cb: (payload: E[K]) => void) {
        (this.listeners[event] ||= new Set()).add(cb);
        return () => this.off(event, cb);
    }

    once<K extends keyof E>(event: K, cb: (payload: E[K]) => void) {
        const off = this.on(event, (p) => { 
            off(); 
            cb(p)
        });
        return off;
    }

    off<K extends keyof E>(event: K, cb: (payload: E[K]) => void) {
        const set = this.listeners[event]; 
        if (!set) return;

        set.delete(cb); 
        if (set.size === 0) 
            delete this.listeners[event];
    }

    emit<K extends keyof E>(event: K, payload: E[K]) {
        const call = (set?: Set<(p: any) => void>) => set?.forEach(fn => fn(payload));
        call(this.listeners[event]);
    }
}

const eventBus = new EventBus<EventMap>();

export { eventBus, EventBus, EventMap };