<script context="module">
	import Returns from '$lib/components/Returns.svelte';

	export const meta = {
		title: 'Returns',
		component: Returns
	};
</script>

<script>
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import '../../app.css';
</script>

<Template let:args>
	<Returns></Returns>
</Template>

<Story name="Returnspage" />
