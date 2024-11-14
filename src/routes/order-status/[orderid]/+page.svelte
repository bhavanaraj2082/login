<script>
    export let data
    import OrderStatusResult from "$lib/components/OrderStatus/OrderStatusResult.svelte"
</script>

<div>
    <OrderStatusResult {data}/>
</div>