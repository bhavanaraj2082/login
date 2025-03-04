<script>
    import Resetpassword from '$lib/components/SignupSigninComps/Resetpassword.svelte'
    export let data
    import SEO from '$lib/components/SEO.svelte';
	import { PUBLIC_WEBSITE_URL, PUBLIC_COMPBUY_IMAGE_PATH,PUBLIC_WEBSITE_NAME } from '$env/static/public';
	// console.log(data,"token");
	let metadata = {
	title: `Reset Password | ${PUBLIC_WEBSITE_NAME}` || 'Default Product Title',
	urlPath: `${PUBLIC_WEBSITE_URL}/reset-password` || 'Default URl',
};
</script>

<SEO {metadata} />
<!-- <Resetpassword token={data.token}/> -->
 <Resetpassword {data} />