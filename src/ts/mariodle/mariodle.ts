import { Character } from "../core/gsot/Character";
import { characterRegistry } from "./main";
import { Attempt } from "./Attempt"
import { RNG } from "../core/RNG"

export class Mariodle {
    private target: Character

    constructor() {
        const date = new Date();
        const rng = new RNG();
        this.target = characterRegistry.getRandom(undefined, rng);
    }

    generateNewTargetByDate(n: number): Character {
        const date = new Date();
        
        date.setDate(date.getDate() - n);
        const blacklist = new Set<string>();

        let rng, c;
        while (blacklist.size < n) {
            rng = new RNG(date);
            c = characterRegistry.getRandom(blacklist, rng);
            console.log(date, c.name);
            date.setDate(date.getDate() + 1);
            blacklist.add(c.id);
        }
        return characterRegistry.getRandom(blacklist, new RNG(date));
    }

    guess(character: Character) {
        const attempt = new Attempt(character, this.target);
        attempt.render()
    }
}