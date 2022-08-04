/* tslint:disable */
/* eslint-disable */
/**
 */
export enum TickType {
	Cross,
	Nought,
	Nil
}
/**
 */
export enum Player {
	Crosses,
	Noughts
}
/**
 */
export class TicTacToe {
	free(): void;
	/**
	 * @returns {number}
	 */
	get_player(): number;
	/**
	 * @param {number} player
	 * @returns {TicTacToe}
	 */
	static new(player: number): TicTacToe;
	/**
	 * @returns {any}
	 */
	get_board(): any;
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	place_mark(x: number, y: number): void;
	/**
	 * @returns {number}
	 */
	win_condition(): number;
}

export type InitInput =
	| RequestInfo
	| URL
	| Response
	| BufferSource
	| WebAssembly.Module;

export interface InitOutput {
	readonly memory: WebAssembly.Memory;
	readonly __wbg_tictactoe_free: (a: number) => void;
	readonly tictactoe_get_player: (a: number) => number;
	readonly tictactoe_new: (a: number) => number;
	readonly tictactoe_get_board: (a: number) => number;
	readonly tictactoe_place_mark: (a: number, b: number, c: number) => void;
	readonly tictactoe_win_condition: (a: number) => number;
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
