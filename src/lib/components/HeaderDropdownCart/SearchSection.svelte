<script>
	export let title;
	export let items = [];
	export let isSubcategory = false;
	export let linkPrefix;
</script>

{#if items.length > 0}
	<h3 class="text-xl font-bold">{title}</h3>
	<section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
		{#each items as item}
			<a
				href="{linkPrefix}{isSubcategory
					? item?.expand?.category?.urlName + '/' + item?.urlName
					: item?.urlName}"
				class="block"
			>
				<div
					class="flex flex-col h-full gap-3 border rounded p-4 cursor-pointer hover:border-gray-400"
				>
					<p class="text-sm font-medium text-center">{item?.name}</p>
				</div>
			</a>
		{/each}
	</section>
{/if}
