<script lang="ts">
	import 'cm-chessboard/assets/styles/cm-chessboard.css';
	import { onDestroy, onMount } from 'svelte';

	import { goto } from '$app/navigation';


	import Icon from 'svelte-fa';

	import { faHandshake } from '@fortawesome/free-regular-svg-icons';

	import ChessBoard from '$lib/components/playground/ChessBoard.svelte';
	//import { user } from '$lib/stores/user';
	import ChessEngine from '../../../routes/games/chess/chess_engine';
	import { roomStatus } from '$lib/observables/chess';
	import type {
		DrawRequest,
		GameRoom,
		Players
	} from '$lib/types/playground_interfaces';
	//import {
	//	resetGame,
	//	updateUserRecord
	//} from '$lib/firebase/firestore/playground';
	import {
		saveGame,
		resign,
		declineDrawOffer,
		acceptDraw,
		offerDraw
	} from '$lib/firebase/util';

	export let roomId = '';
	export let chatRef;

	let chessObserver;
	let engine;
	let board;
	let gameOver = false;
	let winner = '';
	let isDraw = false;
	let reason = '';
	let moves;
	let lastSquare = '';
	let currentPlayer = '';
	let playerColor = '';
	let kingMarker = '';
	let inputHandler;
	let drawRequest: DrawRequest = {
		request: false,
		from: ''
	};

	let opponentEmail = '';

	$: existRequestDraw = drawRequest.request && drawRequest.from !== $user.email;

	let chessGame: any = {
		first_player: 0,
		players: undefined,
		state: undefined
	};

	onDestroy(() => {
		chessObserver.unsubscribe();
	});

	const isUserPlaying = (players: string[]) => {
		if (players) {
			return players.includes($user.email);
		}
		return false;
	};

	onMount(async () => {
		await ChessEngine.initWasm();
		engine = new ChessEngine();

		chessObserver = roomStatus(roomId).subscribe((chessRoom: GameRoom) => {
			if (!chessRoom) {
				goto('/playground', { replaceState: true });
				return;
			}
			const { game } = chessRoom;
			chessGame = chessRoom;

			const players = chessRoom.playersName;
			isDraw = chessRoom.draw;
			chatRef = chessGame.chatRoom;
			drawRequest = chessRoom.drawRequest;
			currentPlayer = game.state.current_player;
			playerColor = getPlayerColor(chessRoom.players);
			opponentEmail = getOpponentEmail(chessRoom.players);
			board.setOrientation(playerColor.toLocaleLowerCase()[0]);
			winner = chessGame.winner;
			engine.state = game.state;
			board.setPosition(engine.fen());
			board.removeMarkers();
			addKingMarker();
			board.disableMoveInput();
			if (currentPlayer === playerColor) {
				if ($user && isUserPlaying(players)) {
					board.enableMoveInput(inputHandler);
				}
			} else {
				board.disableMoveInput();
			}
		});
	});

	const getOpponentEmail = (players: Players): string => {
		if (players.challenger.email !== $user.email) {
			return players.challenger.email;
		}
		return players.opponent.email;
	};

	const getPlayerColor = (players: Players): string => {
		if (
			(players.challenger.email === $user.email &&
				players.challenger.isFirstPlayer) ||
			(players.opponent.email === $user.email && players.opponent.isFirstPlayer)
		) {
			return 'White';
		} else {
			return 'Black';
		}
	};

	const finishGame = async () => {
		let _winner = '';
		let _looser = '';
		if (_winner === playerColor) {
			_winner = $user.email;
			_looser = opponentEmail;
		} else {
			_winner = opponentEmail;
			_looser = $user.email;
		}
		await updateUserRecord('winner', _winner, _looser);
	};

	const addKingMarker = () => {
		const { white_king_is_checked, black_king_is_checked } = engine.getState();
		if (white_king_is_checked) {
			kingMarker = engine.getKingPosition('w');
			board.addMarker(kingMarker, { class: 'danger', slice: 'markerCircle' });
		} else if (black_king_is_checked) {
			kingMarker = engine.getKingPosition('b');
			board.addMarker(kingMarker, { class: 'danger', slice: 'markerCircle' });
		}
	};

	const transformArrayToObject = (array) => {
		let object = {};

		for (let i = 0; i < array.length; i++) {
			object[`array_${i}`] = array[i];
		}

		return object;
	};

	const updateGameState = async (gameState) => {
		await saveGame(gameState);
	};

	const nextMove = () => {
		updateGameState({
			...chessGame,
			winner,
			reason,
			game: {
				...chessGame.game,
				state: {
					...engine.state,
					board: transformArrayToObject(engine.state.board)
				}
			}
		});
		return false;
	};

	const reset = async () => {
		await resetGame(chessGame);
	};

	const resignGame = async () => {
		console.log('resign');
		console.log('ID', chessGame.id);
		await resign(chessGame.id, playerColor === 'White' ? 'Black' : 'White');
		await updateUserRecord('winner', opponentEmail, $user.email);
	};

	const offerDrawGame = async () => {
		console.log('ofer draw!!');

		await offerDraw(chessGame.id, $user.email);
	};

	const declineDrawOfferGame = async () => {
		await declineDrawOffer(chessGame.id);
	};

	const acceptDrawGame = async () => {
		await acceptDraw(chessGame.id);
		await updateUserRecord('draw', $user.email, opponentEmail);
	};

	const switchOrientation = () => {
		console.log('ORIENTATION ', board.getOrientation());
		const orientation = board.getOrientation();
		board.setOrientation(orientation === 'b' ? 'w' : 'b');
	};
