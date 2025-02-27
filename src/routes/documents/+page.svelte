<script>
    import SafetyDataSheets from '$lib/components/Document/SafetyDataSheets.svelte';
    export let data;
</script>
<div class='bg-gray-50'>
    <SafetyDataSheets {data}/>
</div>