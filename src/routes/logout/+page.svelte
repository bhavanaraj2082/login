<script>
	import { authedUser, cartTotalComps, cartTotal } from '$lib/stores/mainStores.js';
	import { goto } from '$app/navigation';

	$: {
		authedUser.set({ username: "", email: "", userId: "" }); // Reset the store properly
		cartTotalComps.set(0);
		cartTotal.set(0);
		localStorage.setItem('totalComps', 0);
		localStorage.setItem('totalPrice', 0);
		localStorage.removeItem('cartExpiration');

		// Delay the navigation to allow other operations to complete
		setTimeout(() => {
			goto('/login');
		}, 0);
	}
</script>
