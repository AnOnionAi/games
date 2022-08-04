export interface State {
	black_king_castle_is_possible: boolean;
	black_king_is_checked: boolean;
	black_king_on_board: boolean;
	black_queen_castle_is_possible: boolean;
	board: number[][] | boardType;
	current_player: string;
	white_king_castle_is_possible: boolean;
	white_king_is_checked: boolean;
	white_king_on_board: boolean;
	white_queen_castle_is_possible: boolean;
}

interface boardType {
	array_0: number[];
	array_1: number[];
	array_2: number[];
	array_3: number[];
	array_4: number[];
	array_5: number[];
	array_6: number[];
	array_7: number[];
}

// export = { State, boardType };
// module.exports = { State, boardType };
