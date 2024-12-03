<script>
    import ProductDetails from "$lib/components/ProductInfoPopups/ProductDetails.svelte";
    import RelatedProductss from "$lib/components/RelatedProductss.svelte";
    import CompSimItems from '$lib/components/CompSimItems.svelte'

    export let data;
    // console.log("Data Records:", data);    
</script>
<ProductDetails data = {data.productData}/>
<RelatedProductss relatedProducts={data.relatedProducts}/>  
<!-- <CompSimItems {data}/> -->
