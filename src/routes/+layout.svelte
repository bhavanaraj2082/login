<script>
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/HeaderDropdownCart/Header.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { authedUser } from '$lib/stores/mainStores.js';
	import AllowCookies from '$lib/components/AllowCookies.svelte';

	export let data;
	let userData;
	//console.log(data);
	$: if (data.token.length > 0) {
		userData = JSON.parse(data.token);
	} else {
		userData = data.token;
	}
	// console.log(userData);
	$: authedUser.update((user) => ({ ...user, ...userData }));
</script>

 <Header {data}/>
<Breadcrumb/> 
<slot />
 <Toaster position="bottom-right" richColors />
<Footer />
<!-- <AllowCookies />  -->
