import z from 'zod';
import { Game } from "./Game";
import { gameRegistry } from "../../mariodle/main";
import { loadData } from "../Loader";
import { Registry } from '../Registry';

const CharacterSchema = z.object({
    id: z.string(),
    name: z.string(),
    species: z.string(),
    description: z.string().optional(),
    link: z.string().optional(),
    imageLink: z.string().optional(),
    firstAppearance: z.string(),
    lastAppearance: z.string().optional(),
    colors: z.array(z.string()).optional(),
    allegiances: z.array(z.string()).optional(),
    playable: z.boolean().optional(),
    tags: z.array(z.string())
});
export type CharacterData = z.infer<typeof CharacterSchema>;

export class Character {
    id: string;
    name: string;
    species: string;
    description?: string;
    link?: string;
    imageLink?: string;
    firstAppearance: Game;
    lastAppearance?: Game;
    colors?: string[];
    allegiances?: string[];
    playable?: boolean;
    tags: string[];

    constructor(data: CharacterData) {
        this.id = data.id;
        this.name = data.name;
        this.species = data.species;
        this.description = data.description;
        this.link = data.link;
        this.imageLink = data.imageLink;
        this.firstAppearance = gameRegistry.getById(data.firstAppearance) as Game;
        this.lastAppearance = data.lastAppearance ? gameRegistry.getById(data.lastAppearance) : undefined;
        this.colors = data.colors;
        this.allegiances = data.allegiances;
        this.playable = data.playable;
        this.tags = data.tags;
    }
}

export class CharacterRegistry extends Registry<Character> {
    constructor(characters: Character[]) {
        super();
        characters.forEach(character => {
            this.register(character.id, character);
        });
    }

    static async create(): Promise<CharacterRegistry> {
        const data = await loadData<CharacterData[]>("/data/gsot/characters.json5");
        const characters = data?.map(item => new Character(item)) || [];
        return new CharacterRegistry(characters);
    }
}