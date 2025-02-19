<script>
	import MyOrders from "$lib/components/DashboardPage/MyOrders.svelte";
    export let data;
    // console.log("====>",data)
</script>
<div class="bg-gray-50">
    <MyOrders {data}/>
</div>
