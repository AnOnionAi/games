<script>

	import Icon from 'svelte-fa';
	import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes.js';
	import { faCircle } from '@fortawesome/free-regular-svg-icons/faCircle.js';
	import { onMount } from 'svelte';

	import { darkMode } from '$lib/stores/storeDark';
	import init, { TicTacToe } from 'rustytac';
	import { playTicTacToe } from '$lib/services/destino';

	let tictactoe;
	let board = [
		['Nil', 'Nil', 'Nil'],
		['Nil', 'Nil', 'Nil'],
		['Nil', 'Nil', 'Nil']
	];
	let turn = 1;
	let condition = -1;
	let winner = '';
	let player = '';
	let whofirst = '';
	let lastPosition = [-1, -1];
	let waiting = false;
	let bot = true;
	let gameStarted = false;

	let history = [];

	onMount(async () => {
		await init();

		tictactoe = TicTacToe.new(1);
		start();
	});

	function placeMark(i, j) {
		tictactoe?.place_mark(i, j);
		board = tictactoe?.get_board() || [[]];
		lastPosition = [i, j];
		history = [...history, { player, lastPosition }];
	}

	function start() {
		gameStarted = true;
		player = Math.round(Math.random()) ? 'user' : 'other';
		whofirst = player;
		if (whofirst === 'other') {
			otherPlayer(player);
		}
	}

	function play(i, j) {
		// you can't mark if there is a winner or if the cell isn't available
		if (winner.length !== 0 || board[i][j] !== 'Nil' || !gameStarted)
			return false;

		// check if there is a winner
		placeMark(i, j);
		condition = tictactoe?.win_condition();
		if (turn >= 5 && condition > 0) {
			winner = player;
			gameStarted = false;
		} else {
			player = player === 'other' ? 'user' : 'other';
			turn++;
		}
		otherPlayer(player);
	}

	function resetGame() {
		tictactoe = TicTacToe.new(1);
		turn = 1;
		board = tictactoe.get_board();
		winner = '';
		condition = -1;
		player = '';
		whofirst = player;
		gameStarted = false;
		history = [];
		start();
	}

	async function otherPlayer(player) {
		if (turn === 10 || player !== 'other' || !gameStarted) return;

		waiting = true;

		let i = 0;
		let j = 0;
		if (!bot) {
			let exists = true;
			while (exists) {
				i = Math.floor(Math.random() * 3);
				j = Math.floor(Math.random() * 3);
				if (board[i][j] === 'Nil') {
					exists = false;
				}
			}
		} else {
			[i, j] = await playTicTacToe(whofirst, board);
			console.log('row:', i, 'col:', j);
		}

		setTimeout(() => {
			play(i, j);
			waiting = false;
		}, 500);
	}

	function checkWinner(i, j) {
		let _isWinner = false;
		switch (condition) {
			case 1:
				for (let _i = 0; _i < 3; _i++) {
					if (i === lastPosition[0] && j === _i) {
						_isWinner = true;
						break;
					}
				}
				return _isWinner;
			case 2:
				for (let _i = 0; _i < 3; _i++) {
					if (i === _i && j === lastPosition[1]) {
						_isWinner = true;
						break;
					}
				}
				return _isWinner;
			case 3:
				for (let _i = 0; _i < 3; _i++) {
					if (i === _i && j === _i) {
						_isWinner = true;
						break;
					}
				}
				return _isWinner;
			case 4:
				for (let _i = 0; _i < 3; _i++) {
					if (i === _i && j === 2 - i) {
						_isWinner = true;
						break;
					}
				}
				return _isWinner;
		}
	}
</script>

