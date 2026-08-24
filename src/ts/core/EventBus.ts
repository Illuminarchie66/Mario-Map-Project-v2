import { Waypoint } from "../map/Waypoints/Waypoint";

type EventMap = {
    "waypoint:click": Waypoint;
    "map:load-request": { id: string, center?: [number, number], zoom?: number };
};

// https://dev.to/mohsenfallahnjd/javascript-event-bus-js-typescript-17jp
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