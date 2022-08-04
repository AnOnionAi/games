import type { State } from '$lib/types/chess';
import init, { ChessEngine } from 'chess';

const DEFAULT_BOARD: number[][] = [
	[-3, -5, -4, -2, -1, -4, -5, -3],
	[-6, -6, -6, -6, -6, -6, -6, -6],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[6, 6, 6, 6, 6, 6, 6, 6],
	[3, 5, 4, 2, 1, 4, 5, 3]
];

/**
 * The chess class
 */
export default class ChessEnv {
	board: number[][];
	engine: ChessEngine;
	state: State;

	/**
	 * init wasm
	 * @return {void} it just init.
	 */
	public static async initWasm() {
		await init();
	}

	/**
	 * constructor
	 */
	constructor() {
		this.engine = ChessEngine.new();
		this.state = {
			black_king_castle_is_possible: true,
			black_king_is_checked: false,
			black_king_on_board: false,
			black_queen_castle_is_possible: true,
			board: DEFAULT_BOARD,
			current_player: 'White',
			white_king_castle_is_possible: true,
			white_king_is_checked: false,
			white_king_on_board: false,
			white_queen_castle_is_possible: true
		};
	}

	/**
	 * It returns the current player.
	 * @return {string} the current player.
	 */
	public getCurrentPlayer() {
		return this.state.current_player;
	}

	/**
	 * It returns the current state.
	 * @return {State} the current state.
	 */
	public getState(): State {
		return this.state;
	}

	/**
	 * It returns the possilbe moves.
	 * @return {string[]} array with the possible moves. e.g: ["a3a4", "f1f2"].
	 */
	public getPossibleMoves() {
		return this.engine.get_possible_moves(
			this.state,
			this.state.current_player.toUpperCase(),
			false
		);
	}

	/**
	 * Call the next_state functions from wasm to update the state.
	 * @param {string} move the move.
	 */
	public nextState(move: string) {
		this.state = this.engine.next_state(
			this.state,
			this.state.current_player.toUpperCase(),
			move
		);
	}

	/**
	 * Call the in_threefold_repetition function
	 * @param {State[]} states .
	 * @return {boolean} true if there is threefold repetition
	 */
	public threefoldRepetition(states: State[]): boolean {
		return this.engine.in_threefold_repetition(states);
	}

	/**
	 * Call the checkmate function
	 * @return {boolean} true if there is checkmate
	 */
	public checkmate(): boolean {
		return this.engine.checkmate(
			this.state,
			this.state.current_player.toUpperCase()
		);
	}

	/**
	 * Call the in_stalemate function
	 * @return {boolean} true if there is in_stalemate
	 */
	public inStalemate(): boolean {
		return this.engine.in_stalemate(
			this.state,
			this.state.current_player.toUpperCase()
		);
	}

	/**
	 * Call the insufficient_material function
	 * @return {boolean} true if there is insufficient_material
	 */
	public insufficientMaterial(): boolean {
		return this.engine.insufficient_material(this.state);
	}

	/**
	 * (pawn = "P", knight = "N", bishop = "B", rook = "R", queen = "Q" and king = "K").
	 * White pieces are designated using upper-case letters ("PNBRQK") while black pieces
	 * use lowercase ("pnbrqk"). Empty squares are noted using digits 1 through
	 * 8 (the number of empty squares), and "/" separates ranks.
	 * @return {string} fen the actual fen.
	 */
	public fen(): string {
		let nil = 0;
		let fen = '';
		const PIECE_OFFSETS = {
			'6': 'P',
			'-6': 'p',
			'5': 'N',
			'-5': 'n',
			'4': 'B',
			'-4': 'b',
			'3': 'R',
			'-3': 'r',
			'2': 'Q',
			'-2': 'q',
			'1': 'K',
			'-1': 'k'
		};

		const ChessBoard = this.state.board;

		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (ChessBoard[i][j] === 0) {
					nil++;
				} else {
					if (nil > 0) {
						fen += nil;
						nil = 0;
					}

					const piece = PIECE_OFFSETS[ChessBoard[i][j].toString()];
					fen += piece;
				}
			}
			if (nil > 0) {
				fen += nil;
			}
			fen += '/';
			nil = 0;
		}
		return fen.slice(0, fen.length - 1);
	}

	/**
	 * It returns the actual board.
	 * @return {number[]} array with the pieces positions.
	 */
	public getBoard() {
		return this.engine.get_board(this.state);
	}

	/**
	 * It checks if there is a promotion.
	 * @param {any} chess the chess object.
	 * @param {{ from: string, to: string }} move the move.
	 * @return {string | null} The move if there is a promotion.
	 */
	public isPromotion({ from, to }) {
		const board = this.state.board;

		const fromX = from.charCodeAt(0) - 97;
		const fromY = 7 - parseInt(from[1]) + 1;

		const toX = to.charCodeAt(0) - 97;

		// it's a black pawn
		if (board[fromX][fromY] === -6) {
			if (toX === 7) {
				return true;
			}
		}

		// it's a white pawn
		if (board[fromX][fromY] === 6) {
			if (toX === 0) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Search for the king position.
	 * @param {string} color The player color.
	 * @return {string} The king position.
	 */
	public getKingPosition(color: string) {
		const { board } = this.state as any;
		console.log(board);
		const king = color === 'w' ? 1 : -1;
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j] === king) {
					// 97 = a          - e.g: a4
					return String.fromCharCode(97 + j) + (7 - i + 1);
				}
			}
		}
	}
}
