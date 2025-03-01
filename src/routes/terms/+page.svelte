<script>
    import Terms from '$lib/components/Terms.svelte'
    import SEO from '$lib/components/SEO.svelte';
	import { PUBLIC_WEBSITE_URL, PUBLIC_COMPBUY_IMAGE_PATH,PUBLIC_WEBSITE_NAME } from '$env/static/public';

    let metadata = {
	title: `Terms and Conditions | ${PUBLIC_WEBSITE_NAME}` || 'Default Product Title',
	description: `${PUBLIC_WEBSITE_NAME} terms and conditions, terms of use, conditions of order` || 'Default product description',
	keywords: `Terms and Conditions, Terms Conditions, Terms, Conditions, ${PUBLIC_WEBSITE_NAME} terms and conditions, ${PUBLIC_WEBSITE_NAME}, terms of use, conditions of order`,
	urlPath: `${PUBLIC_WEBSITE_URL}/terms` || 'Default URl',
	schema: {
		"@context": "https://schema.org",
		"@type": "Webpage",
		"name": `Terms and Conditions  | ${PUBLIC_WEBSITE_NAME}`  || 'Default Product Title',
		"description": `${PUBLIC_WEBSITE_NAME} terms and conditions, terms of use, conditions of order` || 'Default product description',
		"url":  `${PUBLIC_WEBSITE_URL}/terms`,
		"brand": {
		"@type": "Brand",
		"name": `${PUBLIC_WEBSITE_NAME}`
	  },
	}
};
</script>

<SEO {metadata} />
<Terms />