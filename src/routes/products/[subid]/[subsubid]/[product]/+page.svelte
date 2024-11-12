<script>
    import Filter from "$lib/components/ProductsFilter.svelte";
    import Product from "$lib/components/Product/product.svelte";
    export let data ;
</script>

<div>

  <Product/>
  <Filter {data} />
</div>

   