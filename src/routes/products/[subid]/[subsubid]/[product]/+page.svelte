<script>
    import ProductDetails from "$lib/components/ProductInfoPopups/ProductDetails.svelte";
    import RelatedProductss from "$lib/components/RelatedProductss.svelte";
    import CompSimItems from '$lib/components/CompSimItems.svelte'
    import Description from "$lib/components/ProductInfoPopups/Description.svelte";
    export let data;
</script>

<ProductDetails data = {data.productData}/>
<RelatedProductss relatedProducts={data.relatedProducts}/>  
<CompSimItems differentProducts={data.differentProducts}/>
<Description data = {data.productData}/>