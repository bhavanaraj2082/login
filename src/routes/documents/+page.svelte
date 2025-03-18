<script>
    import SafetyDataSheets from '$lib/components/Document/SafetyDataSheets.svelte';
    export let data;
    import SEO from '$lib/components/SEO.svelte';
    import { PUBLIC_WEBSITE_URL, PUBLIC_COMPBUY_IMAGE_PATH,PUBLIC_WEBSITE_NAME } from '$env/static/public';

    let metadata = {
		title: `Documents | ${PUBLIC_WEBSITE_NAME}` || 'Default Product Title',
	};
</script>
<SEO {metadata} />
<div class='bg-gray-50 mx-auto max-w-7xl'>
    <SafetyDataSheets {data}/>
</div>