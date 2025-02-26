<script>
	import MyOrders from "$lib/components/DashboardPage/MyOrders.svelte";
    export let data;
    // console.log("ordersin FE====>",data)
</script>
<div class="bg-gray-50">
    <MyOrders {data}/>
</div>
