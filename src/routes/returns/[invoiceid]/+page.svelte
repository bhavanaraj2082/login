<script>
	import InvoiceDatailes from "$lib/components/ReturnStatus/InvoiceDatailes.svelte";
	import SelectItems from "$lib/components/ReturnStatus/SelectItems.svelte";
    export let data;
	const returndata = data.returndata;
	console.log(data)
</script>

<InvoiceDatailes {returndata}/>
<SelectItems {data}/>