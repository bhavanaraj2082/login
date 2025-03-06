<script>
	export let metadata = {
		title: 'Default Title',
		description: 'Default description',
		image: null,
		og: {
			title: 'Default OG Title',
			description: 'Default OG Description',
			image: null
		},
		keywords: 'ecommerce, products, shopping, online store',
		urlPath: '', // Add path for canonical URL
		schema: {
			"@context": "https://schema.org",
			"@type": "Product",
			"name":  'Default Product Name',
			"description": 'Default product description',
			"url":'Default product url',
			"brand": {
    		"@type": "Brand",
    		"name": 'Default name'
  		},
		}
	};

	// console.log("SEO----metadata---->",metadata);
</script>

<svelte:head>
	<!-- SEO Metadata -->
	<title>{metadata.title}</title>
	<meta name="twitter:title" content={metadata?.title} />
	<meta property="og:title" content={metadata.og?.title || metadata.title} />

	{#if metadata?.description}
	<meta name="description" content={metadata.description} />
	<meta name="keywords" content={metadata.keywords} />

	<!-- Open Graph Metadata -->
	<meta property="og:description" content={metadata.og?.description || metadata.description} />
	<meta name="twitter:description" content={metadata?.description} />
	{/if}


	{#if metadata?.image || metadata?.og?.image}
		<meta name="img" content={metadata?.image || metadata?.og?.image} />
		<meta property="og:image" content={metadata?.image || metadata.og?.image} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content={metadata?.image || metadata.og?.image} />
	{/if}

	<!-- Canonical URL -->
	 {#if metadata?.urlPath}
	<link rel="canonical" href="{metadata?.urlPath}" />
	{/if}

	<!-- Structured Data (JSON-LD) -->
	{#if metadata.schema}
		{@html `<script type="application/ld+json">${JSON.stringify(metadata.schema)}</script>`}
	{/if}
</svelte:head>
