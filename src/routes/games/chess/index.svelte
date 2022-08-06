<script lang="ts">
	import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

	import Icon from 'svelte-fa';

	//import { user } from '$lib/stores/user';

	import ChessRandom from '$lib/components/playground/ChessRandom.svelte';
	import SpanError from '$lib/components/ui/SpanError.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	//import { createInvitation } from '$lib/firebase/firestore/playground';

	let friendEmail = '';
	let invitationSent = false;
	let loadingInvitation = false;
	let errorSending = false;

	enum GameSelection {
		friend = 1,
		computer,
		random
	}

	let select: GameSelection;

	const sendInvitation = async () => {
		if (friendEmail === $user.email) return false;
		try {
			errorSending = false;
			loadingInvitation = true;
			await createInvitation(friendEmail, 'chess');
			loadingInvitation = false;
			invitationSent = true;
		} catch (e) {
			console.log(e.message);
			invitationSent = false;
			loadingInvitation = false;
			errorSending = true;
		}
	};

	const setGame = (game: GameSelection) => {
		select = game;
	};
</script>

<div
	class="max-h-2xl background flex h-screen w-full flex-col items-center justify-between">
	<div class="dark:bg-dark-800 flex h-1/6 w-full items-center justify-center">
		{#if select}
			<button class="mr-auto dark:text-white" on:click={() => (select = null)}>
				<Icon icon={faArrowLeft} />
			</button>
		{/if}
		<h3
			class:mr-auto={select}
			class="text-center text-3xl font-bold dark:text-white">
			{$_('pages.games.chess.title')}
		</h3>
	</div>
	<div
		class="dark:bg-dark-700 flex h-5/6 w-full flex-col items-center justify-evenly">
		{#if select}
			{#if select === GameSelection.friend}
				{#if !$user}
					<div class="m-3 rounded-md bg-red-100 px-2 py-1 text-center">
						<p class="font-semibold text-red-600">
							{$_('pages.games.game_menu.login_first_alert')}
						</p>
					</div>
				{:else}
					<div>
						<form on:submit|preventDefault={sendInvitation}>
							<label class="mb-3 flex flex-col dark:text-white">
								{$_('pages.auth-pages.email')}
								<input
									required
									bind:value={friendEmail}
									placeholder="friend@email.com"
									class="border p-1 dark:text-black" />
							</label>
							<button
								type="submit"
								class="flex w-full justify-center rounded-md
								border bg-blue-600 p-1 text-sm text-white shadow-md
								hover:bg-blue-800 focus:ring-orange-500 ">
								{#if loadingInvitation}
									<Spinner size={20} />
								{:else}{$_('pages.games.game_menu.send_invitation_msg')}{/if}
							</button>
						</form>

						{#if errorSending || invitationSent}
							{#if errorSending}
								<SpanError
									textError="error sending the invitation"
									isValid={false} />
							{:else if invitationSent}
								<SpanError textError="invitation sent" isValid={true} />
							{/if}
						{/if}
					</div>
				{/if}
			{:else if select === GameSelection.random}
				<ChessRandom />
			{/if}
		{:else}
			<button
				on:click={() => setGame(GameSelection.friend)}
				class="rounded-md border bg-orange-400 px-2 py-1 text-white">
				{$_('pages.games.game_menu.invite_friend')}
			</button>
			<button class="rounded-md border bg-orange-400 px-2 py-1 text-white">
				{$_('pages.games.game_menu.vs_pc')}
			</button>
			<button
				on:click={() => setGame(GameSelection.random)}
				class="rounded-md border bg-orange-400 px-2 py-1 text-white">
				{$_('pages.games.game_menu.random_moves')}
			</button>
		{/if}
	</div>
</div>

<style>
	.background {
		background-image: url('/images/cybercat1.webp');
		background-position: bottom right;
		background-repeat: no-repeat;
		background-size: 350px;
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
