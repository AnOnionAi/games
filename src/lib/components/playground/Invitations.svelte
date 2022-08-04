<script lang="ts">
	import { faChess } from '@fortawesome/free-solid-svg-icons';
	import { onDestroy, onMount } from 'svelte';

	import Icon from 'svelte-fa';


	import type { GameInvitation } from '$lib/types/playground_interfaces';
	import { invitationStatus } from '$lib/observables/invitations';

	import { createGameRoom } from '$lib/firebase/playground';

	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { deleteInvitation } from '$lib/firebase/util';

	let invitationObservable;
	let invitations: GameInvitation[] = [];

	const getLocale = () => {
		switch ($lang) {
			case 'es':
				return es;
			case 'fr':
				return fr;
			case 'de':
				return de;
			default:
				return enUS;
		}
	};

	let locale = getLocale();
	let loading = false;

	onMount(() => {
		loading = true;
		invitationObservable = invitationStatus().subscribe(
			(_invitations: GameInvitation[]) => {
				console.log('invitation value', _invitations);
				invitations = _invitations;
				loading = false;
			}
		);
	});

	onDestroy(() => {
		invitationObservable.unsubscribe();
	});

	const declineInvitation = async (invitationId: string) => {
		try {
			await deleteInvitation(invitationId);
		} catch (e) {
			console.log(e.message);
		}
	};

	const acceptInvitation = async (invitation: GameInvitation) => {
		try {
			await createGameRoom(invitation);
		} catch (e) {
			console.log(e.message);
		}
	};
</script>

{#if loading}
	<div class="flex justify-center">
		<Spinner class="!border-l-orange-400" />
	</div>
{:else if invitations.length > 0}
	<div>
		{#each invitations as invitation, idx}
			{@const invitationDate = new Date(invitation.timestamp.toString())}
			{#if !invitation.accepted}
				<div
					class="dark:bg-dark-500
                my-4
                space-y-3 border bg-gray-50 p-2 shadow-md dark:border-0">
					<div class="flex space-x-4">
						<div class="max-w-2/3 space-y-1 text-sm">
							<p class="dark:text-gray-300">
								<span class="font-semibold">{invitation.from}</span>
								{$_('pages.games.invitations.invitation_msg_1')}
								<span class="font-semibold text-orange-500">
									{$_(`pages.games.${invitation.game}.title`).toLowerCase()}
								</span>
								{$_('pages.games.invitations.invitation_msg_2')}
							</p>
							<p class="text-xs text-gray-400">
								{formatDistance(invitationDate, new Date(), {
									addSuffix: true,
									locale
								})}
							</p>
						</div>
						<span
							class="inline-block flex items-center text-4xl text-gray-500 dark:text-gray-300">
							<Icon icon={faChess} />
						</span>
					</div>

					<div class="flex space-x-3">
						<button
							class="w-1/2
                        rounded-md
                        bg-green-300 font-semibold text-green-900 dark:bg-green-900 dark:text-green-200"
							on:click={() => acceptInvitation(invitation)}>
							{$_('pages.games.accept')}
						</button>
						<button
							class="
                    w-1/2
                        rounded-md
                    bg-red-300 font-semibold text-red-900 dark:bg-red-900 dark:text-red-200"
							on:click={() => declineInvitation(invitation.id)}>
							{$_('pages.games.decline')}
						</button>
					</div>
				</div>
			{/if}
		{/each}
	</div>
{:else}
	<div class="max-w-sm space-y-10 p-10">
		<img src="/svg/empty.svg" alt="empty" />
		<p
			class="text-center text-xl font-semibold text-gray-800 dark:text-gray-300">
			{$_('pages.games.no-invitations')}
		</p>
	</div>
{/if}
