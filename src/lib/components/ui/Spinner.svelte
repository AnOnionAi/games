<script>
	export let size = 36;
	let height = size + 'px';
	let width = size + 'px';
</script>

<div
	style="height: {height}; width: {width}"
	class="spinner border-dark-100 border-l-brand-secondary rounded-full border-4 {$$props.class}" />

<style>
	.spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
