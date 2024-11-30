<script>
	import Subsubcategory from '$lib/components/Product/subsubcategory.svelte';
	import Filter from '$lib/components/productsFilter/Filter.svelte';
	import { sendMessage } from '$lib/utils.js';
	import { allProducts } from '$lib/stores/filter.js';

	export let data;
	//console.log(data);
	$allProducts = data.products;

	const handlePageChange = (e) => {
		console.log('data1', e);
		let formData = new FormData();
		formData.append('page', JSON.stringify(e.detail));

		sendMessage('?/pageChange', formData, (result) => {
			console.log(result);
			$allProducts = data.products;
		});
	};
</script>

<section class="bg-gray-50 py-10">
	<div class="px-4 lg:w-10/12 mx-auto">
		<!-- <Subsubcategory data={data.productdata} count={data.count} /> -->
		<Filter {data} on:pageChange={handlePageChange} />
	</div>
</section>
