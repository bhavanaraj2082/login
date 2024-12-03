<script>
    import Filter from '$lib/components/productsFilter/Filter.svelte'
	// import Subsubcategory from '$lib/components/Product/subsubcategory.svelte';
    export let data;

</script>

<div class=" mx-auto md:w-11/12 max-w-7xl">
    <!-- <Subsubcategory data ={data.subproductdata}/> -->
    <Filter {data}/> 
</div>