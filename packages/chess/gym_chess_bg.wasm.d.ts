/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function __wbg_state_free(a: number): void;
export function __wbg_get_state_current_player(a: number): number;
export function __wbg_set_state_current_player(a: number, b: number): void;
export function __wbg_get_state_white_king_on_board(a: number): number;
export function __wbg_set_state_white_king_on_board(a: number, b: number): void;
export function __wbg_get_state_black_king_on_board(a: number): number;
export function __wbg_set_state_black_king_on_board(a: number, b: number): void;
export function __wbg_get_state_white_king_castle_is_possible(
	a: number
): number;
export function __wbg_set_state_white_king_castle_is_possible(
	a: number,
	b: number
): void;
export function __wbg_get_state_white_queen_castle_is_possible(
	a: number
): number;
export function __wbg_set_state_white_queen_castle_is_possible(
	a: number,
	b: number
): void;
export function __wbg_get_state_black_king_castle_is_possible(
	a: number
): number;
export function __wbg_set_state_black_king_castle_is_possible(
	a: number,
	b: number
): void;
export function __wbg_get_state_black_queen_castle_is_possible(
	a: number
): number;
export function __wbg_set_state_black_queen_castle_is_possible(
	a: number,
	b: number
): void;
export function __wbg_get_state_white_king_is_checked(a: number): number;
export function __wbg_set_state_white_king_is_checked(
	a: number,
	b: number
): void;
export function __wbg_get_state_black_king_is_checked(a: number): number;
export function __wbg_set_state_black_king_is_checked(
	a: number,
	b: number
): void;
export function __wbg_chessengine_free(a: number): void;
export function chessengine_new(): number;
export function chessengine_next_state(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number
): number;
export function chessengine_get_possible_moves(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number
): number;
export function chessengine_in_threefold_repetition(
	a: number,
	b: number
): number;
export function chessengine_checkmate(
	a: number,
	b: number,
	c: number,
	d: number
): number;
export function chessengine_in_stalemate(
	a: number,
	b: number,
	c: number,
	d: number
): number;
export function chessengine_insufficient_material(a: number, b: number): number;
export function chessengine_get_castle_moves(
	a: number,
	b: number,
	c: number,
	d: number
): number;
export function chessengine_get_board(a: number, b: number): number;
export function __wbindgen_malloc(a: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number): number;
export function __wbindgen_free(a: number, b: number): void;
