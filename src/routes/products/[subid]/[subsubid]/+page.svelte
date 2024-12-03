<script>
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation'
	import Subsubcategory from '$lib/components/Product/subsubcategory.svelte';
	import Filter from '$lib/components/productsFilter/Filter.svelte';
	import { sendMessage } from '$lib/utils.js';
	import { allProducts } from '$lib/stores/filter.js';
    import ProductFilter from '$lib/components/ProductsFilter/ProductFilter.svelte';

	export let data;
	$: ({manufacturers,products} = data)
	const handlePage = (e) =>{
		console.log('object',e.detail);
		invalidate('page:data')
	}

	//$:console.log(data.products,"======");
	//$: upd = data
	// $: {
	// 	const query = $page.url.searchParams.get("page") || 1
	// 	if(current !== query){
	// 		current = query
	// 		console.log('object');
	// 		invalidateAll()
	// 	}
	// }


</script>

<section class="bg-gray-50 py-10">
	<div class="px-4 max-w-7xl mx-auto">
		<!-- <Subsubcategory data={data.productdata} count={data.count} />-->
		<!-- <Filter {data} on:pageChange={handlePageChange} />  -->
		 <ProductFilter on:onPageChange={(e)=>handlePage(e)} {manufacturers} {products} />
	</div>
</section>
