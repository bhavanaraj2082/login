<script>
	import { goto } from '$app/navigation';
	import { authedUser } from '$lib/stores/mainStores.js';
    import ShareCart from '$lib/components/Cart/ShareCart.svelte';
    import { onMount } from 'svelte';
    export let data
    onMount(()=>{
        if(!$authedUser?.id){
        goto('/login')
    }
    })
</script>

<ShareCart cartData = {data.cart.cart}/>