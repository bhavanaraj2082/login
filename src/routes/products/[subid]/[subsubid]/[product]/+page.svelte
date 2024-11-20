<script>
    import ProductDetails from "$lib/components/ProductInfoPopups/ProductDetails.svelte";
    import RelatedProductss from "$lib/components/RelatedProductss.svelte";
    export let data;
</script>

<ProductDetails data = {data.productData}/>
<RelatedProductss relatedProducts={data.relatedProducts}/>  