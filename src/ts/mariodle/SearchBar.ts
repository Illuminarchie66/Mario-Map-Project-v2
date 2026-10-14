import { characterRegistry } from './main'
import { Character } from '../core/gsot/Character'
import { getPortableURL } from '../core/Loader';
import { Mariodle } from './mariodle';

export class SearchBar {
    mariodle: Mariodle;

    searchInput!: HTMLInputElement;
    optionsContainer!: HTMLElement;
    options: HTMLElement[];

    constructor(mariodle: Mariodle) {
        this.mariodle = mariodle;

        this.searchInput = document.getElementById('character-search-input') as HTMLInputElement;
        this.optionsContainer = document.getElementById('character-options') as HTMLElement;
        this.options = [];
        
        this.reset();

        this.searchInput.addEventListener('input', (e) => {
            this.search();
        });
    }

    reset() {
        const characters = characterRegistry.getAll();
        characters.forEach(c => {
            const li = document.createElement("li");
            li.addEventListener('click', (e) => {
                this.select(c);
                const idx = this.options.indexOf(li);
                if (idx !== 1) {
                    this.options.splice(idx, 1);
                }
            });

            const image = document.createElement("img");
            image.src = c.imageLink || getPortableURL("/assets/core/images/black_default.jpg")
            const text = document.createElement("p");
            text.innerText = c.name;
            li.appendChild(image);
            li.appendChild(text);

            this.options.push(li);
        });
    }

    search() {
        this.optionsContainer.innerHTML = "";
        const filter = this.searchInput.value.toUpperCase();
        if (filter === "") return;

        const results = this.options
            .filter(li => {
                return li.innerText.toUpperCase().includes(filter);
            })
            .sort((a, b) => {
                if (a.innerText.toUpperCase().indexOf(filter) > b.innerText.toUpperCase().indexOf(filter)) {
                    return 1;
                } else if (a.innerText.toUpperCase().indexOf(filter) < b.innerText.toUpperCase().indexOf(filter)) {
                    return -1;
                } else {
                    if (a.innerText > b.innerText) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            })

        results.forEach(li => {
            this.optionsContainer.appendChild(li);
        })
    }

    select(character: Character) {
        this.searchInput.value = "";
        this.optionsContainer.innerHTML = "";

        this.mariodle.guess(character);
    }
}