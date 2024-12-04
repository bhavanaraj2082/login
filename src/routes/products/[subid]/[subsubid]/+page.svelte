<script>
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation'
	import Subsubcategory from '$lib/components/Product/subsubcategory.svelte';
	import Filter from '$lib/components/productsFilter/Filter.svelte';
	import { sendMessage } from '$lib/utils.js';
	import { allProducts } from '$lib/stores/filter.js';
    import ProductFilter from '$lib/components/ProductsFilter/ProductFilter.svelte';

	export let data;
	$: ({manufacturers,products,productCount,subSubCategory} = data)
	const handlePage = (e) =>{
		console.log('object',e.detail);
		invalidate('page:data')
	}


</script>
<section class="bg-gray-50 py-10 ">
	<div class="px-4 max-w-7xl md:w-11/12 mx-auto">
		<!-- <Subsubcategory data={data.productdata} count={data.count} />-->
		<!-- <Filter {data} on:pageChange={handlePageChange} />  -->
		 <ProductFilter
		  on:onPageChange={(e)=>handlePage(e)} 
		  {manufacturers} 
		  {products} 
		  {productCount}
		  {subSubCategory} />
	</div>
</section>
