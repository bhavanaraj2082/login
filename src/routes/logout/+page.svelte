<script>
	import { authedUser, cartTotalComps, cartTotal } from '$lib/stores/mainStores.js';
	import { onMount } from 'svelte';
	
	export let data;
	console.log(data, "data from forgot");
	onMount(() => {
	  cartTotal.set(0);
	  cartTotalComps.set(0);
	  authedUser.set({ username: "", email: "", userId: "" });
	  localStorage.setItem('totalComps', 0);
	  localStorage.setItem('totalPrice', 0);
	  localStorage.removeItem('cartExpiration');
	  localStorage.setItem('cart', JSON.stringify([]));
	  
	  console.log('All local data cleared');
	});
  </script>
