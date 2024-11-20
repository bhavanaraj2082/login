<script>
    import Filter from '$lib/components/productsFilter/Filter.svelte'
	// import Subsubcategory from '$lib/components/Product/subsubcategory.svelte';
    export let data;
    
    // console.log("=====>",dat)
</script>

<div>
    <Filter {data}/>
    <!-- <Subsubcategory {data}/> -->
</div>