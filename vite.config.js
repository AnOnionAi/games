import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	ssr: {
		noExternal: [
			'@fortawesome/free-regular-svg-icons/', '@fortawesome/free-solid-svg-icons']}
};

export default config;
