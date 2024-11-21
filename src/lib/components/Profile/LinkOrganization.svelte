<script>
    import { enhance } from '$app/forms';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()

    export let recordId
    export let organizationAddress
    export let shippingAddress
    export let billingAddress
    export let paymentAddress

    let activeAddressType = ''
    let toggleEdit = false
    let activeAddress
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
   
    let errors = {}
    


    $:(()=>{
        if(activeAddressType === "shipping") {
           shippingAddress === null ? activeAddress = dummy : activeAddress = shippingAddress
        }
        if(activeAddressType === "billing"){
           billingAddress === null ? activeAddress = dummy : activeAddress = billingAddress
        }
        if(activeAddressType === "payment"){
           paymentAddress === null ? activeAddress = dummy : activeAddress = paymentAddress
        } 
        if(activeAddressType === "organization"){
            organizationAddress === null ? activeAddress = dummy : activeAddress = organizationAddress  
        } 
    })()

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



    const handleRadio = (address)=>{
        if(address === "shipping") activeAddress = shippingAddress
        if(address === "billing") activeAddress = billingAddress
    }

    const validateForm = ()=>{
        //console.log(organizationName);
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
            toggleEdit = false
            activeAddressType = ''
            dispatch("onSuccess",result.data)
            await update()
        }
    }
}
</script>

