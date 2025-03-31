<script>
	export let title;
	export let items = [];
	export let isSubcategory = false;
	export let linkPrefix;
</script>

{#if items.length > 0}
	<div class='pb-4'>
		<h3 class="text-xl font-bold mb-4">{title}</h3>
		<section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each items as item}
				<a
					href="{linkPrefix}{isSubcategory
						? item?.category?.urlName + '/' + item?.urlName
						: item?.urlName}"
					class="block group">
					<div class="flex flex-col justify-center items-center h-40 gap-4 shadow-md rounded-md p-6 cursor-pointer transform transition-all duration-500 ease-in-out group-hover:shadow-xl group-hover:bg-gradient-to-br from-gray-100 via-primary-50 to-primary-300 group-hover:from-primary-300 group-hover:to-primary-400 group-hover:text-white bg-white">
						<p class="text-lg font-semibold text-gray-700 group-hover:text-white text-center">{item?.name}</p>
					</div>
				</a>
			{/each}
		</section>
	</div>
{/if}
