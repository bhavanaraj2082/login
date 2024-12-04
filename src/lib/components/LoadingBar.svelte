<script>
	import { isLoading } from '$lib/stores/mainStores.js';
</script>

{#if $isLoading}
	<div class=" w-full fixed overflow-x-hidden left-0 top-0 h-1 bg-primary-300">
		<div class="w-40 h-1 bg-primary-900 animate-loadingbar"></div>
	</div>
{/if}
