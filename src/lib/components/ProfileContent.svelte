<script>
	import { authedUser} from '$lib/stores/UserData';
	import { enhance } from '$app/forms';
    import Icon from '@iconify/svelte';
	export let activeProfile;
	let editModalOpen = false;
	let editOrganizationOpen = false;
	let shippingOrganization = false;
    let isopenFormate = false;
    let ccAddresses = "";
    let selectedLanguage = '';
    let selectedOrderNumber = "orderNumber";
    let isPOBox = false;
    let isChanged = false;
    let resultMessage = '';

    export let data;

     $: userprofile  = $authedUser;
    let orderCounts = data?.result?.expand?.chemiDashprofile;
    let organization = data?.result?.expand?.chemiDashprofile;
    let preferences = data?.result?.expand?.chemiDashprofile?.preferences ;
    let organizationData =  data?.result?.expand?.chemiDashprofile;
    let paymentMethod =  data?.result?.expand?.chemiDashprofile;
    let orgnizationLink =  data?.result?.expand?.chemiDashprofile;
       

    function openEditModal() {
		editModalOpen = !editModalOpen;
	}
    function editOrganization() {       
		editOrganizationOpen = !editOrganizationOpen
	}
   
    function editShipping() {
		shippingOrganization = !shippingOrganization
	}
    function handleCCInput(event) {
        ccAddresses = event.target.value.split(',');
    }
    
    function ToggleFormate(){
        isopenFormate = !isopenFormate;
    }

    function handleCheckboxChange(event, preferenceKey) {
        if (event.target.checked) {
            if (!preferences.includes(preferenceKey)) preferences = [...preferences, preferenceKey];
        } else {
            preferences = preferences.filter(pref => pref !== preferenceKey);
        }
    }

    const updateIsChanged = () => {
        isChanged = true;
    };
    function selectedState() {
        console.log("State selected");
    }

    // console.log('user data', $authedUser );    
    
</script>


