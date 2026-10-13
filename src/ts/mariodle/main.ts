import '../../css/core/fonts.css';
import '../../css/core/main.css';
import '../../css/mariodle/mariodle.css';

import { Game, GameRegistry } from "../core/gsot/Game";
import { Character, CharacterRegistry } from "../core/gsot/Character";
import { getPortableURL } from '../core/Loader';

export const gameRegistry = await GameRegistry.create();
export const characterRegistry = await CharacterRegistry.create();

const target = characterRegistry.getById("mario");

class SearchBar {
    searchInput!: HTMLInputElement;
    optionsContainer!: HTMLElement;
    options: HTMLElement[];

    constructor() {
        this.searchInput = document.getElementById('character-search-input') as HTMLInputElement;
        this.optionsContainer = document.getElementById('character-options') as HTMLElement;
        this.options = [];
        
        const characters = characterRegistry.getAll();
        characters.forEach(c => {
            const li = document.createElement("li");
            li.style.display = "none";
            li.addEventListener('click', (e) => {
                console.log(c.id);
                const guess = characterRegistry.getById(c.id);
                const attempt = new Attempt(guess, target);
                attempt.render()
            });

            const image = document.createElement("img");
            image.src = c.imageLink || getPortableURL("/assets/core/images/black_default.jpg")
            const text = document.createElement("p");
            text.innerText = c.name;
            li.appendChild(image);
            li.appendChild(text);

            this.optionsContainer.append(li);
            this.options.push(li);
        });

        this.searchInput.addEventListener('input', (e) => {
            this.search();
        });
    }

    search() {
        let txtValue;
        const filter = this.searchInput.value.toUpperCase();
        this.options.forEach(li => {
            txtValue = li.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1 && filter !== "") {
                li.style.display = "flex"
            } else {
                li.style.display = "none"
            }
        });
    }
}

const search = new SearchBar();

function getEarliestReleaseYear(game: Game): number {
    if (!game.releases) 
        throw new Error(`No releases for game ${game.id}.`)
    if (game.releases.length === 0) 
        throw new Error(`No releases for game ${game.id}.`)
    
    let minYear = Number.MAX_VALUE;
    game.releases.forEach(rel => {
        if (rel.date !== "Unknown") {
            const parts = rel.date.split("/");
            const year = parseInt(parts[2], 10)
            if (year < minYear) {
                minYear = year;
            }
        } 
    });

    if (minYear === Number.MAX_VALUE)
        throw new Error(`All dates are unknown.`)

    return minYear;
}

function intersect<T>(a: T[], b: T[]): T[] {
    var t;
    if (b.length > a.length) t = b, b = a, a = t;
    return a
        .filter(function (e) {
            return b.indexOf(e) > -1;
        })
        .filter(function (e, i, c) {
            return c.indexOf(e) === i;
        });
}


enum AttemptResult {
    correct,
    incorrect,
    partial
}

enum AttemptResultYear {
    before,
    after,
    equal
}

class Attempt {
    guessBody!: HTMLElement;
    guess: Character;

    resultClassMap: {[index: number]: string} = {
        [AttemptResult.correct]: "correct",
        [AttemptResult.incorrect]: "incorrect",
        [AttemptResult.partial]: "partial",
    }

    meta: {
        name: string
    };

    firstAppearance: {
        value: string,
        result: AttemptResult 
    };

    firstAppearanceYear: {
        value: number,
        result: AttemptResultYear
    };

    lastAppearance: {
        value: string,
        result: AttemptResult
    };

    species: {
        value: string,
        result: AttemptResult
    }

    colors: {
        value: string[],
        result: AttemptResult
    };

    allegiances: {
        value: string[],
        result: AttemptResult

    };

    playable: {
        value: string,
        result: AttemptResult
    }

