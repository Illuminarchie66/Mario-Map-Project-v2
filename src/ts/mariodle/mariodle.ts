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

    guess(character: Character) {
        const attempt = new Attempt(character, this.target);
        attempt.render()
    }
}