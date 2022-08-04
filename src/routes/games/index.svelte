<script>
	import Invitations from '$lib/components/playground/Invitations.svelte';
	import Turns from '$lib/components/playground/Turns.svelte';

	import { _ } from 'svelte-intl-precompile';

	import { user } from '$lib/stores/user';

	console.log($user);

	let badgeSelected = 1;

	const GAMES = [
		{
			name: 'Tic Tac Toe',
			img: '/tic-tac-toe.webp',
			href: 'games/gato'
		},
		{
			name: 'Chess',
			img: '/chess.webp',
			href: 'games/chess'
		}
	];
</script>

<section class="background mt-3">
	<div class="text-center">
		<span
			on:click={() => (badgeSelected = 0)}
			class:active={badgeSelected === 0}
			class="dark:bg-dark-400 cursor-pointer rounded-lg bg-zinc-200 px-2 py-1 font-semibold
			shadow-lg hover:opacity-75 dark:text-white">
			{$_('pages.games.explore')}
		</span>
		<span
			on:click={() => (badgeSelected = 1)}
			class:active={badgeSelected === 1}
			class="dark:bg-dark-400 cursor-pointer rounded-lg bg-zinc-200 px-2 py-1 font-semibold
			shadow-lg hover:opacity-75 dark:text-white">
			{$_('pages.games.games')}
		</span>
		<span
			on:click={() => (badgeSelected = 2)}
			class:active={badgeSelected === 2}
			class="dark:bg-dark-400 cursor-pointer rounded-lg bg-zinc-200 px-2 py-1 font-semibold
			shadow-lg hover:opacity-75 dark:text-white">
			{$_('pages.games.invitationslbl')}
		</span>
	</div>
	<section class="mt-5 space-y-4">
		{#if badgeSelected === 0}
			<div class="flex w-full">
				<div class="grid w-full grid-cols-1 gap-4 text-center sm:grid-cols-2">
					{#each GAMES as game}
						<div
							class="dark:bg-dark-600 space-y-2 rounded-xl border shadow-md
							dark:border-0">
							<div class="flex items-center justify-center">
								<img class="max-h-40" src={game.img} alt="tic-tac-toe" />
							</div>
							<div class="dark:bg-dark-300 space-y-3 bg-zinc-100 p-2">
								<p class="text-lg font-bold dark:text-white">{game.name}</p>
								<a
									href={game.href}
									class="bg-brand-enter hover:brand-enter block w-full rounded-md p-1
									font-bold text-white">
									Play
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else if badgeSelected === 1 && $user}
			<Turns />
		{:else if badgeSelected === 2 && $user}
			<Invitations />
		{:else}
			<div class="flex flex-col items-center text-center">
				<img class="max-w-48" src="/assets/sign_in.svg" alt="sing in" />
				<p class="text-2xl dark:text-white">{$_('pages.games.sign-in')}</p>
			</div>
		{/if}
	</section>
</section>

<style>
	/* .dark .active {
		--tw-bg-opacity: 1;
		background-color: rgba(245, 158, 11, var(--tw-bg-opacity));
		--tw-text-opacity: 1;
		color: rgba(0, 0, 0, var(--tw-text-opacity));
	} */

	.active {
		--tw-bg-opacity: 1;
		background-color: rgba(217, 119, 6, var(--tw-bg-opacity));
		--tw-text-opacity: 1;
		color: rgba(255, 255, 255, var(--tw-text-opacity));
	}

	.background {
		background-image: url('/images/cybercat1.webp');
		background-position: bottom center;
		background-repeat: no-repeat;
		background-size: 320px;
	}

	@media only screen and (max-height: 760px) {
		.background {
			background-size: 180px;
			background-position: bottom center;
		}
	}

	@media only screen and (max-height: 600px) {
		.background {
			background-size: 120px;
			background-position: bottom center;
		}
	}
</style>
