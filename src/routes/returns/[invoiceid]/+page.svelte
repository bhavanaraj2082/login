<script>
	import InvoiceDatailes from "$lib/components/ReturnStatus/InvoiceDatailes.svelte";
	import SelectItems from "$lib/components/ReturnStatus/SelectItems.svelte";
    export let data;

</script>
<InvoiceDatailes {data}/>
<SelectItems {data}/>