<script>
    import Filter from '$lib/components/productsFilter/Filter.svelte'
	// import Subsubcategory from '$lib/components/Product/subsubcategory.svelte';
    export let data;

</script>

<div>
    <!-- <Subsubcategory data ={data.subproductdata}/> -->
    <Filter {data}/> 
</div>