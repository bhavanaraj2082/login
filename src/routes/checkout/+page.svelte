<script>
    import Checkout from "$lib/components/Cart/checkout.svelte";
    export let data;
    import { shippingAddress, billingAddress } from "$lib/stores/mainStores.js";
    let order={}
    const handleCheckout = (e)=>{
        order=e.detail;
        order.shippingAddress=$shippingAddress,
        order.billingAddress=$billingAddress,
        console.log(order);
    }
</script>

<Checkout on:orderData={handleCheckout} {data}/>