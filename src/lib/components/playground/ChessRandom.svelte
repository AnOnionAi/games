<script lang="ts">
	import ChessBoard from './ChessBoard.svelte';


	import { user } from '$lib/stores/user';
	import { getResponseChatBot } from '$lib/services/talk';
	import { getRandomResponse } from '$lib/helpers/handler_error_bot';
	import { lang } from '$lib/stores/lang';

	let engine;
	let board;
	let gameOver = false;
	let winner = '';
	let isDraw = false;
	let reason = '';
	let moves;
	let lastSquare = '';
	let kingMarker = '';

	let messages = [];

	let message = '';

	const playRandom = () => {
		moves = engine.getPossibleMoves();

		if (moves.length === 0) return false;

		let randomMove;
		randomMove = moves[parseInt(String(Math.random() * moves.length))];

		engine.nextState(randomMove);
		board.setPosition(engine.fen());
		console.log(engine.state.board);
		board.removeMarkers();

		return true;
	};

	let loading = false;

	const send = async () => {
		if (!loading && message.trim().length > 0) {
			try {
				loading = true;
				messages = [{ message, sendBy: $user.email }, ...messages];
				const _msg = message;
				message = '';
				let answer: string = await getResponseChatBot(_msg);
				messages = [{ message: answer, sendBy: 'ZetiBOT' }, ...messages];
				loading = false;
			} catch (e) {
				loading = false;
				console.log('error in bot response');
				const newResponse = getRandomResponse($lang);
				messages = [{ message: newResponse, sendBy: 'ZetiBOT' }, ...messages];
			}
		}
	};
</script>

<div class="max-h-132 flex h-full w-full justify-center space-x-4">
	<form
		on:submit|preventDefault={send}
		class="max-w-70 flex h-full w-full flex-col space-y-3 border p-3">
		<div class="flex h-full flex-1 flex-col-reverse space-y-2 overflow-auto">
			{#if loading}
				<span class="text-xs text-gray-500">ZetiBOT está escribiendo...</span>
			{/if}
			{#each messages as message}
				<p class="break-words text-sm">
					{#if $user.email === message.sendBy}
						<span class="font-semibold text-green-500">Yo:</span>
					{:else}
						<span class="font-semibold text-red-500">ZetiBOT:</span>
					{/if}
					{message.message}
				</p>
			{/each}
		</div>
		<input
			bind:value={message}
			type="text"
			placeholder="Escribe un mensaje..."
			class="mt-auto w-full border p-1" />
	</form>
	<ChessBoard
		callbackWinner
		inputHandler
		bind:engine
		bind:board
		bind:gameOver
		bind:winner
		bind:isDraw
		bind:reason
		bind:moves
		bind:lastSquare
		bind:kingMarker
		secondMove={playRandom}>
		<div slot="turn" class="bg-red-500">
			{#if isDraw}
				<p>{$_('pages.games.chess.reason.stalemate')}</p>
			{:else if winner.length > 0}
				<p>
					{$_('pages.games.chess.winner_msg', {
						values: {
							winner: $_(`pages.games.chess.color.${winner.toLowerCase()}`)
						}
					})}
				</p>
			{/if}
		</div>
	</ChessBoard>
</div>