<div class="border shadow-sm rounded-md p-5 bg-white">
    {#if !toggleEdit}
    <div class=" max-w-2xl">
        <h1 class=" text-xl font-bold flex flex-col sm:flex-row sm:items-end gap-1">Link Your Organization <span class=" font-normal text-xs"><span class=" text-sm font-bold text-red-500">*</span>Represent required fields</span></h1>
        <p class="mt-3 text-sm font-bold">Has your organization ordered from us before?</p>
        <form class="my-6 flex flex-col sm:flex-row flex-wrap gap-y-3" 
         method="POST" action="?/linkOrganization" use:enhance={handleSubmit}>
         <input type="hidden" name="recordId" value={recordId}>
            <div class=" w-full">
                <label class=" text-xs md:text-sm font-medium" for="customerNumber"><span class=" text-sm font-bold text-red-500">*</span>Customer Number</label><br>
                <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500"
                 type="text" name="customerNumber"/>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="transactionType"><span class=" text-sm font-bold text-red-500">*</span>Transactional Information</label><br>
                    <select name="transactionType" id=""
                    class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500">
                        <option class=" hover:bg-primary-200" value="order number">Order Number</option>
                        <option class=" hover:bg-primary-200" value="quote reference">Quote Reference</option>
                        <option class=" hover:bg-primary-200" value="invoice number">Invoice Number</option>
                    </select>
                </div>
               
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="transactionNumber">Selected Number</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500" 
                    type="text" name="transactionNumber"/>
                </div>
            </div>
            
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <button type="submit" class=" w-full rounded py-1.5 font-medium text-white hover:bg-primary-600 bg-primary-500 border-1 border-primary-500">Submit</button>
                <button type="button" class=" w-full rounded py-1.5 font-medium text-primary-500 hover:bg-primary-50 bg-white border-1 border-primary-500">Cancel</button>
            </div>
        </form>

     <h1>Not sure? Continue Registration</h1>
     <button type="button" on:click={()=>toggleEdit = true} class=" my-3 w-56 md:w-64 rounded py-2 self-end font-medium text-4s text-white bg-primary-500 hover:bg-primary-600">Complete Registration</button>
    </div>
    {/if}
    {#if toggleEdit}
    <section>
        <h1 class=" text-xl font-bold capitalize">Add or Edit Addresses</h1>
        <p class=" text-xs font-normal mb-4"><span class=" text-sm font-bold text-red-500">*</span>Represent required fields</p>
        <label class=" text-xs md:text-sm font-medium" for="forSelect"><span class=" text-sm font-bold text-red-500">*</span>Select Address</label><br>
        <select bind:value={activeAddressType} id="forSelect"
        class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500">
            <option value="shipping">Shipping Address</option>
            <option value="billing">Billing Address</option>
            <option value="payment">Payment Address</option>
            <option value="organization">Organization/Office Address</option>
        </select>
        {#if activeAddressType.length}
        <div class=" max-w-2xl mt-4">
        <h2 class=" text-lg font-bold capitalize"> Edit {activeAddressType} Address</h2>
         {#if activeAddressType === "payment" || activeAddressType === "organization"}
         <div>
            <label for="pay" class="text-xs md:text-sm font-medium flex items-center gap-2 mt-2"> 
                <input type="radio" 
                disabled={shippingAddress === null}
                on:change={e=>handleRadio("shipping")}
                name="select" class=" focus:ring-0 text-primary-500 disabled:cursor-not-allowed" id="pay">
                Same as Shipping Address
            </label>
            <label for="org" class="text-xs md:text-sm font-medium flex items-center gap-2 mt-2"> 
                <input type="radio" 
                disabled={billingAddress === null}
                on:change={e=>handleRadio("billing")}
                name="select" class=" focus:ring-0 text-primary-500 disabled:cursor-not-allowed" id="org">
                Same as Billing Address
            </label>
         </div>
         {/if}
         {#if activeAddressType === "billing"}
         <div>
            <label for="bill" class="text-xs md:text-sm font-medium flex items-center gap-2 mt-2"> 
                <input type="radio"
                on:change={e=>handleRadio("shipping")} 
                disabled={shippingAddress === null}
                class=" focus:ring-0 text-primary-500 disabled:cursor-not-allowed" id="bill">
                Same as Shipping Address
            </label>
         </div>
         {/if}
        <form class="my-3 flex flex-col sm:flex-row flex-wrap gap-y-3"
        method="POST" action="?/editAddresses" use:enhance={handleSubmit}>
           <input type="hidden" name="recordId" value={recordId}>
           <input type="hidden" name="addressType" value={activeAddressType}>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="organizationName"><span class=" text-sm font-bold text-red-500">*</span>Organization</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500"
                     type="text" name="organizationName" bind:value={activeAddress.organizationName}/>
                     {#if errors?.organizationName}
				      <span class="text-red-400 text-xs">{errors.organizationName}</span>
			          {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="attentionTo"><span class=" text-sm font-bold text-red-500">*</span>Attention To</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500"
                     type="text" name="attentionTo" bind:value={activeAddress.attentionTo}/>
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
                         type="text" name="department" bind:value={activeAddress.department}/>
                         {#if errors?.department}
                         <span class="text-red-400 text-xs">{errors.department}</span>
                         {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="building">
                        Building/Room</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500" 
                    type="text" name="building" bind:value={activeAddress.building}/>
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
                        type="text" name="street" bind:value={activeAddress.street}/>
                        {#if errors?.street}
                        <span class="text-red-400 text-xs">{errors.street}</span>
                        {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="city">
                        <span class=" text-sm font-bold text-red-500">*</span>City</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500" 
                    type="text" name="city" bind:value={activeAddress.city}/>
                    {#if errors?.city}
                    <span class="text-red-400 text-xs">{errors.city}</span>
                    {/if}
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="state"><span class=" text-sm font-bold text-red-500">*</span>State</label><br>
                    <select name="state" bind:value={activeAddress.state}
                    class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500">
                        {#each states as item}
                            <option value={item}> {item}</option>
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
                    type="text" name="postalCode" bind:value={activeAddress.postalCode}/>
                    {#if errors?.postalCode}
                    <span class="text-red-400 text-xs">{errors.postalCode}</span>
                    {/if}
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="location">
                        <span class=" text-sm font-bold text-red-500">*</span>Location</label><br>
                    <select name="location" bind:value={activeAddress.location}
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
                <button class=" w-full rounded py-1.5 font-medium text-white hover:bg-primary-600 bg-primary-500 border-1 border-primary-500">Submit</button>
                <button on:click={()=>toggleEdit = false} class=" w-full rounded py-1.5 font-medium text-primary-500 hover:bg-primary-50 bg-white border-1 border-primary-500">Cancel</button>
            </div>
        </form>
        </div>
        {/if}
    </section>
    {/if}
</div>