// game.js
export class Game { /* 游戏核心逻辑 */ }

// ui.js
export function renderBoard(boardData) { /* 渲染界面 */ }

// main.js
import { Game } from './game.js';
import { renderBoard } from './ui.js';
const game = new Game(...);
renderBoard(game.getBoard());
