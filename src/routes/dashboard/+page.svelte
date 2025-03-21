<script>
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { authedUser,cartTotalComps } from '$lib/stores/mainStores.js';
	import Dashboard from '$lib/components/Dashboard.svelte';
    import { onMount } from 'svelte';
	export let data;

	//$:console.log('data',data);
	
	let form2

	 async function submitForm() {
	 	console.log('sync2');
	 	form2.requestSubmit();
	 }

	async function submitAlternateForm() {
		console.log('dfg');
		if(browser){
		    const storedTotalComps = JSON.parse(localStorage.getItem('cart')) || []
		    localStorage.setItem('totalCompsChemi', storedTotalComps.length)
		    syncLocalStorageToStore();	
		}
		
	}

	function handleDataCart() {
		return async ({ result }) => {		
		console.log('handlecart');
		browser ? localStorage.setItem('totalCmi',JSON.stringify(result?.data?.cartData?.cartItems.length)) : ""
			const totalComps  = result?.data?.cartData?.cartItems.length 
			browser ? localStorage.setItem('totalCompsChemi', totalComps) : ""
		    syncLocalStorageToStore();
		};
	}

	function syncLocalStorageToStore() {
		console.log('sync');
        const storedTotalComps = browser ? localStorage.getItem('totalCompsChemi') : 0;
        if (storedTotalComps ) {
            cartTotalComps.set(Number(storedTotalComps));
        }
	}
		
	onMount( async() => {
		try {
			if(browser){
			const existingExpiration = localStorage.getItem('cartExpirationChemi');
			const count = localStorage.getItem('totalCompsChemi');
			//console.log(existingExpiration);
			if (existingExpiration) {
				console.log('first');
				const cartExpirationTime = existingExpiration;
				const currentTime = new Date();
				const currenctISo = currentTime.toISOString()
				if (currenctISo > cartExpirationTime) {
					const newExpirationTime = new Date();
					newExpirationTime.setHours(newExpirationTime.getHours() + 6);
					localStorage.setItem('cartExpirationChemi', newExpirationTime.toISOString());
					if (!$authedUser?.id) {
						console.log('submitalter');
						await submitAlternateForm();
					}
					 else {
						console.log('submitform');
						await submitForm();	
					}
				}
				} else {
				console.log('second');
				if (!$authedUser?.id) {
					await submitAlternateForm();
				}
				 else {
					await submitForm();
				}
				const expirationTime = new Date();
				expirationTime.setHours(expirationTime.getHours() + 6);
				localStorage.setItem('cartExpirationChemi', expirationTime.toISOString());
			}
		}
		} catch (error) {
			console.error('Error fetching menus:', error);
		}
	})


</script>

<form method="POST" action="/?/getCartValue" bind:this={form2} use:enhance={handleDataCart}>
	<input type="hidden" name="loggedInUser" value={$authedUser?.id} />
</form>
<section class="bg-gray-50">
	<div class="px-4 w-full mx-auto">
		<Dashboard {data} />
	</div>
</section>
