<script>
  import Herosection from '$lib/components/Herosection.svelte';
  import FeaturedLinks from '$lib/components/FeaturedLinks.svelte';
  import PopularProduct from '$lib/components/PopularProduct.svelte';
  import AboutSection from '$lib/components/AboutSection.svelte';
  import Email from '$lib/components/Email.svelte';
  export let data;
  let PopularProducts=data.PopularProductsData
</script>
<Herosection/>
<FeaturedLinks/>
<PopularProduct {PopularProducts}/>
<AboutSection/>
<Email/>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
