<script>
    import productlicence from '$lib/data/FooterLinks/productlicence.json';
</script>

<div>
    <h1 class="text-3xl font-bold mb-4 mt-10 text-center">Product License</h1>
    <p class=" leading-relaxed ml-5">
        To allow us to offer the latest technology, some of our products can only be used under specific label licenses. Depending on the product, the label license may restrict quantities, commercial applications, or other specifications. Each license applies only to the products mentioned in the license.
    </p>
    <div class="gap-6 ml-5">
        {#each Object.entries(productlicence) as [key, value]}
            <div class="mt-4">
                <h3 class="font-bold text-primary-400 mb-2">{value.Heading}</h3>
                <p>{value.Description}</p>
                <p class="mt-2">{value.Description2}</p>
            </div>
        {/each}
    </div>
</div>
