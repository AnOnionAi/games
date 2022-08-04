<script lang="ts">
	import {
		Chessboard,
		MARKER_TYPE,
		INPUT_EVENT_TYPE,
		BORDER_TYPE
	} from 'cm-chessboard/src/cm-chessboard/Chessboard';
	import 'cm-chessboard/assets/styles/cm-chessboard.css';

	import { onMount } from 'svelte';
	import type { State } from '$lib/types/chess';
	import ChessEngine from '../../../routes/[...lang=langs]/playground/chess/chess_engine';

	export let engine: ChessEngine;
	export let board;
	export let gameOver = false;
	export let winner = '';
	export let isDraw = false;
	export let reason = '';
	export let moves;
	export let lastSquare = '';
	export let kingMarker = '';
	export let secondMove;
	export let inputHandler = null; // TODO: Set proper default
	export let callbackWinner = null; // TODO: Set proper default

	let states: State[] = [];

	onMount(async () => {
		board = new Chessboard(document.getElementById('board'), {
			position: 'start',
			style: {
				borderType: BORDER_TYPE.frame,
				aspectRatio: 1
			},
			sprite: {
				url: '/svg/chessboard-sprite-staunty.svg'
			}
		});
		board.enableMoveInput(inputHandler);

		await ChessEngine.initWasm();
		engine = new ChessEngine();

		addState(engine.state);
	});

	const addState = (state: State) => {
		states.push(state);
	};

	const markPossibleMoves = (square) => {
		// we dont want to get all posible moves if the square is the same. it's not necessary.
		if (lastSquare === square) return;

		// remove markers except for the king marker
		board.getMarkers().forEach((marker) => {
			if (marker.circle !== kingMarker) {
				board.removeMarkers(marker.square, marker.type);
			}
		});
		lastSquare = square;
		moves = engine.getPossibleMoves();
		// hightlight all possible squares that they are allowed to move to for that piece
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].startsWith(square)) {
				board.addMarker(moves[i].substring(2), {
					class: 'marker-a',
					slice: 'markerSquare'
				});
			}
		}
		return true;
	};

	const isValidMove = (move: string, moves: string[]) => {
		console.log('move', move, 'moves', moves);
		for (let i = 0; i < moves.length; i++) {
			if (move === moves[i]) {
				return true;
			}
		}
		return false;
	};

	const checkWinner = () => {
		if (engine.threefoldRepetition(states)) {
			reason = 'trheefold_repetition';
		}
		if (engine.checkmate()) {
			reason = 'checkmate';
			winner = engine.getCurrentPlayer() === 'WHITE' ? 'black' : 'white';
			gameOver = true;
			callbackWinner();
			board.disableMoveInput();
		}
		if (engine.inStalemate()) {
			reason = 'inStalemate';
			isDraw = true;
			board.disableMoveInput();
		}
		if (engine.insufficientMaterial()) {
			reason = 'insufficient_material';
		}
		console.log('REASON', reason);
	};

	const addKingMarker = () => {
		const { white_king_is_checked, black_king_is_checked } = engine.getState();
		if (white_king_is_checked) {
			console.log('WHITE KING IS CHECKED');
			kingMarker = engine.getKingPosition('w');
			console.log('KING POSITION', kingMarker);
			console.log('MARKER', MARKER_TYPE.circle);
			board.addMarker(kingMarker, MARKER_TYPE.circle);
		} else if (black_king_is_checked) {
			kingMarker = engine.getKingPosition('b');
			board.addMarker(kingMarker, MARKER_TYPE.circle);
		}
	};

	inputHandler = (event) => {
		switch (event.type) {
			case INPUT_EVENT_TYPE.moveStart: {
				markPossibleMoves(event.square);
				return true;
			}
			case INPUT_EVENT_TYPE.moveDone: {
				const move = event.squareFrom + event.squareTo;

				// if it's not a valid move then cancel move
				if (!isValidMove(move, moves)) return false;

				// valid move then update state
				engine.nextState(move);

				board.setPosition(engine.fen());
				board.removeMarkers();

				console.log(engine.state.board);

				// add a marker to a king if it is checked.
				addKingMarker();

				addState(engine.state);

				checkWinner();

				if (secondMove) {
					board.disableMoveInput();
					const validateAfterMove = secondMove();
					if (validateAfterMove) {
						board.enableMoveInput(inputHandler);
						// add a marker to a king if it is checked.
						addKingMarker();
						checkWinner();
					}
				}

				return true;
			}
		}
	};

	const resetGame = () => {
		engine = new ChessEngine();
		board.setPosition('start');
		board.removeMarkers();
		board.enableMoveInput(inputHandler);
		gameOver = false;
		isDraw = false;
		winner = '';
		reason = '';
		lastSquare = '';
		kingMarker = '';
		states = [];
	};
</script>

<div class="flex w-full max-w-md flex-col space-y-1 bg-orange-100">
	<div class="w-full rounded-sm text-center text-white">
		<slot name="turn" />
	</div>
	<div class="h-full w-full">
		<div id="board" style="width:100%" />
	</div>
	<div class="flex w-full">
		<slot name="footer">
			<button
				on:click={resetGame}
				class="mt-1 w-full rounded-md bg-gray-300 p-2 font-semibold hover:bg-gray-400">
				{$_('pages.games.chess.reset')}
			</button>
		</slot>
	</div>
</div>
