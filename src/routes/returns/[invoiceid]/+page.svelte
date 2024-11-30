<script>
	import InvoiceDatailes from "$lib/components/ReturnStatus/InvoiceDatailes.svelte";
	import SelectItems from "$lib/components/ReturnStatus/SelectItems.svelte";
    export let data;
	const returndata = data.returndata;
</script>

<InvoiceDatailes {returndata}/>
<SelectItems {returndata}/>