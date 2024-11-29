<script>
	import { enhance } from '$app/forms';
    import Icon from '@iconify/svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()
    
    export let recordId
    export let emailPreferences

    // let {
    //     isSelectedOption1,
    //     isSelectedOption2,
    //     isSelectedOption3,
    //     isSelectedOption4,
    //     ccAddresses
    // } = emailPreferences

    let toggleEdit = false

    let isOption1 = emailPreferences?.isSelectedOption1 || false
    let isOption2 = emailPreferences?.isSelectedOption2 || false
    let isOption3 = emailPreferences?.isSelectedOption3 || false
    let isOption4 = emailPreferences?.isSelectedOption4 || false

    let addresses = emailPreferences?.ccAddresses || ''

    $: updatedAddreses = Array.isArray(addresses) === true ? addresses : addresses.split(',')
   // $: console.log(updatedAddreses);
    const handleCheckbox = (checked,option)=>{
        if(option === "option1") checked ? (isOption1 = true) : (isOption1 =false)
        if(option === "option2") checked ? (isOption2 = true) : (isOption2 =false)
        if(option === "option3") checked ? (isOption3 = true) : (isOption3 =false)
        if(option === "option4") checked ? (isOption4 = true) : (isOption4 =false)
    }

    $: preferences ={
        option1:"Send shipment tracking information to my email address.",
        isSelectedOption1:isOption1,
        option2:"Send my order confirmation via email.",
        isSelectedOption2:isOption2,
        option3:"Send repromise notifications to my email address.",
        isSelectedOption3:isOption3,
        option4:"Include the confirmation as an attachment with my order.",
        isSelectedOption4:isOption4,
        ccAddresses: updatedAddreses
    }

    const handleSubmit =()=>{
        return async({result,update})=>{
            if(result.type === "success"){
                dispatch("onSuccess",result.data)
                toggleEdit = false
                await update()
            }
        }
    }
</script>

<div class="border shadow-sm md:w-11/12 max-w-7xl mx-auto rounded-md p-5 bg-white">
    {#if toggleEdit}
        <div class=" max-w-2xl">
    <h1 class=" text-xl font-bold"> Manage your Email Preferences</h1>
        <p class=" font-bold text-sm mt-2">Order Confirmation Options</p>
        <form class="my-3 flex flex-col sm:flex-row flex-wrap gap-y-3" 
         method="POST" action="?/editEmailPreferences" use:enhance={handleSubmit}>
         <input type="hidden" name="recordId" value={recordId}>
         <input type="hidden" name="preference" value={JSON.stringify(preferences)}>
        <div class=" text-xs md:text-sm flex flex-col gap-1.5">
            <label for="">
                <input type="checkbox" bind:checked={isOption1} on:change={e=>handleCheckbox(e.target.checked,'option1')} class=" focus:ring-0 text-primary-500 mr-1" id="">
                Send shipment tracking information to my email address.
            </label>
            <label for="">
                <input type="checkbox" bind:checked={isOption2} on:change={e=>handleCheckbox(e.target.checked,'option2')} class=" focus:ring-0 text-primary-500 mr-1" id="">
                Send my order confirmation via email.
            </label>
            <label for="">
                <input type="checkbox" bind:checked={isOption3} on:change={e=>handleCheckbox(e.target.checked,'option3')} class=" focus:ring-0 text-primary-500 mr-1" id="">
                Send repromise notifications to my email address.
            </label>
            <label for="">
                <input type="checkbox" bind:checked={isOption4} on:change={e=>handleCheckbox(e.target.checked,'option4')} class=" focus:ring-0 text-primary-500 mr-1" id="">
                Include the confirmation as an attachment with my order.
            </label>
        </div>
        <div class=" w-full">
            <label class=" text-xs md:text-sm font-medium" for="ccAddress">
            CC Addresses <span class=" text-xs">(comma "," separated addresses)</span></label><br>
            <textarea placeholder="example@gmail.com,example2@gmail.com" class=" placeholder:text-gray-300 outline-none focus:ring-0 border-gray-300 w-full h-28 border-1 font-medium rounded p-2 text-sm focus:border-primary-500" 
              bind:value={addresses} />
        </div>
        <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
            <button type="submit" class=" w-full rounded py-1.5 font-medium text-white hover:bg-primary-600 bg-primary-500 border-1 border-primary-500">Submit</button>
            <button type="button" on:click={()=>toggleEdit = false} class=" w-full rounded py-1.5 font-medium text-primary-500 hover:bg-primary-50 bg-white border-1 border-primary-500">Cancel</button>
        </div>
    </form>

        </div>
    {/if}

    {#if !toggleEdit}
    
        <div class=" space-y-5 flex flex-col max-w-2xl">
            <h1 class=" text-xl font-bold">Email Preferences</h1>
            {#if emailPreferences === null}
        <div class=" space-y-3">
             <p class=" text-xs md:text-sm">No email Preferences are selected</p>
             <button type="button" on:click={()=>toggleEdit = true} class=" w-40 md:w-48 rounded py-2 self-end font-medium text-xs md:text-sm text-white bg-primary-500 hover:bg-primary-600">Select Preferences</button>
        </div>
        {:else}
            <div class=" space-y-2 md:space-y-3">
                <div class=" flex items-center text-xs md:text-sm gap-1 font-medium">
                    <div><Icon icon="codicon:pass-filled"  class=" text-lg md:text-xl {emailPreferences?.isSelectedOption1 ? " text-green-500" : "text-gray-400" }"/></div>
                    <p>{emailPreferences?.option1}</p>
                </div>
                <div class=" flex items-center text-xs md:text-sm gap-1 font-medium">
                    <div><Icon icon="codicon:pass-filled"  class=" text-lg md:text-xl {emailPreferences?.isSelectedOption2 ? " text-green-500" : "text-gray-400" }"/></div>
                    <p>{emailPreferences?.option2}</p>
                </div>
                <div class=" flex items-center text-xs md:text-sm gap-1 font-medium">
                    <div><Icon icon="codicon:pass-filled"  class=" text-lg md:text-xl {emailPreferences?.isSelectedOption3 ? " text-green-500" : "text-gray-400" }"/></div>
                    <p>{emailPreferences?.option3}</p>
                </div>
                <div class=" flex items-center text-xs md:text-sm gap-1 font-medium">
                    <div><Icon icon="codicon:pass-filled"  class=" text-lg md:text-xl {emailPreferences?.isSelectedOption4 ? " text-green-500" : "text-gray-400" }"/></div>
                    <p>{emailPreferences?.option4}</p>
                </div>
            </div>
            <div class="">
                <p class=" font-semibold text-sm md:text-4s">CC Addresses</p>
                <div class=" space-y-1 text-sm md:text-4s font-medium border-1 rounded p-2 sm:p-3 md:p-4">
                    {#each emailPreferences?.ccAddresses as address }
                    <p class=" w-full">{address}</p>
                    {/each}
                </div>
            </div> 
            <button type="button" on:click={()=>toggleEdit = true} class=" w-20 rounded py-2 self-end font-medium text-xs md:text-sm text-white bg-primary-500 hover:bg-primary-600">Edit</button>
    {/if}
        </div>
    {/if}
 </div>