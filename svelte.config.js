// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			out: 'out',
			precompress: true,
			envPrefix: 'CHEMIKART_',
			assets: 'static'
		}),
		csrf: {
			checkOrigin: false
		}
	},
	preprocess: [vitePreprocess(), sequence([preprocessMeltUI()])]
};
export default config;
