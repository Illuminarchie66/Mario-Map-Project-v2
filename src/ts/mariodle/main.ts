import '../../css/core/main.css';
import '../../css/mariodle/mariodle.css';

import { GameRegistry } from "../core/gsot/Game";
// import { CharacterRegistry } from "../core/gsot/GSOT";

export const gameRegistry = await GameRegistry.create();
//export const characterRegistry = await CharacterRegistry.create();
console.log(gameRegistry.getAll().map(game => game.id));