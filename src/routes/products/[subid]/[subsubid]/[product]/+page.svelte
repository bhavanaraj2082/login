<script>
    import ProductDetails from "$lib/components/ProductInfoPopups/ProductDetails.svelte";
    import RelatedProductss from "$lib/components/RelatedProductss.svelte";
    import CompSimItems from '$lib/components/CompSimItems.svelte'
    import Description from "$lib/components/ProductInfoPopups/Description.svelte";
    export let data;
    // console.log("Data Records:", data);    
</script>
<ProductDetails {data}/>
<!-- <RelatedProductss relatedProducts={data.relatedProducts}/>   -->
<CompSimItems {data}/>
<Description {data}/>