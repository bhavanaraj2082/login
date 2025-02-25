<!-- <script>
    import OrderStatusResult from "$lib/components/OrderStatus/OrderStatusResult.svelte"
    export let data
</script>
<div>
    <OrderStatusResult {data}/>
</div> -->

<script>
    import OrderStatusResult from "$lib/components/OrderStatus/OrderStatusResult.svelte";
    export let data;
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=->",data);
</script>
<div>
    {#if data?.error}
    <div class="max-w-2xl mx-auto p-4 bg-red-100 text-red-600 border border-red-600 rounded-lg shadow-md text-center mb-5">
        We couldn't find your order. Kindly review the provided information and try once more.
    </div>
        {:else}
        <OrderStatusResult {data}/>
    {/if}
</div>