<script>
    import productlicence from '$lib/data/FooterLinks/productlicence.json';
</script>
<div>
    <h1 class="text-2xl font-bold mb-4 mt-5 text-center">Product Licenses</h1>
    <p class=" text-justify text-sm lg:ml-5">
        To allow us to offer the latest technology, some of our products can only be used under specific label licenses. Depending on the product, the label license may restrict quantities, commercial applications, or other specifications. Each license applies only to the products mentioned in the license.
    </p>
    <div class="gap-6 lg:ml-5">
        {#each Object.entries(productlicence) as [key, value]}
            <div class="mt-4">
                <h3 class="font-bold text-primary-400 text-justify mb-2">{value.Heading}</h3>
                <p class="text-sm ">{value.Description}</p>
                <p class="mt-3 text-justify text-sm">{value.Description2}</p>
            </div>
        {/each}
    </div>
</div>
