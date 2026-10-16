import { Game } from "../core/gsot/Game";
import { Character } from "../core/gsot/Character";
import { getPortableURL } from "../core/Loader";

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

export class Attempt {
    guessBody!: HTMLElement;
    guess: Character;

    resultClassMap: {[index: number]: string} = {
        [AttemptResult.correct]: "correct",
        [AttemptResult.incorrect]: "incorrect",
        [AttemptResult.partial]: "partial",
    }

    meta: {
        name: string,
        link: string,
        imageLink: string
    };

    firstAppearance: {
        value: string,
        result: AttemptResult,
        link: string 
    };

    firstAppearanceYear: {
        value: number,
        result: AttemptResultYear
    };

    lastAppearance: {
        value: string,
        result: AttemptResult,
        link: string
    };

    species: {
        value: string[],
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
            name: guess.name,
            link: guess.link || "",
            imageLink: guess.imageLink || ""
        }

        // First Appearance Game
        if (guess.firstAppearance.id === target.firstAppearance.id) {
            this.firstAppearance = {
                value: guess.firstAppearance.name,
                result: AttemptResult.correct,
                link: guess.firstAppearance.link || ""
            }
        } else {
            this.firstAppearance = {
                value: guess.firstAppearance.name,
                result: AttemptResult.incorrect,
                link: guess.firstAppearance.link || ""
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
                result: AttemptResult.correct,
                link: guess.lastAppearance.link || ""
            }
        } else {
            this.lastAppearance = {
                value: guess.lastAppearance.name,
                result: AttemptResult.incorrect,
                link: guess.lastAppearance.link || ""
            }
        }

        // Species
        this.species = this.arrayCorrectness(guess.species, target.species)

        // Colors
        this.colors = this.arrayCorrectness(guess.colors, target.colors)

        // Allegiance
        this.allegiances = this.arrayCorrectness(guess.allegiances, target.allegiances)

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

    arrayCorrectness(guess: string[], target: string[]): {value: string[], result: AttemptResult} {
        const guessUpper = (guess || []).map( c => c.toUpperCase())
        const targetUpper = (target || []).map( c => c.toUpperCase())
        const intersection = intersect(guessUpper, targetUpper);
        if (intersection.length === 0) {
            return {
                value: guess || [],
                result: AttemptResult.incorrect
            }
        } else if ((intersection.length === target.length) && (intersection.length === guess.length)) {
            return {
                value: guess || [],
                result: AttemptResult.correct
            }
        } else {
            return {
                value: guess || [],
                result: AttemptResult.partial
            }
        }
    }

    render() {
        const row = document.createElement('div');
        row.classList = "guesses-row";
        
        const meta = document.createElement('div');
        meta.classList = "guesses-meta";
        const image = document.createElement("img");
        image.src = this.meta.imageLink || getPortableURL("/assets/core/images/black_default.jpg")
        const text = document.createElement("a");
        text.href = this.meta.link;
        text.target = "_blank";
        text.rel = "noopener noreferrer";
        text.innerText = this.meta.name;
        meta.appendChild(image);
        meta.appendChild(text);
        meta.title = this.meta.name;
        row.appendChild(meta);

        const species = document.createElement('div');
        species.classList = this.resultClassMap[this.species.result];
        species.innerText = this.species.value.join(", ");
        species.title = this.species.value.join(", ");
        row.appendChild(species);

        const colors = document.createElement('div');
        colors.classList = this.resultClassMap[this.colors.result];
        colors.innerText = this.colors.value.join(", ");
        colors.title = `Main Colors: ${this.colors.value.join(", ")}`;
        row.appendChild(colors);

        const allegiances = document.createElement('div');
        allegiances.classList = this.resultClassMap[this.allegiances.result];
        allegiances.innerText = this.allegiances.value.join(", ");
        allegiances.title = `Allegiances: ${this.allegiances.value.join(", ")}`;
        row.appendChild(allegiances);

        const playable = document.createElement('div');
        playable.classList = this.resultClassMap[this.playable.result];
        playable.innerText = this.playable.value;
        playable.title = this.playable.value === "True" ? "Playable" : "Not Playable";
        row.appendChild(playable);

        const firstGame = document.createElement('div');
        firstGame.classList = this.resultClassMap[this.firstAppearance.result];
        const firstGameLink = document.createElement("a");
        firstGameLink.href = this.firstAppearance.link;
        firstGameLink.innerText = this.firstAppearance.value;
        firstGameLink.target = "_blank";
        firstGameLink.rel = "noopener noreferrer";
        firstGame.appendChild(firstGameLink);
        firstGame.title = `First Appeared In: ${this.firstAppearance.value}`;
        row.appendChild(firstGame);

        const lastGame = document.createElement('div');
        lastGame.classList = this.resultClassMap[this.lastAppearance.result];
        const lastGameLink = document.createElement("a");
        lastGameLink.href = this.lastAppearance.link;
        lastGameLink.innerText = this.lastAppearance.value;
        lastGameLink.target = "_blank";
        lastGameLink.rel = "noopener noreferrer";
        lastGame.appendChild(lastGameLink);
        lastGame.title = `Last Appeared In: ${this.lastAppearance.value}`;
        row.appendChild(lastGame);

        const originYear = document.createElement('div');
        if (this.firstAppearanceYear.result === AttemptResultYear.equal) {
            originYear.classList = "correct";
            originYear.innerText = this.firstAppearanceYear.value.toString();
            originYear.title = this.firstAppearanceYear.value.toString();
        } else {
            const yearContainer = document.createElement('div');
            yearContainer.classList = "cell-container"
            const bgImg = document.createElement('img');
            bgImg.classList = "cell-bg-image incorrect"
            bgImg.src = "/assets/icons/up-arrow.svg"
            if (this.firstAppearanceYear.result === AttemptResultYear.before) {
                bgImg.classList += " before";
                bgImg.alt = "Down Arrow"
                originYear.title = `Before ${this.firstAppearanceYear.value.toString()}`;
            } else {
                bgImg.classList += " after";
                bgImg.alt = "Up Arrow"
                originYear.title = `After ${this.firstAppearanceYear.value.toString()}`;
            }

            const content = document.createElement('div')
            content.classList = "cell-content"
            content.innerText = this.firstAppearanceYear.value.toString();
            yearContainer.appendChild(bgImg);
            yearContainer.appendChild(content);
            
            originYear.classList = "incorrect";
            originYear.appendChild(yearContainer);
        }
        row.appendChild(originYear);

        this.guessBody.prepend(row);
    }

}
