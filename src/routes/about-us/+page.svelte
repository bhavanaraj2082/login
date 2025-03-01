<script>
    import About from "$lib/components/About.svelte";
    import SEO from '$lib/components/SEO.svelte';
	import {
		PUBLIC_WEBSITE_URL,
		PUBLIC_COMPBUY_IMAGE_PATH,
		PUBLIC_WEBSITE_NAME
	} from '$env/static/public';

	let metadata = {
		title: `About Us | ${PUBLIC_WEBSITE_NAME}` || 'Default Product Title',
		description:
			`${PUBLIC_WEBSITE_NAME} company profile, one of the fastest-growing chemical distributor in the world.` ||
			'Default product description',
		keywords: `${PUBLIC_WEBSITE_NAME}, about us, about, information, chemical Distributor, Authorized distributor,Chemical Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Chemical Products, chemicals, laboratory chemicals, industrial chemicals, specialty chemicals, chemical supply, buy chemicals, chemical solutions, chemical supplier, buy chemical products`,
		urlPath: `${PUBLIC_WEBSITE_URL}/about-us` || 'Default URl',
		schema: {
			'@context': 'https://schema.org',
			'@type': 'Webpage',
			name: `About Us | ${PUBLIC_WEBSITE_NAME}` || 'Default Product Title',
			description:
				`${PUBLIC_WEBSITE_NAME} company profile, one of the fastest-growing chemical distributors in the world.` ||
				'Default product description',
			url: `${PUBLIC_WEBSITE_URL}/about-us`,
			brand: {
				'@type': 'Brand',
				name: `${PUBLIC_WEBSITE_NAME}`
			}
		}
	};
</script>
<SEO {metadata} />
<About/>