<script>
	import Icon from 'svelte-fa';

	// import { scale, fade } from "svelte/transition";
	import Spinner from './Spinner.svelte';

	export let showModal = false;
	export let title = '';

	export let successButtonText = '';
	export let loading = false;
	export let icon;
	export let successButtonDisabled = false;
	export let onSuccess = null;
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.code === 'Escape') {
			showModal = false;
		}
	}} />

<div class="fixed inset-0 z-10 overflow-y-auto">
	<div
		class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
		<div class="fixed inset-0 transition-opacity">
			<div class="absolute inset-0 bg-zinc-500 opacity-75" />
		</div>
		<span class="hidden sm:inline-block sm:h-screen sm:align-middle"
			>&#8203;</span>
		<div
			class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom
			shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:align-middle">
			<div class="bg-white px-4 pt-5 pb-4 dark:bg-zinc-800 sm:p-6 sm:pb-4">
				<div class="-sm:flex-col -sm:items-center flex">
					<div
						class=" flex h-12 w-14 items-center justify-center rounded-full bg-orange-100
						dark:bg-zinc-500 sm:w-12">
						<Icon {icon} />
					</div>
					<div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
						<h3
							class="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-500"
							id="modal-headline">
							{title}
						</h3>
						<div class="mt-2 dark:text-zinc-500">
							<slot />
						</div>
					</div>
				</div>
			</div>
			<div class="bg-zinc-50 py-3 px-4 dark:bg-zinc-800 sm:flex sm:px-6">
				<button
					type="button"
					on:click={() => {
						showModal = false;
					}}
					class="mt-3 inline-flex w-full justify-center rounded-md border border-zinc-300
					bg-white py-2 px-4 text-base font-medium text-zinc-700 shadow-sm
					hover:bg-zinc-50 focus:outline-none dark:bg-zinc-800 dark:text-zinc-900 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
					{$_('pages.auth-pages.login.modal.buttonCancel')}
				</button>
				{#if successButtonText.length > 0}
					<button
						disabled={successButtonDisabled}
						class:cursor-not-allowed={successButtonDisabled}
						on:click={onSuccess}
						type="button"
						class="mt-3 inline-flex w-full justify-center rounded-md border border-zinc-300
						bg-green-500 py-2 px-4 text-base font-medium text-white text-zinc-700 shadow-sm
						hover:bg-green-700 focus:outline-none dark:bg-zinc-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
						">
						{#if loading}
							<Spinner height="22px" width="22px" />
						{:else}{successButtonText}{/if}
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
