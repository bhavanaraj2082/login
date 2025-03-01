<script>
   import Contactupdated from '$lib/components/Contactupdated.svelte';
   export let data;
   import SEO from '$lib/components/SEO.svelte';
	import { PUBLIC_WEBSITE_URL, PUBLIC_COMPBUY_IMAGE_PATH,PUBLIC_WEBSITE_NAME } from '$env/static/public';

   let metadata = {
		title: `Contact-Us | Communications Center | ${PUBLIC_WEBSITE_NAME}` || 'Default Product Title',
		description: `Contact or Drop an E-mail for any queries.Our  support team will respond to your query within 1 business day.` || 'Default description',
		keywords: `chemical distributor,chemical product Distributor,Contact Us, communications center`,
		urlPath: `${PUBLIC_WEBSITE_URL}/contact-us` || 'Default URl',
		schema: {
			"@context": "https://schema.org",
			"@type": "Webpage",
			"name": `Contact-Us | Communications Center | ${PUBLIC_WEBSITE_NAME}`  || 'Default Product Title',
			"description": `Contact or Drop an E-mail for any queries.Our support team will respond to your query within 1 business day.` || 'Default description',
			"url":  `${PUBLIC_WEBSITE_URL}/contact-us`,
			"brand": {
    		"@type": "Brand",
    		"name": `${PUBLIC_WEBSITE_NAME}`
  		},
		}
	};
</script>

<SEO {metadata} />
<Contactupdated {data}/>