    constructor(guess: Character, target: Character) {
        this.guessBody = document.getElementsByClassName("guesses-table-body")[0] as HTMLElement;

        this.guess = guess;

        this.meta = {
            name: guess.name
        }

        // First Appearance Game
        if (guess.firstAppearance.id === target.firstAppearance.id) {
            this.firstAppearance = {
                value: guess.firstAppearance.name,
                result: AttemptResult.correct
            }
        } else {
            this.firstAppearance = {
                value: guess.firstAppearance.name,
                result: AttemptResult.incorrect
            }
        }

        // First Appearance Year
        const guessYear = getEarliestReleaseYear(guess.firstAppearance);
        const targetYear = getEarliestReleaseYear(target.firstAppearance);
        if (guessYear === targetYear) {
            this.firstAppearanceYear = {
                value: guessYear,
                result: AttemptResultYear.equal
            }
        } else {
            if (guessYear < targetYear) {
                this.firstAppearanceYear = {
                    value: guessYear,
                    result: AttemptResultYear.after
                }
            } else {
                this.firstAppearanceYear = {
                    value: guessYear,
                    result: AttemptResultYear.before
                }
            }
        }

        // Last Appearance Game
        if (guess.lastAppearance.id === target.lastAppearance.id) {
            this.lastAppearance = {
                value: guess.lastAppearance.name,
                result: AttemptResult.correct
            }
        } else {
            this.lastAppearance = {
                value: guess.lastAppearance.name,
                result: AttemptResult.incorrect
            }
        }

        // Species
        if (guess.species.toUpperCase() === target.species.toUpperCase()) {
            this.species = {
                value: guess.species,
                result: AttemptResult.correct
            }
        } else {
            this.species = {
                value: guess.species,
                result: AttemptResult.incorrect
            }
        }

        // Colors
        const guessColors = (guess.colors || []).map( c => c.toUpperCase());
        const targetColors = (target.colors || []).map( c => c.toUpperCase());
        const intersectionColors = intersect(guessColors, targetColors);
        if (intersectionColors.length === 0) {
            this.colors = {
                value: guessColors || [],
                result: AttemptResult.incorrect
            }
        } else if (intersectionColors.length === targetColors.length) {
            this.colors = {
                value: guessColors || [],
                result: AttemptResult.correct
            }
        } else {
            this.colors = {
                value: guessColors || [],
                result: AttemptResult.partial
            }
        }

        // Allegiance
        const guessAllegiances = (guess.allegiances || []).map( c => c.toUpperCase())
        const targetAllegiances = (target.allegiances || []).map( c => c.toUpperCase())
        const intersectionAllegiances = intersect(guessAllegiances, targetAllegiances);
        if (intersectionAllegiances.length === 0) {
            this.allegiances = {
                value: guessAllegiances || [],
                result: AttemptResult.incorrect
            }
        } else if (intersectionAllegiances.length === targetAllegiances.length) {
            this.allegiances = {
                value: guessAllegiances || [],
                result: AttemptResult.correct
            }
        } else {
            this.allegiances = {
                value: guessAllegiances || [],
                result: AttemptResult.partial
            }
        }

        // Playable
        if (guess.playable === target.playable) {
            this.playable = {
                value: "True",
                result: AttemptResult.correct
            };
        } else {
            this.playable = {
                value: "True",
                result: AttemptResult.incorrect
            };
        }
    }

    render() {
        const row = document.createElement('div');
        row.classList = "guesses-row";
        
        const meta = document.createElement('div');
        meta.innerText = this.meta.name
        row.appendChild(meta);

        const species = document.createElement('div');
        species.classList = this.resultClassMap[this.species.result];
        species.innerText = this.species.value;
        row.appendChild(species);

        const colors = document.createElement('div');
        colors.classList = this.resultClassMap[this.colors.result];
        colors.innerText = this.colors.value.join(", ");
        row.appendChild(colors);

        const allegiances = document.createElement('div');
        allegiances.classList = this.resultClassMap[this.allegiances.result];
        allegiances.innerText = this.allegiances.value.join(", ");
        row.appendChild(allegiances);

        const playable = document.createElement('div');
        playable.classList = this.resultClassMap[this.playable.result];
        playable.innerText = this.playable.value;
        row.appendChild(playable);

        const firstGame = document.createElement('div');
        firstGame.classList = this.resultClassMap[this.firstAppearance.result];
        firstGame.innerText = this.firstAppearance.value;
        row.appendChild(firstGame);

        const lastGame = document.createElement('div');
        lastGame.classList = this.resultClassMap[this.lastAppearance.result];
        lastGame.innerText = this.lastAppearance.value;
        row.appendChild(lastGame);

        const originYear = document.createElement('div');
        //originYear.classList = this.resultClassMap[this.firstAppearanceYear.result]
        originYear.innerText = this.firstAppearanceYear.value.toString();
        row.appendChild(originYear);

        this.guessBody.prepend(row);
    }

}
