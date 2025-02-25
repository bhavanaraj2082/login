<script>
	import { enhance } from '$app/forms';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()
    
    export let recordId
    export let changeTabs

    const handleSubmit =()=>{
        return async({result,update})=>{
            if(result.type === "success"){
                dispatch("onSuccess",result.data)
                await update()
            }
        }
    }
</script>


<div class="shadow rounded p-5 bg-white">
<div class="">
    <h1 class=" text-xl font-bold"> Manage Your Payment Methods</h1>
    <form class="my-3 flex flex-col sm:flex-row flex-wrap gap-y-3"
      method="POST" action="?/editPaymentMethods" use:enhance={handleSubmit}>
        <input type="hidden" name="recordId" value={recordId}>
        <div class="w-full">
            <label class=" text-xs md:text-sm font-medium" for="purchaseOrderNumber">Purchase Order Number</label><br>
            <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500" 
            type="text" name="purchaseOrderNumber"/>
        </div>
        <div class="w-full">
            <label class=" text-xs md:text-sm font-medium" for="requisitionNumber">Requisition Number</label><br>
            <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500" 
            type="text" name="requisitionNumber"/>
        </div>
        <div class=" w-full flex flex-col sm:flex-row sm:justify-between mt-4 gap-2">
            <button type="submit" class=" w-full sm:w-80 rounded py-1.5 mt-0 sm:mt-4 font-medium text-white hover:bg-primary-600 bg-primary-500 border-1 border-primary-500">Submit</button>
            <button type="button" on:click={()=>changeTabs(0)} class="w-full sm:w-80 rounded py-1.5 mt-0 sm:mt-4 font-medium text-primary-500 hover:bg-primary-50 bg-white border-1 border-primary-500">Cancel</button>
        </div>
    </form>
 </div>
 </div>