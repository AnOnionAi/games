<script context="module">
	//import { user } from '$lib/stores/user';

	export async function load({ session }) {
		const _user = session?.user;
		// console.log('user loaded:', _user);
		if (_user) {
			user.setUser(_user);
		}
		return {
			status: 200
		};
	}
</script>

<div class="flex h-full justify-center">
	<slot />
</div>

<style>
</style>
