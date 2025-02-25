<script>
    import ProductDetails from "$lib/components/ProductInfoPopups/ProductDetails.svelte";
    import RelatedProductss from "$lib/components/RelatedProductss.svelte";
    import CompSimItems from '$lib/components/CompSimItems.svelte'
    export let data;
    // console.log("Data relatedProducts===>:", data);    
</script>
<<<<<<< HEAD
<ProductDetails data = {data.productData}/>
 <!-- {#if data.relatedProducts.length !== 0}
 <RelatedProductss relatedProducts={data.relatedProducts}/>  
{/if} 
{#if data.relatedProducts.length !== 0}
<CompSimItems compareSimilarity={data.compareSimilarity}/>
{/if}  -->
=======

<ProductDetails data={data.productData} isFavorite={data.isFavorite} authedUser={data.authedUser}/>

{#if data.relatedProducts.length !== 0}
    <RelatedProductss relatedProducts={data.relatedProducts}/>  
{/if} 

{#if data.compareSimilarity.length !== 0}
    <CompSimItems compareSimilarity={data.compareSimilarity}/>
{/if} 
>>>>>>> 1e352d1e0985b64d9e97a8bcbeccc6fce9617fc4
