<script>
	//import { invalidate } from '$app/navigation';
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
        companyName
    } = contact

    let toggleEdit = false;
    let togglePass = false;
    let toggleGST = false;
    let toggleCompany = false;


    let errors
    $:console.log(errors);
	const validateForm = ()=>{
		errors={}
            if(!firstName || !/^[A-Za-z\s]+$/.test(firstName)) errors.firstName="First name is required and valid"
            // if(!/^[A-Za-z\s]+$/.test(lastName)) errors.lastName="Last name must be valid"
            if(!cellPhone || !/^\d{10}$/.test(cellPhone)) errors.cellPhone="Primary phone number is required and valid"
            // if(!gstNumber || !/^\d{10}$/.test(gstNumber)) errors.gstNumber="Enter Valid GST Number"
            
            // if(!cellPhone || !/^\d{10}$/.test(cellPhone)) errors.cellPhone="Cell phone number is required and valid"
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
            <!-- <div class=" w-full">
                <label class=" text-xs md:text-sm font-medium" for="email"><span class=" text-sm font-bold text-red-500">*</span>Email</label><br>
                <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded p-2 text-sm focus:border-primary-500" 
                type="text" name="email" value={email}/>
            </div> -->
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="firstName">
                        <span class=" text-sm font-bold text-red-500">*</span>First Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500"
                     type="text" name="firstName" bind:value={firstName}/>
                     {#if errors?.firstName}
					<span class="text-red-400 text-xs">{errors.firstName}</span>
				     {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="lastName">
                        Last Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="lastName" bind:value={lastName}/>
                    <!-- {#if errors?.lastName}
					<span class="text-red-400 text-xs">{errors.lastName}</span>
				    {/if} -->
                </div>
            </div>
            <div class=" w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
            <div class=" w-full">
                <label class=" text-xs md:text-sm font-medium" for="cellPhone"><span class=" text-sm font-bold text-red-500">*</span>Primary Phone</label><br>
                <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                type="text" name="cellPhone" bind:value={cellPhone}/>
                {#if errors?.cellPhone}
				    <span class="text-red-400 text-xs">{errors.cellPhone}</span>
			    {/if}
            </div>
            <div class=" w-full">
                <label class=" text-xs md:text-sm font-medium" for="alternatePhone"><span class=" text-sm font-bold text-red-500"></span>Alternative Phone </label><br>
                <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                type="text" name="alternatePhone" bind:value={alternatePhone}/>
                <!-- {#if errors?.cellPhone}
				<span class="text-red-400 text-xs">{errors.cellPhone}</span>
			    {/if} -->
            </div>            
            </div>
            <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4 pb-4">
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="companyName">Company Name</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="companyName" bind:value={companyName}/>
                    {#if errors?.companyName}
                        <span class="text-red-400 text-xs">{errors.companyName}</span>
                    {/if}
                </div>
                <div class=" w-full">
                    <label class=" text-xs md:text-sm font-medium" for="gstNumber">GST Number</label><br>
                    <input class=" outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500" 
                    type="text" name="gstNumber" bind:value={gstNumber}/>
                    {#if errors?.gstNumber}
                        <span class="text-red-400 text-xs">{errors.gstNumber}</span>
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
    <!-- contact inforation -->
    <div class="overflow-hidden">
        <h1 class=" font-bold text-4s md:text-lg mb-2">
            Manage Your Personal Information
        </h1>
        <div class="mt-4 px-2">
            <div class=" flex items-center justify-between border-b-1 mt-2 pb-2">
                <h2 class=" font-semibold text-4s">Contact Information</h2>
                <button on:click={()=>toggleEdit = true} class=" w-20 rounded-md py-1.5 font-medium text-xs md:text-sm text-white bg-primary-500 hover:bg-primary-600">Edit</button>
            </div>
            <section class=" w-full flex flex-col sm:flex-row flex-wrap gap-y-4 py-3">
                <div class="flex sm:flex-row items-center text-sm md:text-4s w-full sm:w-1/2">
                    <h4 class="font-medium">Name :</h4>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    {#if !firstName}
                    <a on:click={() => toggleEdit = true} class="text-primary-500 font-medium ml-2 text-sm hover:underline">
                        Update Name
                    </a>
                    {:else}
                        <p class="ml-2 text-sm">{firstName || "Update Name"} {lastName || ""}</p>
                    {/if}
                </div>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2">
                    <label class="text-xs md:text-sm font-medium" for="cellPhone">
                        <span class="text-sm font-bold text-red-500">*</span>Primary Phone :
                    </label><br>
                    {#if !cellPhone && (firstName && lastName && email || email)}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <p class="text-sm text-gray-600 p-2 bg-red-50 border border-red-300 rounded-md">
                            It looks like you haven't updated your phone number yet. 
                            <a on:click={() => toggleEdit = true} class="text-primary-500 font-semibold hover:underline cursor-pointer">
                                Update Phone Number
                            </a>
                        </p>
                    {:else}
                    <!-- <h4 class="font-medium">Primary Phone :</h4> -->
                    <p class=" text-sm ml-2">{cellPhone || "N/A"}</p>
                        {#if errors?.cellPhone}
                            <span class="text-red-400 text-xs">{errors.cellPhone}</span>
                        {/if}
                    {/if}
                </div>
                <!-- <div class=" w-full flex sm:flex-row items-center sm:w-1/2">
                    <h4 class="font-medium">Primary Phone :</h4>
                    <p class=" text-sm ml-2">{cellPhone || "update cellPhone"}</p>
                </div> -->
                <div class=" w-full flex sm:flex-row items-center sm:w-1/2">
                    <h4 class="font-medium">Alternative Phone :</h4>
                    <p class=" text-sm ml-2">{alternatePhone || "--"}</p>
                </div>
                <div class=" w-full flex sm:flex-row items-center sm:w-1/2">
                    <div class="flex items-center gap-2">
                    <h4 class="font-medium">Email:</h4>
                </div>
                <p class=" text-sm ml-2">{email || "N/A"}</p>
                <Icon icon="tdesign:verified-filled" class=" text-xl ml-2 {isEmailVerified ? "text-green-500":"text-gray-400"}"/>
                </div>
                {#if needsPasswordSetup}
                <div class="w-full flex items-center bg-primary-50 border border-primary-200 rounded-lg p-2">
                    <p class="text-xs text-primary-600">
                        We noticed you haven’t set up a password yet. To keep your account safe, please create one now. 
                        <a href="/reset-password" class="text-primary-600 text-xs font-medium hover:underline hover:text-primary-500">Click here to setup your password</a>
                    </p>
                </div>
                {:else}
                <div class=" w-full flex sm:flex-row items-center sm:w-1/2">
                    <h4 class="font-medium">Password :</h4>
                    <a href="/reset-password" class="text-xs text-primary-500 font-semibold ml-2">Reset Password</a>
                    <div class=" flex items-center gap-2 -mt-1.5">
                        <!-- <p class="pt-2 text-lg ml-2">*******</p> -->
                    </div>
                </div>
                {/if}
            </section>
            <div class="mt-4">
                <h2 class="font-semibold text-lg border-b-1 pb-2">Business Information</h2>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class="font-medium">Company Name:</h4>
                    <p class=" text-sm ml-2">{companyName || "--"}</p>
                </div>
                <div class="w-full flex sm:flex-row items-center sm:w-1/2 mt-2 pb-2">
                    <h4 class=" font-medium">GST Number:</h4>
                    <p class=" text-sm ml-2">{gstNumber || "--"}</p>
                </div>
            </div>
        </div>
    </div>
{/if}
</div>