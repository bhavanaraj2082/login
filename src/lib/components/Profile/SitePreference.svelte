<script>
	import { enhance } from '$app/forms';
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()

    export let recordId
    export let sitePreferences
    export let changeTabs

    let { productEntryType,noOfQuickOrderFields,noOfOrdersPerPage,noOfQuotesPerPage } = sitePreferences

    let productEntry = productEntryType || "Manual Entry"
    let quickOrder = noOfQuickOrderFields || 3
    let orderPage = noOfOrdersPerPage || 3
    let quotePage = noOfQuotesPerPage || 3

    const increment = (type)=>{
        if(type === 'quickorder') quickOrder++
        if(type === 'orderpage') orderPage++
        if(type === 'quotepage') quotePage++

    }
    const decrement = (type)=>{
        if(type === 'quickorder') quickOrder === 3 ? quickOrder = 3 :quickOrder--
        if(type === 'orderpage') orderPage === 3 ? orderPage = 3 :orderPage--
        if(type === 'quotepage') quotePage === 3 ? quotePage = 3 :quotePage--

    }

    $: preferences = {
        productEntryType:productEntry,
        noOfQuickOrderFields:quickOrder,
        noOfOrdersPerPage:orderPage,
        noOfQuotesPerPage:quotePage
    }

const handleSubmit =()=>{
    return async({result,update})=>{
        console.log(result);
        if(result.type === "success"){
            dispatch("onSuccess",result.data)
            await update()
        }
    }
}
</script>

<div class="border shadow-sm rounded-md p-5 bg-white">

    <div class=" max-w-2xl">
        <h1 class=" text-xl font-bold"> Manage Your Site Preferences</h1>
        <p class="mt-3 text-sm font-bold">Order/Quote Preference</p>
        <form class="my-3 flex flex-col sm:flex-row flex-wrap gap-y-6"
        method="POST" action="?/editSitePreferences" use:enhance={handleSubmit}>
            <input type="hidden" name="recordId" value={recordId}>
            <input type="hidden" name="preferences" value={JSON.stringify(preferences)}>
            <div class=" w-full">
                <label class=" text-xs md:text-sm font-medium" for="lastname">Product Entry Preference</label><br>
                <select bind:value={productEntry}
                class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500">
                    <option class=" hover:bg-primary-200" value="Manual Entry">Manual Entry</option>
                    <option class=" hover:bg-primary-200" value="Bulk Upload">Bulk Upload</option>
                </select>
            </div>

            <div class=" sm:w-full">
            <p class=" text-xs md:text-sm font-medium">Default number of entry fields on Quick Order</p>
            <div class="w-fit flex items-center border-1 border-gray-300 rounded">
                <button type="button" on:click={() => decrement('quickorder')} class=" border-r-1 p-2.5 border-gray-300 text-primary-500"
                    ><Icon icon="rivet-icons:minus" class="text-sm"/></button
                >
                <p class="w-20 sm:w-40 mx-3 text-sm font-medium outline-none text-center">{quickOrder}</p>
                <button type="button" on:click={() => increment('quickorder')} class=" border-l-1 border-gray-300 p-2.5 text-primary-500"
                    ><Icon icon="rivet-icons:plus" class="text-sm"/></button
                >
            </div>
            </div>
           
            <div class=" sm:w-full">
                <p class=" text-xs md:text-sm font-medium">Display number of orders on Orders Page</p>
                <div class=" w-fit flex items-center border-1 border-gray-300 rounded">
                    <button type="button" on:click={() => decrement('orderpage')} class=" border-r-1 p-2.5 border-gray-300 text-primary-500"
                        ><Icon icon="rivet-icons:minus" class="text-sm"/></button
                    >
                    <p class="w-20 sm:w-40 mx-3 text-sm font-medium outline-none text-center">{orderPage}</p>
                    <button type="button" on:click={() => increment('orderpage')} class=" border-l-1 border-gray-300 p-2.5 text-primary-500"
                        ><Icon icon="rivet-icons:plus" class="text-sm"/></button
                    >
                </div>
            </div>
           
            <div class=" sm:w-full">
                    <p class=" text-xs md:text-sm font-medium">Display number of quotes on Quote Page</p>
                    <div class="w-fit flex items-center border-1 border-gray-300 rounded">
                        <button type="button" on:click={() => decrement('quotepage')} class=" border-r-1 p-2.5 border-gray-300 text-primary-500"
                            ><Icon icon="rivet-icons:minus" class="text-sm"/></button
                        >
                        <p class="w-20 sm:w-40 mx-3 text-sm font-medium outline-none text-center">{quotePage}</p>
                        <button type="button" on:click={() => increment('quotepage')} class=" border-l-1 border-gray-300 p-2.5 text-primary-500"
                            ><Icon icon="rivet-icons:plus" class="text-sm"/></button
                        >
                    </div>
            </div>
                   

           
            
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <button type="submit" class=" w-full rounded py-1.5 font-medium text-white hover:bg-primary-600 bg-primary-500 border-1 border-primary-500">Save</button>
                <button type="button" on:click={()=>changeTabs(0)} class=" w-full rounded py-1.5 font-medium text-primary-500 hover:bg-primary-50 bg-white border-1 border-primary-500">Cancel</button>
            </div>
    
        </form>
    
     </div>
     </div>