</script>

{#if $user}
	<ChessBoard
		secondMove={nextMove}
		bind:inputHandler
		bind:engine
		bind:board
		bind:gameOver
		bind:winner
		callbackWinner={finishGame}
		bind:isDraw
		bind:reason
		bind:moves
		bind:lastSquare
		bind:kingMarker>
		<div slot="turn" class="bg-orange-400">
			{#if isDraw}
				<p class="bg-brand-secondary">
					{$_('pages.games.chess.turn.draw')}
				</p>
			{:else if winner.length > 0}
				<p class="bg-red-500">
					{$_('pages.games.chess.winner_msg', {
						values: {
							winner: $_(`pages.games.chess.color.${winner.toLowerCase()}`)
						}
					})}
				</p>
			{:else if isUserPlaying(chessGame.playersName)}
				{#if currentPlayer === playerColor}
					{$_('pages.games.chess.turn.your_turn_msg')}
				{:else}{$_('pages.games.chess.turn.waiting_msg')}{/if}
			{:else}
				<p>
					{$_('pages.games.chess.turn.turn_msg', {
						values: {
							current_player: $_(
								`pages.games.chess.color.${currentPlayer.toLowerCase()}`
							)
						}
					})}
				</p>
			{/if}
		</div>

		<div slot="footer" class="w-full">
			{#if isUserPlaying(chessGame.playersName)}
				{#if !chessGame.active}
					<button
						on:click={reset}
						class="w-full rounded-md border bg-gray-300 px-1 py-1 font-semibold
						hover:bg-gray-400">
						{$_('pages.games.chess.reset')}
					</button>
				{:else}
					{#if existRequestDraw}
						<div class="my-3 flex w-full justify-evenly dark:text-white">
							<p class="font-semibold">
								{$_('pages.games.chess.draw.draw_offer')}
							</p>
							<button
								on:click={declineDrawOfferGame}
								class="rounded-md border border-red-500 px-2 py-1
								text-sm font-semibold hover:bg-red-400 hover:text-white dark:bg-red-800
								dark:text-red-100">
								{$_('pages.games.decline')}
							</button>
						</div>
					{/if}
					<div class="flex w-full space-x-2">
						<button
							on:click={() => {
								if (existRequestDraw) {
									acceptDrawGame();
								} else {
									offerDrawGame();
								}
							}}
							class:heartbeat_animation={existRequestDraw}
							id="btn_draw"
							class="flex w-2/3 items-center justify-center space-x-3
							rounded-md bg-orange-100 px-2 py-1 text-white text-orange-600 shadow-md
							hover:bg-orange-300">
							<span class="text-sm">
								{#if existRequestDraw}
									{$_('pages.games.chess.draw.accept_draw')}
								{:else}{$_('pages.games.chess.draw.offer_draw')}{/if}
							</span>
							<span class="inline-block flex text-3xl text-orange-600">
								<Icon icon={faHandshake} />
							</span>
						</button>
						<button
							on:click={resignGame}
							class="w-1/3 rounded-md border bg-gray-300 px-2 py-1 shadow-md
							hover:bg-gray-400">
							{$_('pages.games.chess.resign')}
						</button>
					</div>
				{/if}
			{:else}
				<button
					class="w-full rounded-md border bg-gray-300 px-1 py-1 font-semibold
					hover:bg-gray-400"
					on:click={switchOrientation}>
					{$_('pages.games.chess.switch_orientation')}
				</button>
			{/if}
		</div>
	</ChessBoard>
{/if}

<style>
	@keyframes heartbeat {
		0% {
			transform: scale(0.9);
		}
		20% {
			transform: scale(1);
		}
		40% {
			transform: scale(0.9);
		}
		60% {
			transform: scale(1);
		}
		80% {
			transform: scale(0.9);
		}
		100% {
			transform: scale(0.9);
		}
	}
	.heartbeat_animation {
		animation: heartbeat 1s infinite;
	}
</style>
