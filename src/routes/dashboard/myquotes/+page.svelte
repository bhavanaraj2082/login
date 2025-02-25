<script>
	import MyQuotes from "$lib/components/DashboardPage/MyQuotes.svelte";
    export let data;
    console.log("Quotes====>",data)
</script>
<div class="bg-gray-50">
    <MyQuotes {data}/>
</div>
