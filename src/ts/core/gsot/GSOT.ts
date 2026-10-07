import z from 'zod';
import { Game, gameRegistry } from "./Game";
import { loadData } from "../Loader";

const MarioEntitySchema = z.object({
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
export type MarioEntityData = z.infer<typeof MarioEntitySchema>;

export class MarioEntity {
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

    constructor(data: MarioEntityData) {
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
