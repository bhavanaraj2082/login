 <script>
	import { enhance } from '$app/forms';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()

    export let recordId
    export let organizationAddress
    export let shippingAddress
    export let billingAddress

    let active = 1
    let activeAddressType ='organization'
    let toggleEdit = false
    let errors = {}

    let dummy = {
        organizationName:'',
        attentionTo:'',
        street:'',
        city:'',
        state:'',
        location:'',
        department:'',
        postalCode:'',
        building:''
    }

    let states = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Lakshadweep",
        "Delhi",
        "Puducherry"
    ];

    let countries = [
       "India"
    ];

    $: activeAddress = organizationAddress === null ? activeAddress = dummy : activeAddress = organizationAddress
     
    $:if(!toggleEdit){
       organizationAddress === null ? activeAddress = dummy : activeAddress = organizationAddress
    }

    $: activeBook = (val,addressType)=>{
      Object.keys(dummy).forEach(key => dummy[key] = "")
      console.log('in activebook' ,val,addressType,dummy);
      console.log(shippingAddress,billingAddress,organizationAddress);
      active = val
      activeAddressType = addressType
      if(addressType === "organization"){
        organizationAddress === null ? activeAddress = dummy : activeAddress = organizationAddress
      }
      if(addressType === "shipping"){
        shippingAddress === null ? activeAddress = dummy : activeAddress = shippingAddress
      }
      if(addressType === "billing"){
        billingAddress === null ? activeAddress = dummy : activeAddress = billingAddress
      }
      //console.log('active address',activeAddress);
    }
     
    console.log('active address',activeAddress);

    const validateForm = ()=>{
		errors={}
            if(!activeAddress.organizationName || !/^[A-Za-z\s]+$/.test(activeAddress.organizationName)) errors.organizationName="Organization name required and valid"
            if(!activeAddress.attentionTo || !/^[A-Za-z\s]+$/.test(activeAddress.attentionTo)) errors.attentionTo="Person name is required and valid"
            if(!activeAddress.department || !/^[A-Za-z\s]+$/.test(activeAddress.department)) errors.department="Department is required and valid"
            if(!activeAddress.street || !/^[A-Za-z0-9\s]+$/.test(activeAddress.street)) errors.street="Street is required and valid"
            if(!/^[A-Za-z0-9\s]+$/.test(activeAddress.building)) errors.building="value must be valid"
            if(!activeAddress.city || !/^[A-Za-z\s]+$/.test(activeAddress.city)) errors.city="City name is required and valid"
            if(!activeAddress.state || !/^[A-Za-z\s]+$/.test(activeAddress.state)) errors.state="State name is required and valid"
            if(!activeAddress.location || !/^[A-Za-z\s]+$/.test(activeAddress.location)) errors.location="Location is required and valid"
            if(!activeAddress.postalCode || !/^[0-9\s]+$/.test(activeAddress.postalCode)) errors.postalCode="Post code is required and valid"
		if(Object.keys(errors).length >0){
			return false
		}else{
			return true
		}
	}
     
    const handleSubmit =({cancel})=>{
        if(!validateForm()){
            cancel()
        }
    return async({result,update})=>{
        if(result.type === "success"){
            await update()
            toggleEdit = false
            active = 1
            dispatch("onSuccess",result.data)
        }
    }
}
 </script>
 <div class="border shadow-sm rounded-md p-5 bg-white">
    {#if toggleEdit}
      <!-- address edit form -->
        <div class=" max-w-2xl">
        <h1 class=" text-xl font-bold capitalize"> Edit Your {activeAddressType} Address <span class=" text-xs font-normal"> <span class=" text-sm font-bold text-red-500">*</span>Represent required fields</span></h1>
        <form class="my-3 flex flex-col sm:flex-row flex-wrap gap-y-3 py-3"
        method="POST" action="?/editAddresses" use:enhance={handleSubmit}>
           <input type="hidden" name="recordId" value={recordId}>
           <input type="hidden" name="addressType" value={activeAddressType}>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="organizationName"><span class=" text-sm font-bold text-red-500">*</span>Organization</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500"
                     type="text" name="organizationName" bind:value={ activeAddress.organizationName }/>
                     {#if errors?.organizationName}
                     <span class="text-red-400 text-xs">{errors.organizationName}</span>
                     {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="attentionTo"><span class=" text-sm font-bold text-red-500">*</span>Attention To</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500"
                     type="text" name="attentionTo" bind:value={activeAddress.attentionTo }/>
                     {#if errors?.attentionTo}
                     <span class="text-red-400 text-xs">{errors.attentionTo}</span>
                     {/if}
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="department">
                        <span class=" text-sm font-bold text-red-500">*</span>Department</label><br>
                        <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500" 
                         type="text" name="department" bind:value={activeAddress.department }/>
                         {#if errors?.department}
                     <span class="text-red-400 text-xs">{errors.department}</span>
                     {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="building">
                        Building/Room</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500" 
                    type="text" name="building" bind:value={activeAddress.building }/>
                    {#if errors?.building}
                     <span class="text-red-400 text-xs">{errors.building}</span>
                     {/if}
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="street">
                        <span class=" text-sm font-bold text-red-500">*</span>Street</label><br>
                        <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500" 
                        type="text" name="street" bind:value={activeAddress.street }/>
                        {#if errors?.street}
                     <span class="text-red-400 text-xs">{errors.street}</span>
                     {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="city">
                        <span class=" text-sm font-bold text-red-500">*</span>City</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500" 
                    type="text" name="city" bind:value={activeAddress.city }/>
                    {#if errors?.city}
                     <span class="text-red-400 text-xs">{errors.city}</span>
                     {/if}
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="state"><span class=" text-sm font-bold text-red-500">*</span>State</label><br>
                    <select name="state" id="" bind:value={activeAddress.state }
                    class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500">
                        {#each states as state}
                            <option value={state}>{state}</option>
                        {/each}
                    </select>
                    {#if errors?.state}
                     <span class="text-red-400 text-xs">{errors.state}</span>
                     {/if}
                </div>
               
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="postalCode">
                        <span class=" text-sm font-bold text-red-500">*</span>Postal Code</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500" 
                    type="text" name="postalCode" bind:value={activeAddress.postalCode }/>
                    {#if errors?.postalCode}
                     <span class="text-red-400 text-xs">{errors.postalCode}</span>
                     {/if}
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="location">
                        <span class=" text-sm font-bold text-red-500">*</span>Location</label><br>
                    <select name="location" bind:value={activeAddress.location }
                    class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500">
                        {#each countries as country}
                            <option value={country}>{country}</option>
                        {/each}
                    </select>
                    {#if errors?.location}
                     <span class="text-red-400 text-xs">{errors.location}</span>
                     {/if}
                </div>
                <div class=" w-full"></div>
            </div>
           
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <button type="submit" class=" w-full rounded py-1.5 font-medium text-white hover:bg-primary-600 bg-primary-500 border-1 border-primary-500">Submit</button>
                <button type="button" on:click={()=>toggleEdit = false} class=" w-full rounded py-1.5 font-medium text-primary-500 hover:bg-primary-50 bg-white border-1 border-primary-500">Cancel</button>
            </div>
        </form>
        </div>
    {:else}
     <div class=" space-y-5">
        <h1 class=" text-xl font-bold">Address Book</h1>
            <section class=" text-sm md:text-lg flex flex-1 items-center overflow-x-scroll scroll sm:overflow-x-hidden py-1">
                <button on:click={()=>activeBook(1,"organization")} class="{1 === active ? " border-b-2 border-primary-500 text-primary-500 transition duration-300 " :"border-white"} border-b-2 shrink-0 font-semibold px-4 py-1">Organization & Mailing</button>
                <button on:click={()=>activeBook(2,"shipping")} class="{2 === active ? " border-b-2 border-primary-500 text-primary-500 transition duration-300 " :"border-white"} border-b-2 shrink-0 font-semibold px-4 py-1">Shipping</button>
                <button on:click={()=>activeBook(3,"billing")} class="{3 === active ? " border-b-2 border-primary-500 text-primary-500 transition duration-300 " :"border-white"} border-b-2 shrink-0 font-semibold px-4 py-1">Billing</button>
            </section>
            <div class=" w-full md:w-2/3 flex flex-col gap-3">
                <div class=" w-full h-40 border-1 font-medium capitalize rounded border-gray-300 p-4 md:p-5 text-xs md:text-sm leading-5">
                   {activeAddress?.organizationName || ""} {activeAddress?.attentionTo || ""} {activeAddress?.department || "" } {activeAddress?.building || ""} {activeAddress?.street || ""} {activeAddress?.city || ""} {activeAddress?.state || ""} {activeAddress?.postalCode || ""} {activeAddress?.location || ""}
                </div>
                <button on:click={()=>toggleEdit = true} class=" w-20 rounded py-2 self-end font-medium text-xs md:text-sm text-white bg-primary-500 hover:bg-primary-600">Edit</button>
            </div>
        </div>
        {/if}
                
    </div>