<div class="background flex h-full w-full flex-col items-center">
	<div class="max-w-96 flex w-full flex-col items-center">
		<p class="font-mono text-2xl font-bold text-black dark:text-white">
			Tic Tac Toe
		</p>
		<div class="flex space-x-2">
			<div
				style="border-bottom: {player === 'user'
					? '0.125rem solid #FBBF24'
					: ''}"
				class="flex items-center border-b-2 bg-white p-3 shadow-lg">
				<p class="mr-3 font-semibold">
					{$_('pages.games.tic-tac-toe.player')}:
				</p>
				{#if whofirst === 'user'}
					<Icon icon={faTimes} />
				{:else}
					<Icon icon={faCircle} />
				{/if}
			</div>
			<div
				style="border-bottom: {player === 'other'
					? '0.125rem solid #FBBF24'
					: ''}"
				class="flex items-center border-b-2 bg-white p-3 shadow-lg">
				<p class="mr-3 font-semibold">
					{$_('pages.games.tic-tac-toe.other_player')}:
				</p>
				{#if whofirst === 'other'}
					<Icon icon={faTimes} />
				{:else}
					<Icon icon={faCircle} />
				{/if}
			</div>
		</div>
	</div>

	<div class="mt-2">
		{#if winner === 'user'}
			<p class="text-2xl font-bold text-green-500">
				{$_('pages.games.tic-tac-toe.win')}
			</p>
		{:else if winner === 'other'}
			<p class="text-2xl font-bold text-red-500">
				{$_('pages.games.tic-tac-toe.lose')}
			</p>
		{:else if turn === 10}
			<p class="text-2xl font-bold text-orange-500">
				{$_('pages.games.tic-tac-toe.tie')}
			</p>
		{:else if player === 'user'}
			<p class="text-brand-secondary mt-2 text-lg">
				{$_('pages.games.tic-tac-toe.your-turn')}
			</p>
		{:else if player === 'other'}
			<p class="text-brand-secondary mt-2 text-lg">
				{$_('pages.games.tic-tac-toe.waiting')}...
			</p>
		{/if}
	</div>

	<div class="max-w-96 block w-full">
		<div id="game_board" class="grid grid-cols-3 text-center">
			{#each board as row, i}
				{#each row as rows, j}
					<!-- Was #each row as _, j -->
					<button
						class="focus:outline-none"
						disabled={waiting}
						class:winner_cell={!$darkMode &&
							winner.length !== 0 &&
							checkWinner(i, j)}
						class:cross={board[i][j] === 'Cross'}
						class:nought={board[i][j] === 'Nought'}
						on:click={() => play(i, j)}>
						{#if board[i][j] === 'Nought'}
							<Icon icon={faCircle} class="icons" />
						{:else if board[i][j] === 'Cross'}
							<Icon icon={faTimes} class="icons" />
						{/if}
					</button>
				{/each}
			{/each}
		</div>
	</div>
	<div class="m-2 flex items-center space-x-2">
		<button
			class="rounded-md bg-gray-300 px-4 py-2 sm:max-w-sm"
			on:click={resetGame}>
			{$_('pages.games.tic-tac-toe.reset')}
		</button>
		<div class="flex items-center">
			<div class="flex items-center">
				<div class="relative mr-2 w-10">
					<input
						disabled={gameStarted}
						type="checkbox"
						bind:checked={bot}
						name="toggle"
						id="toggle"
						class="toggle-checkbox absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white ease-in focus:outline-none" />
					<label
						for="toggle"
						class="toggle-label block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300" />
				</div>
				<label for="toggle" class="text-xs text-gray-700 dark:text-white">
					{$_('home.title')} {bot ? 'ON' : 'OFF'}</label>
			</div>
		</div>
	</div>
</div>

<style>
	:global(.icons) {
		font-size: 2.5rem;
	}

	.winner_cell {
		--tw-shadow-color: 0, 0, 0;
		--tw-shadow: 0 10px 15px -3px rgba(var(--tw-shadow-color), 0.1),
			0 4px 6px -2px rgba(var(--tw-shadow-color), 0.05);
		-webkit-box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
		border-width: 1px;
		border-width: 4px;
		--tw-border-opacity: 1;
		border-color: rgba(16, 185, 129, var(--tw-border-opacity));
	}

	.cross {
		color: #fbbf24 !important;
		background-color: #fde68a !important;
	}

	.nought {
		color: #3b82f6 !important;
		background-color: #bfdbfe !important;
	}

	.cross,
	.nought {
		cursor: default !important;
	}

	#game_board button {
		background-color: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0.2rem;
		border-radius: 0.5rem;
		min-height: 8rem;
	}

	#game_board button:hover {
		background-color: #e5e7eb;
	}

	.toggle-checkbox:checked {
		right: 0;
		border-color: rgb(96, 165, 250);
	}
	.toggle-checkbox:checked + .toggle-label {
		background-color: rgb(96, 165, 250) !important;
	}

	.background {
		background-image: url('/images/cybercat5.webp');
		background-size: 400px;
		background-position: bottom right;
		background-repeat: no-repeat;
	}

	@media only screen and (max-width: 850px) {
		.background {
			background-size: 240px;
		}
	}

	@media only screen and (max-width: 600px) {
		.background {
			background-size: 0px;
		}
	}
</style>
