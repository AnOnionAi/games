<script>
	import { page } from '$app/stores';
	//import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import { chatGame } from '$lib/observables/chat';
	import { onDestroy } from 'svelte';
	import ChessPerson from '$lib/components/playground/ChessPerson.svelte';

	let chatRef;
	let chatSubscription;
	let messages = [];

	let message = '';

	onMount(async () => {
		chatSubscription = (await chatGame($page.params.room)).subscribe(
			(value) => {
				messages = value;
				console.log(messages);
			}
		);
	});

	const send = async () => {
		if (chatRef) {
			const _msg = message;
			message = '';
			await createMessageGame(
				{
					message: _msg,
					sendBy: $user.email,
					state: true,
					time: '',
					uid: ''
				},
				chatRef
			);
		}
	};

	onDestroy(() => {
		if (chatSubscription) chatSubscription.unsubscribe();
	});
</script>

<div class="max-h-132 flex w-full justify-center space-x-4">
	<form
		on:submit|preventDefault={send}
		class="max-w-70 flex h-full w-full flex-col space-y-3 border p-3">
		<div class="flex h-full flex-1 flex-col-reverse space-y-2 overflow-auto">
			{#each messages as message}
				<p class="break-words text-sm">
					{#if $user.email === message.sendBy}
						<span class="font-semibold text-green-500"> Yo: </span>
					{:else}
						<span class="font-semibold text-red-500"> Contrincante: </span>
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
	<ChessPerson bind:chatRef roomId={$page.params.room} />
</div>
