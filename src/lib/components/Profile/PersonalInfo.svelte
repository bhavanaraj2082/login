<script>
	import { enhance } from '$app/forms';
    import Icon from '@iconify/svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher()
    export let recordId
    export let contact
    export let isEmailVerified
    let {
        email,
        firstName,
        lastName,
        cellPhone,
        alternatePhone,
        gstNumber,
        needsPasswordSetup,
        companyName,
        tanNumber,
        jobtitle,
        companytype
    } = contact
    let toggleEdit = false;
    let errors
    $:console.log(errors);
	const validateForm = ()=>{
		errors={}
            if(!firstName || !/^[A-Za-z\s]+$/.test(firstName)) errors.firstName="First name is required and valid"
            if(!cellPhone || !/^\d{10}$/.test(cellPhone)) errors.cellPhone="Primary phone number is required and valid"
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
        console.log('form result==>',result)
        if(result.type === "success"){
            toggleEdit = false
            dispatch("onSuccess",result.data)
            await update()
        }
    }
}
</script>
<div class="shadow max-w-7xl rounded p-5 bg-white">
    {#if toggleEdit}
    <!-- edit form for contact information -->
    <div class="">
        <h1 class=" text-xl font-bold"> Edit Contact Information <span class=" text-xs font-normal"> <span class=" text-sm font-bold text-red-500">*</span>Represent required fields</span></h1>
        <form class="my-3 flex flex-col sm:flex-row flex-wrap gap-y-3 px-2"
        method="POST" action="?/editContact" use:enhance={handleSubmit}>
            <input type="hidden" name="recordId" value={recordId}>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="firstName">
                        <span class=" text-sm font-bold text-red-500">*</span>First Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500"
                     type="text" name="firstName" bind:value={firstName} on:input={()=>{firstName=firstName.trimStart();}}/>
                     {#if errors?.firstName}
					<span class="text-red-400 text-xs">{errors.firstName}</span>
				     {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="lastName">
                        Last Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="lastName" bind:value={lastName} on:input={()=>{lastName=lastName.trimStart();}}/>
                    <!-- {#if errors?.lastName}
					<span class="text-red-400 text-xs">{errors.lastName}</span>
				    {/if} -->
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
            <div class=" w-full">
                <label class=" text-xs md:text-sm font-medium" for="cellPhone"><span class=" text-sm font-bold text-red-500">*</span>Primary Phone</label><br>
                <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                type="text" name="cellPhone" bind:value={cellPhone} on:input={()=>{cellPhone=cellPhone.trimStart();}}/>
                {#if errors?.cellPhone}
				    <span class="text-red-400 text-xs">{errors.cellPhone}</span>
			    {/if}
            </div>
            <div class=" w-full">
                <label class=" text-xs md:text-sm font-medium" for="alternatePhone"><span class=" text-sm font-bold text-red-500"></span>Alternative Phone </label><br>
                <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                type="text" name="alternatePhone" bind:value={alternatePhone} on:input={()=>{alternatePhone=alternatePhone.trimStart();}}/>
                <!-- {#if errors?.cellPhone}
				<span class="text-red-400 text-xs">{errors.cellPhone}</span>
			    {/if} -->
            </div>            
            </div>
            <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4 pb-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="companyName">Company Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="companyName" bind:value={companyName} on:input={()=>{companyName=companyName.trimStart();}}/>
                    {#if errors?.companyName}
                        <span class="text-red-400 text-xs">{errors.companyName}</span>
                    {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="companytype">Company Type</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="companytype" bind:value={companytype} on:input={()=>{companytype=companytype.trimStart();}}/>
                    {#if errors?.companytype}
                        <span class="text-red-400 text-xs">{errors.companytype}</span>
                    {/if}
                </div>
            </div>

            <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4 pb-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="gstNumber">GST Number</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="gstNumber" bind:value={gstNumber} on:input={()=>{gstNumber=gstNumber.trimStart();}}/>
                    {#if errors?.gstNumber}
                        <span class="text-red-400 text-xs">{errors.gstNumber}</span>
                    {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="jobtitle">Job Title</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="jobtitle" bind:value={jobtitle} on:input={()=>{jobtitle=jobtitle.trimStart();}}/>
                    {#if errors?.jobtitle}
                        <span class="text-red-400 text-xs">{errors.jobtitle}</span>
                    {/if}
                </div>
            </div>

            <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4 pb-4">
                <div class=" w-1/2">
                    <label class=" text-xs md:text-sm font-medium" for="tanNumber">TAN Number</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="tanNumber" bind:value={tanNumber} on:input={()=>{tanNumber=tanNumber.trimStart();}}/>
                    {#if errors?.tanNumber}
                        <span class="text-red-400 text-xs">{errors.tanNumber}</span>
                    {/if}
                </div>
            </div>

            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <button type="button" on:click={()=>{
                    toggleEdit = false
                    window.location.reload()
                }} class=" w-full rounded-md py-1.5 font-medium text-primary-500 hover:bg-primary-50 bg-white border-1 border-primary-500">Cancel</button>
                <button type="submit" class=" w-full rounded-md py-1.5 font-medium text-white hover:bg-primary-600 bg-primary-500 border-1 border-primary-500">Submit</button>
            </div>

        </form>

     </div>
    {/if}

    {#if !toggleEdit}
    <div class="overflow-hidden">
        <h1 class=" font-bold text-4s md:text-lg mb-2">
            Manage Your Personal Information
        </h1>
        <div class="mt-4 px-2">
            <div class=" flex items-center justify-between border-b-1 mt-2 pb-2">
                <h2 class=" font-semibold text-4s">Contact Information</h2>
                <button on:click={()=>toggleEdit = true} class=" w-20 rounded-md py-1.5 font-medium text-xs md:text-sm text-white bg-primary-500 hover:bg-primary-600">Edit</button>
            </div>
            <section class="w-full flex flex-col sm:flex-row flex-wrap gap-y-4 py-3">
                {#if needsPasswordSetup}
                    <div class="w-full flex items-center bg-primary-50 border border-primary-200 rounded-lg p-2">
                        <p class="text-xs text-primary-600">
                            We noticed you haven’t set up a password yet. To keep your account safe, please create one now. 
                            <a href="/reset-password" class="text-primary-600 text-xs font-medium hover:underline hover:text-primary-500">
                                Click here to setup your password
                            </a>
                        </p>
                    </div>
                {:else}
                    <div class="w-full flex sm:flex-row items-center lg:w-1/3 sm:w-1/2">
                        <h4 class="font-normal text-sm">Password:</h4>
                        <a href="/reset-password" class="text-xs text-primary-500 font-semibold ml-2">
                            Reset Password
                        </a>
                    </div>
                {/if}
                <div class="flex sm:flex-col text-sm md:text-4s w-full lg:w-1/3 sm:w-1/2">
                    <h4 class="font-normal text-sm">Name:</h4>
                    {#if !firstName}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <a on:click={() => toggleEdit = true} class="text-primary-500 font-semibold  text-sm hover:underline">
                            Update Name
                        </a>
                    {:else}
                        <p class=" text-sm font-semibold">{firstName || "Update Name"} {lastName || ""}</p>
                    {/if}
                </div>
            
                <div class="w-full flex sm:flex-col items-centre md:ml-20      sm:w-1/2">
                    <label class=" md:ml-10 font-medium" for="cellPhone">
                        <h4 class="font-normal text-sm"><span class="text-red-500 font-semibold">*</span>Primary Phone:</h4>
                    </label>
                    
                    {#if !cellPhone && (firstName && lastName && email || email)}
                   
                        <div class="text-sm text-gray-600 p-2 bg-red-50 items-end  ml-10  border border-red-300 rounded-md">
                            It looks like you haven't updated your phone number yet. 
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <a on:click={() => toggleEdit = true} class="text-primary-500 font-semibold hover:underline cursor-pointer">
                                Update Phone Number
                            </a>
                        </div>
                    {:else}
                        <p class="text-sm ml-2 md:ml-10 font-semibold">{cellPhone || "N/A"}</p>
                        {#if errors?.cellPhone}
                            <span class="text-red-400 text-xs">{errors.cellPhone}</span>
                        {/if}
                    {/if}
                </div>
                <div class="w-full flex sm:flex-col md:ml-1    lg:w-1/3 sm:w-1/2"> 
                    <div class="flex items-center gap-2">
                        <h4 class="font-normal text-sm">Email:</h4>
                    </div>
                    <span class="flex flex-row items-end ">
                        <p class="text-sm font-semibold">{email || "N/A"}</p>
                        <Icon icon="tdesign:verified-filled" class="text-xl ml-2 {isEmailVerified ? 'text-green-500' : 'text-gray-400'}" />
                    </span>
                </div>
            
                <div class="w-full flex sm:flex-col items-centre md:ml-10 lg:w-1/3 sm:w-1/2">
                    <h4 class="font-normal md:ml-20">Alternative Phone:</h4>
                    <p class="text-sm ml-2  md:ml-20 font-semibold">{alternatePhone || "__"}</p>
                </div>
            </section>
            <div class="mt-4">
                <h2 class="font-semibold text-4s border-b-1 pb-2 pt-5">Business Information</h2>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class="font-normal text-sm">Company Name:</h4>
                    <p class=" text-sm ml-2 font-semibold">{companyName || "__"}</p>
                </div>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class=" font-normal text-sm">Company Type:</h4>
                    <p class=" text-sm ml-2 font-semibold">{companytype || "__"}</p>
                </div>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class=" font-normal text-sm">Job Title:</h4>
                    <p class=" text-sm ml-2 font-semibold">{jobtitle || "__"}</p>
                </div>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class=" font-normal text-sm">GST Number:</h4>
                    <p class=" text-sm ml-2 font-semibold">{gstNumber || "__"}</p>
                </div>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class=" font-normal text-sm">TAN Number:</h4>
                    <p class=" text-sm ml-2 font-semibold">{tanNumber || "__"}</p>
                </div>
            </div>
        </div>
    </div>
    {/if}
</div>