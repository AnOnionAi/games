<script>
	import { fade } from 'svelte/transition';

	export let textError = '';
	export let isValid = false;
</script>

<li
	in:fade
	class="flex items-center py-1"
	style="color: {isValid ? '#047857' : '#B91C1C'}">
	<div
		style="background-color: {isValid ? '#A7F3D0' : '#FECACA'}"
		class="flex items-center justify-center rounded-full p-1">
		<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d={isValid ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'} />
		</svg>
	</div>
	<span class="ml-3 text-sm font-medium">{textError}</span>
</li>