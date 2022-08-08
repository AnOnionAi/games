<script lang="ts">
	import { onMount } from 'svelte';
	import {
		goInstallPhantom,
		isPhantomInstalled,
		phantomCon
	} from '$lib/utils/phantomCalls';
	import { account } from '$lib/stores/PhantomAccount';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { faHandPeace } from '@fortawesome/free-regular-svg-icons';

	type PhantomExtensionStatus = 'checking' | 'isInstalled' | 'notInstalled';

	let isInstalled: PhantomExtensionStatus = 'checking';

	let showModal = false;

	onMount(() => {
		isInstalled = isPhantomInstalled() ? 'isInstalled' : 'notInstalled';
	});

	const onClickDispatcher = (status: PhantomExtensionStatus) => {
		if (status == 'notInstalled') {
			return goInstallPhantom();
		} else if (status == 'isInstalled' && !$account) {
			return phantomCon();
		} else if ($account) {
			showModal = !showModal;
		}
	};
</script>

{#if showModal}
	<Modal
		title="Heeey!"
		icon={faHandPeace}
		successButtonDisabled={false}
		bind:showModal>
		<p>Coming Soon ! 🙏</p>
	</Modal>
{/if}

<h1 class="catBackground title pb-8 text-center text-6xl dark:text-white">
	{$_('portal.soon')}
</h1>

<div class="text-center">
	<div class="portal" />
	{#if isInstalled == 'notInstalled' || (isInstalled == 'isInstalled' && !$account)}
		<button
			on:click={() => onClickDispatcher(isInstalled)}
			class="mintButton h-84 w-84 bg-cyber-blue-500 
					rounded-full text-8xl text-white shadow-md shadow-black hover:bg-gradient-to-bl hover:from-[#00FFA3] hover:via-[#03E1FF] hover:to-[#DC1FFF]">
			¡ {$_('map.when')} !
		</button>
	{/if}

	{#if $account}
		<button
			on:click={() => onClickDispatcher(isInstalled)}
			class="mintButtonMint h-84 w-84 bg-brand-secondary 
					hover:from-solana-green hover:via-solana-blue hover:to-solana-purple rounded-full text-8xl text-white hover:bg-gradient-to-bl">
			¡ {$_('map.when')} !
		</button>
	{/if}
</div>

<style>
	.portal {
		background-image: url('/images/cyberPortal.webp');
		background-size: cover;
		border: 1px solid #000;
		min-height: 600px;
		background-repeat: no-repeat;
		background-position: center center;
	}

	.mintButton,
	.mintButtonMint {
		font-family: Ink Free;
	}

	.mintButton {
		animation: pulse-animation 5s infinite;
		/* box-shadow: 10px -10px 25px 0 rgba(0, 255, 163, 0.5), -10px 10px 25px 0 
			rgba(3, 225, 255, 0.5), 10px 10px 25px 0 rgba(220, 31, 255, 0.5) ; */
		/* animation: pulse-animation-mint 2s infinite; */
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.mintButtonMint {
		animation: pulse-animation-mint 2s infinite;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.mintButton:hover {
		animation: pulse-animation-hovering 2s infinite;
	}

	@keyframes pulse-animation {
		0% {
			box-shadow: 0 0 0 2px #bd00ff;
		}
		0% {
			box-shadow: 0 0 0 4px #d600ff;
		}
	}

	@keyframes pulse-animation-hovering {
		0% {
			box-shadow: 0 0 0 0px #d600ff;
		}
		100% {
			box-shadow: 0 0 0 5px #ffffff;
		}
	}

	@keyframes pulse-animation-mint {
		0% {
			box-shadow: 1px 1px 2.5px 5px rgba(0, 255, 163, 0.5);
		}
		25% {
			box-shadow: 2px 2px 5px 7px rgba(0, 255, 163, 0.5);
		}
		50% {
			box-shadow: 3px 3px 15px 9px rgba(3, 225, 255, 0.5);
		}
		75% {
			box-shadow: 4px 4px 20px 11px rgba(220, 31, 255, 0.5);
		}
		100% {
			box-shadow: 5px 5px 25px 13px #ffffff;
		}
	}
</style>
