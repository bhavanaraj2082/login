<script>
	import { SEO } from '$lib/components/SEO.svelte';
  import Application from "$lib/components/Application/Application.svelte";
  export let data;

  let metadata = {
		title: `${PUBLIC_WEBSITE_NAME}: Application` || 'Default Product Title',
		description:
			`Application from ${PUBLIC_WEBSITE_NAME}. ${PUBLIC_WEBSITE_NAME} offers more chemical Applications.` ||
			'Default product description',
            keywords: `${PUBLIC_WEBSITE_NAME}, application, applications, information, chemical Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Chemical Products, chemicals, laboratory chemicals, industrial chemicals, specialty chemicals, chemical supply, buy chemicals, chemical solutions, chemical supplier, buy chemical products`,
		urlPath: `${PUBLIC_WEBSITE_URL}/applications` || 'Default URl',
		schema: {
			'@context': 'https://schema.org',
			'@type': 'Webpage',
			name: `${PUBLIC_WEBSITE_NAME}: Applications` || 'Default Product Title',
			description:
				`Application from ${PUBLIC_WEBSITE_NAME}. ${PUBLIC_WEBSITE_NAME} offers more chemical Applications.` ||
				'Default product description',
			url: `${PUBLIC_WEBSITE_URL}/applications`,
			brand: {
				'@type': 'Brand',
				name: `${PUBLIC_WEBSITE_NAME}`
			}
		}
	};
</script>

<SEO {metadata} />
<Application {data}/>
