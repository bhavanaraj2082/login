<script>
  import Herosection from '$lib/components/Herosection.svelte';
  import FeaturedLinks from '$lib/components/FeaturedLinks.svelte';
  import PopularProduct from '../lib/components/PopularProduct.svelte';
  import Aboutus from '../lib/components/Aboutus.svelte';
  import Email from '../lib/components/Email.svelte';
</script>

<Herosection/>
<FeaturedLinks/>
<PopularProduct/>
<Aboutus/>
<Email/>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
