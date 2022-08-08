<script lang="ts">
	import { page } from '$app/stores';
	import Icon from 'svelte-fa';
	import logo from './svelte-logo.svg';
	import { onMount } from 'svelte';
	import { account } from '$lib/stores/PhantomAccount';
	import {
		goInstallPhantom,
		isPhantomInstalled,
		phantomCon,
		phantomDisconnect
	} from '$lib/utils/phantomCalls';
	import {
		faWallet,
		faBan
	} from '@fortawesome/free-solid-svg-icons';

	type PhantomExtensionStatus = 'checking' | 'isInstalled' | 'notInstalled';

	let isInstalled: PhantomExtensionStatus = 'checking';

	onMount(() => {
		isInstalled = isPhantomInstalled() ? 'isInstalled' : 'notInstalled';
	});

	const onClickDispatcher = (status: PhantomExtensionStatus) => {
		if (status == 'notInstalled') {
			return goInstallPhantom();
		} else if (status == 'isInstalled' && !$account) {
			return phantomCon();
		}
	};

	const onDisconnectDispatcher = () => {
		if ($account) {
			return phantomDisconnect();
		} else {
			console.log('No hay cuenta');
		}
	};
</script>

<header>
	<div class="corner">
		<a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class:active={$page.url.pathname === '/'}><a sveltekit:prefetch href="/">Home</a></li>
			<li class:active={$page.url.pathname === '/about'}>
				<a sveltekit:prefetch href="/about">About</a>
			</li>
			<li class:active={$page.url.pathname === '/todos'}>
				<a sveltekit:prefetch href="/todos">Todos</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		{#if isInstalled == 'notInstalled'}
							<button class="m-auto block" on:click={() => goInstallPhantom()}>
								<span
									class="dark:hover:bg-dark-600 block rounded-md py-3 px-3 font-medium transition duration-300 hover:bg-zinc-100">
									<Icon
										class="text-brand-primary absolute"
										scale="1.1"
										translateX="0.2"
										translateY="0.1"
										icon={faBan} />
									<Icon color="#374151" size="lg" icon={faWallet} />
								</span>
							</button>
						{/if}

						{#if isInstalled == 'checking'}
							{'Checking...'}
						{/if}

						{#if isInstalled == 'isInstalled' && !$account}
							<button
								class="m-auto block"
								on:click={() => onClickDispatcher(isInstalled)}>
								<span
									class="dark:hover:bg-dark-600 block rounded-md py-3 px-3 font-medium transition duration-300 hover:bg-zinc-100">
									<Icon color="#374151" size="lg" icon={faWallet} />
								</span>
							</button>
						{/if}

						{#if $account}
							<button
								class="btn-connected m-auto mb-4 block"
								on:click={onDisconnectDispatcher}>
								<span
									class="w-c-c dark:hover:bg-dark-600 block rounded-md py-1 px-1 font-medium transition duration-300 hover:bg-zinc-100">
									<Icon
										style="display:relative; opacity:1;"
										id="wallet-connected"
										class="wallet-connected"
										size="lg"
										icon={faWallet} />
								</span>
							</button>
						{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
