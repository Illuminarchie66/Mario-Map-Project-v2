import { RNG } from "./RNG"

export abstract class Registry<T> {

    private readonly items: Record<string, T> = {};

    register(id: string, item: T): void {
        if (this.items[id]) {
            throw new Error(`Item with id "${id}" is already registered.`);
        }
        this.items[id] = item;
    }

    getById(id: string): T {
        const item = this.items[id];
        if (!item) {
            throw new Error(`Item with id "${id}" not found in registry.`);
        }
        return item;
    }

    getAll(): T[] {
        return Object.values(this.items);
    }

    containsId(id: string): boolean {
        return !!this.items[id];
    }

    getRandom(blacklist?: Set<string>, rng?: RNG): T {
        let keys = Object.keys(this.items)
        if (blacklist !== undefined) {
            keys = keys.filter(id => { return !blacklist.has(id); });
        }

        if (rng !== undefined)
            return this.items[rng.getRandomElement(keys)]; 
        
        return this.items[keys[Math.floor(Math.random()*keys.length)]];
    }
}