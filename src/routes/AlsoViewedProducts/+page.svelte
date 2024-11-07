<script>
    import CustomerAlsoViewed from "$lib/components/CustomerAlsoViewed.svelte";
    export let data;
</script>
<CustomerAlsoViewed fetchedProducts={data.fetchedProducts}/>