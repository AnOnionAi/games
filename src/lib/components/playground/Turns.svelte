<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { gamesStatus } from '$lib/observables/playground';
	import type {
		GameRoom,
		PlayerRecord,
		Players
	} from '$lib/types/playground_interfaces';

	//import { user } from '$lib/stores/user';


	import UserCard from './UserCard.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';

	let rooms: GameRoom[] = [];
	let playerColor = '';
	let loading = false;
	let userRecord: PlayerRecord = {
		wins: 0,
		draws: 0,
		losses: 0
	};


	let gameObservable;
	onMount(() => {
		loading = true;
		gameObservable = gamesStatus().subscribe((value: GameRoom[]) => {
			console.log('game value', value);
			rooms = value;
			loading = false;
		});
		// playerRecordObservable = playerRecord().subscribe((_playerRecord: PlayerRecord) => {
		// 	console.log('userRecord', _playerRecord);
		// 	userRecord = _playerRecord ?? { wins: 0, draws: 0, losses: 0 };
		// });
	});

	onDestroy(() => {
		// gameObservable.unsubscribe();
		// playerRecordObservable.unsubscribe();
	});

	const isPlayerTurn = (currentPlayer: string, players: Players): boolean => {
		const { challenger, opponent } = players;
		const userEmail = $user.email;
		let isFirstPlayer = false;
		if (challenger.email === userEmail) {
			isFirstPlayer = challenger.isFirstPlayer;
		} else if (opponent.email === userEmail) {
			isFirstPlayer = opponent.isFirstPlayer;
		}
		playerColor = isFirstPlayer ? 'White' : 'Black';
		return playerColor === currentPlayer;
	};

	const getOtherPlayerName = (players: string[]): string => {
		const userEmail = $user.email;
		for (let i = 0; i < players.length; i++) {
			if (userEmail !== players[i]) return players[i];
		}
		return userEmail;
	};

	const getOtherPlayerPhotoURL = (players: Players): string => {
		const { challenger, opponent } = players;
		const userEmail = $user.email;
		let otherPlayerPhotoURL = '';
		if (challenger.email !== userEmail) {
			otherPlayerPhotoURL = challenger.photoURL;
		} else if (opponent.email !== userEmail) {
			otherPlayerPhotoURL = opponent.photoURL;
		}
		if (
			otherPlayerPhotoURL.length === 0 ||
			otherPlayerPhotoURL === 'no-image'
		) {
			otherPlayerPhotoURL = '/svg/proto_cat.svg';
		}
		return otherPlayerPhotoURL;
	};
</script>

{#if loading}
	<div class="flex justify-center">
		<Spinner class="!border-l-orange-400" />
	</div>
{:else}
	<div class="space-y-5">
		<div
			class="dark:bg-dark-400 flex justify-around border py-1 px-3 text-center dark:border-0">
			<div>
				<p class="dark:text-light-200 text-sm font-semibold">
					Wins
				</p>
				<p class="text-lg font-bold text-orange-600">
					{userRecord.wins}
				</p>
			</div>
			<div>
				<p class="dark:text-light-200 text-sm font-semibold text-gray-500">
					Loses
				</p>
				<p class="text-lg font-bold text-orange-600">
					{userRecord.losses}
				</p>
			</div>
			<div>
				<p class="dark:text-light-200 text-sm font-semibold text-gray-500">
					Draws
				</p>
				<p class="text-lg font-bold text-orange-600">
					{userRecord.draws}
				</p>
			</div>
		</div>
		<div class="space-y-1">
			<p
				class="rounded-md
      bg-orange-600 text-center
      !text-white shadow-md dark:bg-orange-500 dark:font-semibold
      dark:text-black">
				Your Turn
			</p>
			{#each rooms as room}
				{@const roomDate = new Date(room.lastMove?.toString())}
				{#if isPlayerTurn(room.game.state.current_player, room.players)}
					<UserCard
						gameId={room.id}
						formatDistanceDate={formatDistance(roomDate, new Date(), {
							addSuffix: true,
							locale
						})}
						userName={getOtherPlayerName(room.playersName)}
						userPhotoURL={getOtherPlayerPhotoURL(room.players)}
						roomType={room.type} />
				{/if}
			{/each}
		</div>
		<div class="space-y-1">
			<p
				class="!dark:text-black
      rounded-md bg-orange-600
      text-center !text-white shadow-md dark:bg-orange-500
      dark:font-semibold">
				Their Turn
			</p>
			{#each rooms as room}
				{@const roomDate = new Date(room.lastMove?.toString())}
				{#if !isPlayerTurn(room.game.state.current_player, room.players)}
					<UserCard
						gameId={room.id}
						formatDistanceDate={formatDistance(roomDate, new Date(), {
							addSuffix: true,
							locale
						})}
						userName={getOtherPlayerName(room.playersName)}
						userPhotoURL={getOtherPlayerPhotoURL(room.players)}
						roomType={room.type} />
				{/if}
			{/each}
		</div>
	</div>
{/if}

<style>
	.dark div p:first-child {
		--tw-text-opacity: 1;
		color: rgba(250, 250, 250, var(--tw-text-opacity));
	}

	div p:first-child {
		--tw-text-opacity: 1;
		color: rgba(0, 0, 0, var(--tw-text-opacity));
	}
</style>
