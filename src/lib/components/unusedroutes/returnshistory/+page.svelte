<script>
	import ReturnHistory from "$lib/components/DashboardPage/ReturnHistory.svelte";
    export let data;
    // console.log("returnsdata FE==>",data)
</script>

<div class="bg-gray-50">
    <ReturnHistory {data}/>
</div>
