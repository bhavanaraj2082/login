<script>
    import Helpsupport from '$lib/components/Help-Support/Help-support.svelte'
	export let data;
    import SEO from '$lib/components/SEO.svelte';
	import {
		PUBLIC_WEBSITE_URL,
		PUBLIC_COMPBUY_IMAGE_PATH,
		PUBLIC_WEBSITE_NAME
	} from '$env/static/public';

    let metadata = {
		title: `Help Support | ${PUBLIC_WEBSITE_NAME}` || 'Default Product Title',
		description:
			`We are here to help!  Use ${PUBLIC_WEBSITE_NAME} Help & Support to answer your questions around ordering, shipping, delivering and more.` ||
			'Default description',
		keywords: `${PUBLIC_WEBSITE_NAME}, Help, Support, ordering, shipping, delivery, faq,chemical product Distributor, Authorized distributor Chemical Distributor, Authorized distributor, statistics, business philosophy, ratings, customers vote, Chemical Distributor, Chemical Products, chemicals, laboratory chemicals, industrial chemicals, specialty chemicals, chemical supply, buy chemicals, chemical solutions, chemical supplier, buy chemical products`,
		urlPath: `${PUBLIC_WEBSITE_URL}/help-support` || 'Default URl',
		schema: {
			'@context': 'https://schema.org',
			'@type': 'Webpage',
			name: `Help and Support | ${PUBLIC_WEBSITE_NAME}` || 'Default Product Title',
			description:
				`We are here to help!  Use ${PUBLIC_WEBSITE_NAME} Help & Support to answer your questions around ordering, shipping, delivering and more.` ||
				'Default product description',
			url: `${PUBLIC_WEBSITE_URL}/help-support`,
			brand: {
				'@type': 'Brand',
				name: `${PUBLIC_WEBSITE_NAME}`
			}
		}
	};
</script>

<SEO {metadata} />
<Helpsupport {data}/>