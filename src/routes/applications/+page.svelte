<script>
  import Application from "$lib/components/Application/Application.svelte";
  import  SEO  from '$lib/components/SEO.svelte';
  import { PUBLIC_WEBSITE_URL, PUBLIC_COMPBUY_IMAGE_PATH,PUBLIC_WEBSITE_NAME } from '$env/static/public';
  export let data;

  let allheadings = data?.categoryData
  .map(item => `${item.name} , `)
  .join('');

  let metadata = {
		title: `Application | ${PUBLIC_WEBSITE_NAME}` || 'Default Product Title',
		description:
			`Application from ${PUBLIC_WEBSITE_NAME}. ${PUBLIC_WEBSITE_NAME} offers more chemical Applications.` ||
			'Default product description',
            keywords: `${PUBLIC_WEBSITE_NAME}, ${allheadings} applications, information, chemical Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Chemical Products, chemicals, laboratory chemicals, industrial chemicals, specialty chemicals, chemical supply, buy chemicals, chemical solutions, chemical supplier, buy chemical products`,
		urlPath: `${PUBLIC_WEBSITE_URL}/applications` || 'Default URl',
		schema: {
			'@context': 'https://schema.org',
			'@type': 'Webpage',
			name: `Application | ${PUBLIC_WEBSITE_NAME}` || 'Default Product Title',
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
