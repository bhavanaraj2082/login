<script>
	import Dashboard from '$lib/components/Dashboard.svelte';
	export let data;
	// console.log("dashboard==>",data)
</script>

<section class="bg-gray-50">
	<div class="px-4 w-full mx-auto">
		<Dashboard {data} />
	</div>
</section>