<div class="w-full">
	{#if activeProfile === 'Personal Information'}
		<div>
			<div class="border w-full shadow-sm p-4">
                <h1 class="text-xl font-bold text-primary-400 ">Manage Your Personal Info</h1>
                <div class="flex justify-between">
                    <p class="font-semibold text-lg">Contact Information</p>
                    <button class="text-primary-500 " on:click={openEditModal}>Edit</button>
                </div>
                <hr class="border border-primary-200">
                {#if userprofile}
                <div class="grid grid-cols-2 gap-4 mb-10 ">
                  <div>
                    <p>Name</p>
                    <p>{userprofile.username ? userprofile.username : "-"}</p>
                  </div>
                  <div>
                    <p>Primary Phone</p>
                    <p>{userprofile.phoneNumber ? userprofile.phoneNumber : "-"}</p>
                  </div>
                  <div>
                    <p>Email</p>
                    <p>{userprofile.email ? userprofile.email : "-"}</p>
                    <p class="text-xs italic">Please verify your email. <span class="text-primary-400 "><a href="/resetmail">Resend Email</a></span></p>
                  </div>
                  <div>
                    <p>Fax</p>
                    <p>{userprofile.fax ? userprofile.fax : "-"}</p>
                  </div>
                </div>
                <div>
                    <div class="flex justify-between">
                        <p class="text-lg font-bold">Password</p>
                        <a href="/reset" class="text-primary-500">Edit</a>
                    </div>
                    <hr class="border border-primary-200" />
                    <p>Password</p>
                    <p>{userprofile.Password ? '****' : '-'}</p>
                </div>
                {/if}
              </div>
		</div>
	{/if}
   
    {#if activeProfile === 'Site preference'}
    <div>
        <div class="border w-full shadow-md p-10">
            <h1 class="text-xl font-bold text-primary-400">Manage Your Site Preferences</h1>
                <p class="font-semibold text-lg">General</p>
                <div class="flex gap-4 text-sm"><input type="checkbox">Go directly to Product Detail when Search returns 1 result</div>
                    <div>
                        <label for="languages" class="text-xs">Website Language</label>
                        <select name="Language" class="block w-full max-w-80 border outline-none rounded-md p-2 " required>
                            <option value="English">English</option>
                        </select>
                    </div>
                    <div>
                        <label for="Language" class="text-xs">Default SDS Language</label>
                        <select name="Language" bind:value={selectedLanguage}  class="block  w-full max-w-80 border outline-none rounded-md p-2" required>
                            <option value="" disabled selected >Prompt For Every SDS</option>
                            {#each ['Bulgarian', 'Czech', 'Danish', 'Deutsch', 'Greek', 'English', 'Español', 'Estonian', 'Finnish', 'Français', 'Croatian', 'Hungarian', 'Italian','Japanese','Korean','Lithuanian','Latvian','Malaysian','Dutch','Chinese'] as c}
                            <option value={c} class="text-gray-700">{c}</option>
                            {/each}
                        </select>
                    </div>
                    <p class="font-semibold text-lg my-2">Order/Quote Preference</p>
            {#if orderCounts}
                <form action="?/orderdetail" method="post" use:enhance={() => {
                    return async ({ result }) => {
                        if (result.type === 'success') {
                            console.log('data is submitted');
                            location.reload();
                        } else if (result.type === 'error') {
                            console.error("error");                           
                        }
                    };
                }}>
                <input type="hidden" name="userId" value="{orderCounts.id}"/>
                    <div>
                        <label for="Order" class="text-xs">Website Language</label>
                        <select name="Order" bind:value={orderCounts.orderOption} on:change={updateIsChanged} class="block w-full max-w-80 border outline-none rounded-md p-2 " required>
                            <option value="Manual Entry">Manual Entry</option>
                            <option value="Bulk Upload">Bulk Upload</option>
                        </select>
                    </div>
                    <div class="space-y-5 mt-4">
                    <div>
                        <p class="text-xs">Default number of entry fields on Quick Order</p>
                        <div class="flex items-center space-x-4 border-2 px-2 w-28 itmes-center justify-between rounded">
                            <input 
                            type="number" 
                            name="quickOrderCount" 
                            bind:value={orderCounts.quickOrderCount} 
                            min="1" 
                            class="text-lg text-center w-full" 
                            on:input={updateIsChanged} 
                        />
                          </div>
                    </div>
                    <div>
                        <p class="text-xs">Display number of orders on Orders Page</p>
                        <div class="flex items-center space-x-4 border-2 px-2 w-28 itmes-center justify-between rounded">
                            <input 
                            type="number" 
                            name="ordersPageCount" 
                            bind:value={orderCounts.ordersPageCount} 
                            min="1" 
                            class="text-lg text-center w-full" 
                            on:input={updateIsChanged} 
                        />
                          </div>
                    </div>       
                </div> 
                <p class="font-semibold text-lg my-2">Default Shipping Preferences</p>
                <div class="flex gap-3 text-sm"><Icon icon="lsicon:radio-selected-filled" class="text-xl text-primary-500"/>No Preference/Standard Delivery</div>
                <div class="flex mt-2">
                    <button class="border border-primary-400 w-20 py-1 rounded m-2" type="button" >Cancel</button>
                    <button class={`text-white w-20 py-1 rounded m-2 ${!isChanged ? 'bg-primary-400' : 'bg-primary-500'}`} type="submit" disabled={!isChanged} >Save</button>
                </div>
            </form>
            {/if}
        </div> 
    </div>
    {/if}
    {#if activeProfile === 'Email preference'}
    <div class="border w-full shadow-md p-10">
        <div class="my-3 space-y-3">
            <div class="flex justify-between">
                <p class="text-xl font-bold text-primary-500">Mailing Address</p>
                <button class="text-primary-500 " on:click={editOrganization}>Edit</button>
            </div>
            <hr class="border border-primary-200">
            <p class="text-sm">This is where literature and promotional requests made on the site will be mailed.</p>    
            {#if organization}      
                <div class="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col">
                        <label for="organization">*Organization</label>
                        <p class="text-xs ml-2">{organization.organization ? organization.organization : "-"}</p>
                    </div>
                    <div class="flex flex-col">
                        <label for="Department">Department</label>
                        <p class="text-xs ml-2">{organization.dep ? organization.dep : "-"}</p>
                    </div>
                    <div class="flex flex-col">
                        <label for="Building">Building / Room</label>
                        <p class="text-xs ml-2">{organization.building ? organization.building : "-"}</p>
                    </div>
                    <div class="flex flex-col">
                        {#if isPOBox}
                          <label for="poBox">*PO Box</label>
                          <p class="text-xs ml-2">{organization.street ? organization.street : "-"}</p>
                        {:else}
                          <label for="street">*Street</label>
                          <p class="text-xs ml-2">{organization.street ? organization.street : "-"}</p>
                        {/if}
                    </div>
                    <div class="flex flex-col">
                        <label for="City">*City</label>
                        <p class="text-xs ml-2">{organization.city ? organization.city : "-"}</p>
                    </div>
                    <div class="flex flex-col">
                        <label for="State">State</label>
                        <p class="text-xs ml-2">{organization.state ? organization.state : "-"}</p>
                    </div>
                    <div class="flex flex-col">
                        <label for="Postal">*Postal Code</label>
                        <p class="text-xs ml-2">{organization.postno ? organization.postno : "-"}</p>
                    </div>
                    <div class="flex flex-col">
                        <label for="country">Location</label>
                        <p class="text-xs ml-2">{organization.location ? organization.location : "-"}</p>
                    </div>
                </div>
            {/if}
        </div>
        <div >
            <h1 class="text-xl font-bold text-primary-400 mb-4">Manage Your Email Preferences</h1>
            <p class="font-semibold text-lg my-2">Order Confirmation Options</p>
            <p class="font-semibold text-sm">Reduce Your Environmental Footprint By Going Paperless.</p><hr>
            {#if preferences}
            <form method="post" action="?/updateData" use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === 'success') {
                        console.log('data is submitted');
                    } else if (result.type === 'error') {
                        console.error("error");
                    }
                };
            }}> 
                <input type="hidden" name="userId" value="{data.result.expand.chemiDashprofile.id}"/>
                <div class="my-4">
                    <ul class="space-y-3">
                        <li class="flex gap-3 text-sm">
                            <input type="checkbox" name="orderConfirmation" on:change={event => handleCheckboxChange(event, 'orderConfirmation')} checked={preferences.includes('orderConfirmation')}>
                            Send my order confirmation via email.
                        </li>
                        <li class="flex gap-3 text-sm">
                            <input type="checkbox" name="includeAttachment" on:change={event => handleCheckboxChange(event, 'includeAttachment')} checked={preferences.includes('includeAttachment')}>
                            Include the confirmation as an attachment with my order.
                        </li>
                        <li class="flex gap-3 text-sm">
                            <input type="checkbox" name="shipmentTracking" on:change={event => handleCheckboxChange(event, 'shipmentTracking')} checked={preferences.includes('shipmentTracking')}>
                            Send shipment tracking information to my email address.
                        </li>
                        <li class="flex gap-3 text-sm">
                            <input type="checkbox" name="repromiseNotifications" on:change={event => handleCheckboxChange(event, 'repromiseNotifications')} checked={preferences.includes('repromiseNotifications')}>
                            Send repromise notifications to my email address.
                        </li>
                    </ul>
                </div>
                <div>
                    <p class="font-semibold text-sm">Automatically Include Your Team When Orders Are Placed.</p>
                    <p class="text-xs my-2">CC address (comma-separated)</p>
                    <textarea name="ccAddresses" class="w-full h-20 shadow-sm outline-none border-2" on:input={handleCCInput}></textarea>
                </div>
                <div class="flex mt-2">
                    <button class="border border-primary-400 w-20 py-1 rounded m-2" type="button">Cancel</button>
                    <button class="bg-primary-500 text-white w-20 py-1 rounded m-2" type="submit">Save</button>
                </div>
            </form>       
            {/if}   
         </div>
    </div>
    {/if}

    {#if activeProfile === 'Payment methods'}
    <div class="border w-full shadow-md p-10">
        <div class="mb-3 space-y-3">
            <div class="flex justify-between">
                <p class="text-xl font-bold text-primary-500">Shipping Address</p>
                <button class="text-primary-500" on:click={editShipping}>Edit</button>
            </div>
            <hr class="border border-primary-200">
            <p class="text-sm">Manage specific recipient information for your orders. The address that will appear in the cart will be your organization's shipping address that is assigned to your profile.</p>
            {#if organizationData}      
            <div class="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col">
                <label for="organization">* Organization</label>
                <p class="text-xs ml-2">{organizationData.organization ? organizationData.organization : "-"}</p>
            </div>
            <div class="flex flex-col">
                <label for="Department">Department</label>
                <p class="text-xs ml-2">{organizationData.dep ? organizationData.dep : "-"}</p>
            </div>
            <div class="flex flex-col">
                <label for="Building">Building / Room</label>
                <p class="text-xs ml-2">{organizationData.shippingbuilding ? organizationData.shippingbuilding : "-"}</p>
            </div>
            <div class="flex flex-col">
                {#if isPOBox}
                  <label for="poBox">* PO Box</label>
                  <p class="text-xs ml-2">{organizationData.shippingStreetAddress ? organizationData.shippingStreetAddress : "-"}</p>
                {:else}
                  <label for="street">* Street</label>
                  <p class="text-xs ml-2">{organizationData.shippingStreetAddress ? organizationData.shippingStreetAddress : "-"}</p>
                {/if}
            </div>
            <div class="flex flex-col">
                <label for="City">* City</label>
                <p class="text-xs ml-2">{organizationData.shippingCity ? organizationData.shippingCity : "-"}</p>
            </div>
            <div class="flex flex-col">
                <label for="State">State</label>
                <p class="text-xs ml-2">{organizationData.shippingstate ? organizationData.shippingstate : "-"}</p>
            </div>
            <div class="flex flex-col">
                <label for="Postal">* Postal Code</label>
                <p class="text-xs ml-2">{organizationData.billingPostalCode ? organizationData.billingPostalCode : "-"}</p>
            </div>
            <div class="flex flex-col">
                <label for="country">Location</label>
                <p class="text-xs ml-2">{organizationData.location ? organizationData.location : "-"}</p>
            </div>
        </div>
        {/if}
        </div>
        <div class=" space-y-3">
            <h1 class="text-xl font-bold text-primary-400">Manage Your Payment Methods</h1>
            <p>Your Default Reference Numbers</p>
            <button on:click={ToggleFormate} class="flex text-primary-400 gap-2 rounded"><Icon icon="mynaui:info-circle-solid"  class="text-2xl" />Formating Guide</button>
            {#if paymentMethod}
            <form method="post" action="?/ordermethods" use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === 'success') {
                            console.log('submited successfully');
                            location.reload();
                        } else if (result.type === 'error') {
                            console.error("error");
                        }
                };
            }}>
                <input type="hidden" name="userId" value="{paymentMethod.id}"/>
                <div>
                    <p>Purchase Order Number</p>
                    <input type="text" name="orderNumber" class="w-full max-w-96 outline-none p-2 border-2 rounded-md" bind:value={paymentMethod.orderNumber}>
                </div>
                <div>
                    <p>Requisition Number</p>
                    <input type="text" name="requisitionNumber" class="w-full max-w-96 outline-none p-2 border-2 rounded-md" bind:value={paymentMethod.requisitionNumber}>
                </div>
                <div class="flex mt-2">
                    <button class="border border-primary-400 w-20 py-1 rounded m-2" type="button" >Cancel</button>
                    <button class="bg-primary-500 text-white w-20 py-1 rounded m-2" type="submit">Save</button>
                </div>
            </form>
            {/if}
        </div>
    </div>
    {/if}

    {#if activeProfile === "Link Organization"}
    <div>
    <div class="border w-full shadow-md p-10 space-y-3">
        <h1 class="text-xl font-bold text-primary-400">Link or register your organization</h1>
        <p class="text-xs">To place an order, request a quote or see contract pricing, you must either link your organization's information or complete registration.</p>
        <div>
            <p class="text-xl">Has your organization ordered from us before?</p>
            <p class="text-xs">Expedite the process by entering a Customer Number along with a corresponding transaction number.</p>
            <p class="text-xs">* Required Fields</p>
            {#if orgnizationLink}
            <form method="post" action="?/linkOrganization" use:enhance={() => {
                return async ({ result }) => {
                    console.log('result',result);
                    if ( result.data?.updatedata?.type === 'success') {
                        resultMessage = result.data?.updatedata?.message;
                    } else if ( result.data?.updatedata?.type === 'error') {
                        resultMessage = result.data?.updatedata?.message ;
                    } 
                    setTimeout(() => {
                        resultMessage = ''; 
                    }, 3000);
                };
            }}>
                <input type="hidden" name="userId" value="{orgnizationLink.id}"/>
                <div>
                    <p class="flex">* Customer Number<Icon icon="mynaui:info-circle-solid" class="text-primary-400" /></p>
                    <input type="text" name="phone" class="w-full max-w-96 p-1 outline-none border-2 rounded-md" required />
                </div>
                <div>
                    <p class="flex">* Transactional Information<Icon icon="mynaui:info-circle-solid" class="text-primary-400" /></p>
                    <div class="flex gap-4">
                        <select name="transactionType" bind:value={selectedOrderNumber} class="block w-full border outline-none rounded-md p-1" required>
                            <option value="orderNumber">Order Number</option>
                            <option value="invoiceno">Invoice number</option>
                        </select>
                        <input type="text" name="transactionValue" class="w-full max-w-96 p-1 outline-none border-2 rounded-md" required />
                    </div>
                </div>
                <button class="rounded-md bg-primary-400 p-2 px-4 my-3" type="submit">Link Organization</button>
                {#if resultMessage}
                    <p class="text-right text-primary-500">{resultMessage}</p>
                {/if}
            </form>
           
            {/if}
        </div>
        <div>
            <p class="text-xl">Not Sure? Continue Registration.</p>
            <p class="text-xs">You will need to provide some information about your organization. Please have the following information ready:</p>
            <div class="ml-3 my-3">
                <ul class="list-disc list-inside  text-xs ">
                    <li>Shipping, billing & payment addresses</li>
                    <li>The address of your organization’s registered office</li>
                    <li>Primary business activities</li>
                    <li>VAT and sales tax exemption status</li>
                </ul>
            </div>
            <div>
                <a href="/registration" class="rounded-md bg-primary-400 p-2 px-4 my-3">Compleate registration</a>
            </div>
        </div>
    </div>
    </div>
    {/if}
    </div>

    {#if editModalOpen}
    	<div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
    		<div class="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
    			<h2 class="text-lg font-bold">Edit Your Contact Information</h2>
                <p class="pb-4">* Required Fields</p>
    			<form method="post" action="?/updateprofile" use:enhance={() => {
                    return async ({ result }) => {
                        if (result.type === 'success') {
                            location.reload();
                        } else if (result.type === 'error') {
                            console.error("error");
                        }
                    };
                }}>
                <input type="hidden" name="userId" value="{userprofile.id}" />
                    <div class="mb-4">
                      <p class="block text-gray-700">*Email</p>
                      <input class="border p-2 w-full max-w-96 border-primary-200 outline-none rounded" type="email" name="email" bind:value={userprofile.email} />
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <div class="mb-4">
                        <p class="block text-gray-700">*User Name</p>
                        <input class="border w-full border-primary-200 outline-none p-2 rounded" type="text" name="username" bind:value={userprofile.username} />
                      </div>
                      <div class="mb-4">
                        <p class="block text-gray-700">Primary Phone</p>
                        <input class="border w-full border-primary-200 outline-none p-2 rounded" type="text" name="phone" bind:value={userprofile.phoneNumber} />
                      </div>
                      <div class="mb-4">
                        <p class="block text-gray-700">Fax</p>
                        <input class="border w-full border-primary-200 outline-none p-2 rounded max-w-96" type="text" name="fax" bind:value={userprofile.fax} />
                      </div>
                    </div>
                    <div class="flex justify-end">
                      <button class="bg-primary-500 text-white px-4 py-2 rounded mr-2" type="submit">Save</button>
                      <button class="border border-primary-400 px-4 py-2 rounded" type="button" on:click={openEditModal}>Cancel</button>
                    </div>
                  </form>                  
    		</div>
    	</div>
    {/if}


    {#if editOrganizationOpen}
    	<div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
    		<div class="bg-white p-6 rounded shadow-lg w-full max-w-3xl ">
    			<p class="text-xl font-bold">Mailing Address</p>
                <p class="text-sm">This is where literature and promotional requests made on the site will be mailed.</p>
                <p>* Required</p> 
                <div class="flex gap-4">
                    <input type="checkbox" name="Pobox" bind:checked={isPOBox}>
                    <label for="PoBox" class="text-sm">Address is a PO Box</label>
                </div>
                <form method="post"  action="?/updateOrganization" use:enhance={() => {
                    return async ({ result }) => {
                        if (result.type === 'success') {
                            console.log('submited successfully');
                            location.reload();
                        } else if (result.type === 'error') {
                            console.error("error");
                        }
                    };
                }}>
                <input type="hidden" name="userId" value="{organization.id}" />
                <div class="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col">
                    <label for="organization">* Organization</label>
                    <input type="text" name="organization" class="border border-primary-200 outline-none p-1 rounded-md" required bind:value={organization.organization}/>
                </div>
                <div class="flex flex-col">
                    <label for="Department">Department</label>
                    <input type="text" name="dep" class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organization.dep}/>
                </div>
                <div class="flex flex-col">
                    <label for="Building">Building / Room</label>
                    <input type="text" name="building" class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organization.building}/>
                </div>
                <div class="flex flex-col">
                    {#if isPOBox}
                      <label for="poBox">* PO Box</label>
                      <input type="text" name="poBox"   class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organization.street} required/>
                    {:else}
                      <label for="street">* Street</label>
                      <input type="text" name="street"  class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organization.street} required/>
                    {/if}
                </div>
                <div class="flex flex-col">
                    <label for="City">* City</label>
                    <input type="text" name="city" class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organization.city} required/>
                </div>
                <div class="flex flex-col">
                    <label for="state">State</label>
                    <select name="state" bind:value={organization.state} on:change={() => selectedState()}  class="block  border border-primary-200 outline-none rounded-md p-2 "  required>
                        <option value="" disabled selected ></option>
                        {#each ['Andaman and Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhaattisgarh', 'Daman and Diu', 'Delhi', 'Dadra and Nagar Hav.', 'Goa', 'Gujarat', 'Himachal Pradesh','Haryana','Jharkhand','Jammu and Kashmir','Karnataka','Kerala','Lakshadweep','Maharashtra','Megalaya','Manipur','Madhya Pradesh','Mumbai','Mizoram','New Delhi','Nagaland','Orissa','Punjab','Pondicherry','Rajasthan','Sikkim','Telangana','Tamil Nadu','Tripura','Uttaranchal','Uttar Pradesh','West Bengal'] as c}
                        <option value={c} class="text-gray-700">{c}</option>
                      {/each}
                    </select>
                </div>
                <div class="flex flex-col">
                    <label for="postno">* Postal Code</label>
                    <input type="text" name="postno" class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organization.postno} required/>
                </div>
                <div class="flex flex-col">
                    <label for="country">Location</label>
                    <select name="country" bind:value={organization.location}  disabled class="block border border-primary-200 outline-none rounded-md p-2 bg-gray-200 text-gray-700 cursor-not-allowed">
                        <option value="India">India</option>
                    </select>
                </div>
                </div>
                <div class="flex mt-2">
                    <button class="bg-primary-500 text-white px-4 py-2 rounded mr-2" type="submit" >Save</button>
                    <button class="border border-primary-400 px-4 py-2 rounded" type="button" on:click={editOrganization}>Cancel</button>
                </div>
                </form>
    		</div>
    	</div>
    {/if}

    
    {#if shippingOrganization}
    	<div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
    		<div class="bg-white p-6 rounded shadow-lg w-full max-w-3xl ">
    			<p class="text-xl font-bold">Shipping Address</p>
                <p class="text-sm">Manage specific recipient information for your orders. The address that will appear in the cart will be your organization's shipping address that is assigned to your profile.</p>
                <p>* Required</p> 
                <div class="flex gap-4">
                    <input type="checkbox" name="Pobox" bind:checked={isPOBox}>
                    <label for="PoBox" class="text-sm">Address is a PO Box</label>
                </div>
                <form method="post"  action="?/updateShipping" use:enhance={() => {
                    return async ({ result }) => {
                        if (result.type === 'success') {
                            console.log('submited successfully');
                            location.reload();
                        } else if (result.type === 'error') {
                            console.error("error");
                        }
                    };
                }}>
                <input type="hidden" name="userId" value="{organizationData.id}" />
                <div class="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col">
                    <label for="organization">* Organization</label>
                    <input type="text" name="organization" class="border border-primary-200 outline-none p-1 rounded-md" required bind:value={organizationData.organization}/>
                </div>
                <div class="flex flex-col">
                    <label for="department">Department</label>
                    <input type="text" name="dep" class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organizationData.dep}/>
                </div>
                <div class="flex flex-col">
                    <label for="shippingbuilding">Building / Room</label>
                    <input type="text" name="shippingbui    lding" class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organizationData.shippingbuilding}/>
                </div>
                <div class="flex flex-col">
                    {#if isPOBox}
                      <label for="shippingStreetAddress">* PO Box</label>
                      <input type="text" name="shippingStreetAddress"   class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organizationData.shippingStreetAddress} required/>
                    {:else}
                      <label for="shippingStreetAddress">* Street</label>
                      <input type="text" name="shippingStreetAddress"  class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organizationData.shippingStreetAddress} required/>
                    {/if}
                </div>
                <div class="flex flex-col">
                    <label for="shippingCity">* City</label>
                    <input type="text" name="shippingCity" class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organizationData.shippingCity} required/>
                </div>
                <div class="flex flex-col">
                    <label for="State">State</label>
                    <select name="shippingstate" bind:value={organizationData.shippingstate} on:change={() => selectedState()}  class="block  border border-primary-200 outline-none rounded-md p-2 "  required>
                        <option value="" disabled selected ></option>
                        {#each ['Andaman and Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhaattisgarh', 'Daman and Diu', 'Delhi', 'Dadra and Nagar Hav.', 'Goa', 'Gujarat', 'Himachal Pradesh','Haryana','Jharkhand','Jammu and Kashmir','Karnataka','Kerala','Lakshadweep','Maharashtra','Megalaya','Manipur','Madhya Pradesh','Mumbai','Mizoram','New Delhi','Nagaland','Orissa','Punjab','Pondicherry','Rajasthan','Sikkim','Telangana','Tamil Nadu','Tripura','Uttaranchal','Uttar Pradesh','West Bengal'] as c}
                        <option value={c} class="text-gray-700">{c}</option>
                      {/each}
                    </select>   
                </div>
                <div class="flex flex-col">
                    <label for="shippingPostalCode">* Postal Code</label>
                    <input type="text" name="shippingPostalCode" class="border border-primary-200 outline-none p-1 rounded-md" bind:value={organizationData.shippingPostalCode} required/>
                </div>
                <div class="flex flex-col">
                    <label for="country">Location</label>
                    <select name="country" bind:value={organizationData.location} on:change={() => selectedState()} disabled class="block border border-primary-200 outline-none rounded-md p-2 bg-gray-200 text-gray-700 cursor-not-allowed">
                        <option value="India">India</option>
                    </select>
                </div>
                </div>
                <div class="flex mt-2">
                    <button class="bg-primary-500 text-white w-20 py-1 rounded m-2" type="submit">Save</button>
                    <button class="border border-primary-400 w-20 py-1 rounded m-2" type="button" on:click={editShipping}>Cancel</button>
                </div>
                </form>
    		</div>
    	</div>
    {/if}
 
 

{#if isopenFormate}
<div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-lg">
    <div class="flex justify-between text-primary-400">
        <p class="font-bold ">Formating Guide</p>
        <button on:click={ToggleFormate} class="hover:bg-primary-100 rounded-full p-1"><Icon icon="iconoir:xmark" class=" cursor-pointer text-2xl " /></button>
    </div>
    <div class="text-xs space-y-3 mt-3">
        <div class="flex "><span class="w-20">#</span><p class=" w-full max-w-96">Numeric Character (0 through 9)</p></div>
        <div class="flex "><span class="w-20">^</span> <p class=" w-full max-w-96">Alpha Character (A through Z)</p></div>
        <div class="flex "><span class="w-20">*</span><p class=" w-full max-w-96">Alphanumeric Character (A through Z or 0 through 9)</p></div>
        <div class="flex "><span class="w-20">&&</span><p class=" w-full max-w-96">Data between ampersands is a constant value
            (do not enter the ampersand when providing the value)</p></div>
        <div class="flex "><span class="w-20">Space</span><p class=" w-full max-w-96">Indicates break between data</p></div>
        <div class="flex "><span class="w-20">Blank </span><p class=" w-full max-w-96">No restrictions on format</p></div>
    </div>
    </div>
</div>
    
{/if}