import '../../css/core/fonts.css';
import '../../css/core/main.css';
import '../../css/mariodle/mariodle.css';

import { GameRegistry } from "../core/gsot/Game";
import { CharacterRegistry } from "../core/gsot/Character";

import { SearchBar } from './SearchBar';
import { Mariodle } from './mariodle';

export const gameRegistry = await GameRegistry.create();
export const characterRegistry = await CharacterRegistry.create();

const mariodle = new Mariodle();
const search = new SearchBar(mariodle);