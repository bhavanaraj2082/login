<script>
	import { sendMessage } from '$lib/utils.js';
	import { cart,guestCart } from '$lib/stores/cart.js';
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/HeaderDropdownCart/Header.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { authedUser } from '$lib/stores/mainStores.js';
	import AllowCookies from '$lib/components/AllowCookies.svelte';
    import { onMount } from 'svelte';

	export let data;
	//console.log(data,"data");
	let cartData;
	let isLoggedIn = true
	// userData = data?.cart?.cart[0].cartItems ||[]
	
	// $:cart.set(userData)

	const guestCartFetch = () => {
		const formdata = new FormData();
		formdata.append('guestCart', JSON.stringify($guestCart));
		sendMessage('/cart?/guestCart', formdata, async (result) => {
		    //console.log("guest cart in coponent",result);
			cart.set(result.cart);
		});
	};

	onMount(() => {

		if (!isLoggedIn) {
			if ($guestCart.length) {
				guestCartFetch();
			} else {
				cart.set([]);
			}
		} else {
			cartData = data?.cart?.cart[0]?.cartItems || [];
			cart.set(cartData);
		}

	});
	//console.log($cart,"cart");

</script>

 <Header {data}/>
<Breadcrumb/> 
<slot />
 <Toaster position="bottom-right" richColors />
<Footer />
<!-- <AllowCookies /> -->
