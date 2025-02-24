<script>
    import ProductDetails from "$lib/components/ProductInfoPopups/ProductDetails.svelte";
    import RelatedProductss from "$lib/components/RelatedProductss.svelte";
    import CompSimItems from '$lib/components/CompSimItems.svelte'

    export let data;
    // console.log("Data relatedProducts===>:", data);    
</script>
<ProductDetails data = {data.productData}/>
 <!-- {#if data.relatedProducts.length !== 0}
 <RelatedProductss relatedProducts={data.relatedProducts}/>  
{/if} 
{#if data.relatedProducts.length !== 0}
<CompSimItems compareSimilarity={data.compareSimilarity}/>
{/if}  -->