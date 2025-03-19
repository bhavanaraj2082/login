<script>
    import { onMount } from 'svelte';
	import '../app.css';
	import { sendMessage } from '$lib/utils.js';
	import { cart,guestCart } from '$lib/stores/cart.js';
	import { Toaster } from 'svelte-sonner';
	import { navigating , page } from '$app/stores';
	import Header from '$lib/components/HeaderDropdownCart/Header.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import LoadingBar from '$lib/components/LoadingBar.svelte';
	import { isLoading } from '$lib/stores/mainStores.js';
	import Footer from '$lib/components/Footer.svelte';
	import { authedUser } from '$lib/stores/mainStores.js';
	import AllowCookies from '$lib/components/AllowCookies.svelte';

	export let data;
    $authedUser = data?.authedUser;
	//let cartData;
	// $:console.log(data,"---------")
   // $:cartData = data?.cart?.cart[0]?.cartItems ||[]
	// authedUser.set(data.locals.authedUser)
	// let isLoggedIn = $authedUser?.id ? true : false

	//$:cart.set(cartData)

	// const guestCartFetch = () => {
	// 	const formdata = new FormData();
	// 	formdata.append('guestCart', JSON.stringify($guestCart));
	// 	sendMessage('/cart?/guestCart', formdata, async (result) => {
	// 	    //console.log("guest cart in coponent",result);
	// 		cart.set(result.cart);
	// 	});
	// };

	// onMount(() => {

	// 	if (!isLoggedIn) {
	// 		if ($guestCart.length) {
	// 			guestCartFetch();
	// 		} else {
	// 			cart.set([]);
	// 		}
	// 	} else {
	// 		cartData = data?.cart?.cart[0]?.cartItems || [];
	// 		cart.set(cartData);
	// 	}

	// });
	$: $isLoading = $navigating !== null;
	$: isAuthRoute = $page.url.pathname === '/signup' || $page.url.pathname === '/forgot' || $page.url.pathname === '/reset-password' || $page.url.pathname === '/signin';
</script>
{#if !isAuthRoute}
 <Header {data}/>
<Breadcrumb/> 
<LoadingBar />
{/if}
<div class="flex-grow sm:px-0 mx-auto {isAuthRoute ? 'w-full' : ''}">
<slot />
</div>
{#if !isAuthRoute}
<Footer />
<Toaster position="bottom-right" richColors />
{/if}