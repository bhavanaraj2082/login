<script>
	import MyCart from "$lib/components/DashboardPage/MyCart.svelte";
    export let data;
    console.log("++++>",data)
</script>

<div class="bg-gray-50">
    <MyCart {data}/>
    <!-- <MyCart/> -->
</div>