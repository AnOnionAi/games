/* tslint:disable */
/* eslint-disable */
/**
 */
export enum Color {
	White,
	Black
}
/**
 */
export class ChessEngine {
	free(): void;
	/**
	 * @returns {ChessEngine}
	 */
	static new(): ChessEngine;
	/**
	 * @param {any} state_js
	 * @param {string} _player
	 * @param {string} _move
	 * @returns {any}
	 */
	next_state(state_js: any, _player: string, _move: string): any;
	/**
	 * @param {any} state_js
	 * @param {string} _player
	 * @param {boolean} attack
	 * @returns {any}
	 */
	get_possible_moves(state_js: any, _player: string, attack: boolean): any;
	/**
	 * @param {any} states_js
	 * @returns {any}
	 */
	in_threefold_repetition(states_js: any): any;
	/**
	 * @param {any} state_js
	 * @param {string} _player
	 * @returns {any}
	 */
	checkmate(state_js: any, _player: string): any;
	/**
	 * @param {any} state_js
	 * @param {string} _player
	 * @returns {any}
	 */
	in_stalemate(state_js: any, _player: string): any;
	/**
	 * @param {any} state_js
	 * @returns {any}
	 */
	insufficient_material(state_js: any): any;
	/**
	 * @param {any} state_js
	 * @param {string} _player
	 * @returns {any}
	 */
	get_castle_moves(state_js: any, _player: string): any;
	/**
	 * @param {any} state_js
	 * @returns {any}
	 */
	get_board(state_js: any): any;
}
/**
 */
export class State {
	free(): void;
	/**
	 * @returns {boolean}
	 */
	black_king_castle_is_possible: boolean;
	/**
	 * @returns {boolean}
	 */
	black_king_is_checked: boolean;
	/**
	 * @returns {boolean}
	 */
	black_king_on_board: boolean;
	/**
	 * @returns {boolean}
	 */
	black_queen_castle_is_possible: boolean;
	/**
	 * @returns {number}
	 */
	current_player: number;
	/**
	 * @returns {boolean}
	 */
	white_king_castle_is_possible: boolean;
	/**
	 * @returns {boolean}
	 */
	white_king_is_checked: boolean;
	/**
	 * @returns {boolean}
	 */
	white_king_on_board: boolean;
	/**
	 * @returns {boolean}
	 */
	white_queen_castle_is_possible: boolean;
}

export type InitInput =
	| RequestInfo
	| URL
	| Response
	| BufferSource
	| WebAssembly.Module;

export interface InitOutput {
	readonly memory: WebAssembly.Memory;
	readonly __wbg_state_free: (a: number) => void;
	readonly __wbg_get_state_current_player: (a: number) => number;
	readonly __wbg_set_state_current_player: (a: number, b: number) => void;
	readonly __wbg_get_state_white_king_on_board: (a: number) => number;
	readonly __wbg_set_state_white_king_on_board: (a: number, b: number) => void;
	readonly __wbg_get_state_black_king_on_board: (a: number) => number;
	readonly __wbg_set_state_black_king_on_board: (a: number, b: number) => void;
	readonly __wbg_get_state_white_king_castle_is_possible: (a: number) => number;
	readonly __wbg_set_state_white_king_castle_is_possible: (
		a: number,
		b: number
	) => void;
	readonly __wbg_get_state_white_queen_castle_is_possible: (
		a: number
	) => number;
	readonly __wbg_set_state_white_queen_castle_is_possible: (
		a: number,
		b: number
	) => void;
	readonly __wbg_get_state_black_king_castle_is_possible: (a: number) => number;
	readonly __wbg_set_state_black_king_castle_is_possible: (
		a: number,
		b: number
	) => void;
	readonly __wbg_get_state_black_queen_castle_is_possible: (
		a: number
	) => number;
	readonly __wbg_set_state_black_queen_castle_is_possible: (
		a: number,
		b: number
	) => void;
	readonly __wbg_get_state_white_king_is_checked: (a: number) => number;
	readonly __wbg_set_state_white_king_is_checked: (
		a: number,
		b: number
	) => void;
	readonly __wbg_get_state_black_king_is_checked: (a: number) => number;
	readonly __wbg_set_state_black_king_is_checked: (
		a: number,
		b: number
	) => void;
	readonly __wbg_chessengine_free: (a: number) => void;
	readonly chessengine_new: () => number;
	readonly chessengine_next_state: (
		a: number,
		b: number,
		c: number,
		d: number,
		e: number,
		f: number
	) => number;
	readonly chessengine_get_possible_moves: (
		a: number,
		b: number,
		c: number,
		d: number,
		e: number
	) => number;
	readonly chessengine_in_threefold_repetition: (
		a: number,
		b: number
	) => number;
	readonly chessengine_checkmate: (
		a: number,
		b: number,
		c: number,
		d: number
	) => number;
	readonly chessengine_in_stalemate: (
		a: number,
		b: number,
		c: number,
		d: number
	) => number;
	readonly chessengine_insufficient_material: (a: number, b: number) => number;
	readonly chessengine_get_castle_moves: (
		a: number,
		b: number,
		c: number,
		d: number
	) => number;
	readonly chessengine_get_board: (a: number, b: number) => number;
	readonly __wbindgen_malloc: (a: number) => number;
	readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
	readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export default function init(
	module_or_path?: InitInput | Promise<InitInput>
): Promise<InitOutput>;
