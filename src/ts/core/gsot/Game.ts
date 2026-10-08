import z from 'zod';
import { loadData } from "../Loader";
import { Registry } from "../Registry";

const GameDataSchema = z.object({
    id: z.string(),
    name: z.string(),
    link: z.string().optional(),
    console: z.object({
        link: z.string().optional(),
        name: z.string()
    }).optional(),
    releases: z.array(z.object({
        region: z.string(),
        date: z.string()
    })).optional(),
    developers: z.array(z.object({
        link: z.string().optional(),
        name: z.string()
    })).optional(),
    tags: z.array(z.string()).optional()
});
export type GameData = z.infer<typeof GameDataSchema>;

export class Game {
    id: string;
    name: string;
    link?: string;
    console?: {
        link?: string;
        name: string;
    };
    releases?: {
            region: string;
            date: string;
        }[];
    developers?: {
            link?: string;
            name: string;
        }[];
    tags?: string[];

    constructor(data: GameData) {
        this.id = data.id;
        this.name = data.name;
        this.link = data.link;
        this.console = data.console;
        this.releases = data.releases;
        this.developers = data.developers;
        this.tags = data.tags;
    }
}

export class GameRegistry extends Registry<Game> {
    constructor(games: Game[]) {
        super();
        games.forEach(game => {
            this.register(game.id, game);
        });
    }

    static async create(): Promise<GameRegistry> {
        const data = await loadData<GameData[]>("/data/gsot/games.json5");
        const games = data?.map(item => new Game(item)) || [];
        return new GameRegistry(games);
    }
}