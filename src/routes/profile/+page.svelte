<script>
  import LinkOrganization from "$lib/components/Profile/LinkOrganization.svelte";
  import BookAddress from "$lib/components/Profile/BookAddress.svelte";
  import ProfileSideBar from "$lib/components/Profile/ProfileSideBar.svelte";
  import EmailPreference from "$lib/components/Profile/EmailPreference.svelte";
  import PersonalInfo from "$lib/components/Profile/PersonalInfo.svelte";
  import PaymentMethod from "$lib/components/Profile/PaymentMethod.svelte";
  import SitePreference from "$lib/components/Profile/SitePreference.svelte";
  export let data;
  //console.log('data',data);
  let activeComp = 0
  let message = ''
  
  $: ({
    id,
    linkOrganization,
    sitePreferences,
    shippingAddress,
    billingAddress,
    organizationAddress,
    paymentAddress,
    emailPreferences,
    paymentMethods,
    ...contact
  } = data.profileData)

 $: recordId = id
  const changeTabs = (value)=>{
    activeComp = value
  }

   const handleEvent = (e)=>{
      console.log(e.detail);
      message = e.detail
      setTimeout(()=>message = "",4000)
   }
   //$:console.log(expand);

</script>

<div class="p-5">
  {#if message.length !== 0}
	<div class=" fixed w-full right-1 sm:right-5 bottom-5 text-center  sm:w-96 md:w-2/4 lg:w-2/5 h-10 md:h-14 border rounded-sm text-xs md:text-sm font-medium flex items-center justify-center 
    {message.success ? " text-green-600 bg-green-100 border-green-600" : "text-red-600 bg-red-100 border-red-600"}">
        {message.message}
    </div>
	{/if}
  <h1 class=" text-lg md:text-xl font-bold my-2">Profile</h1>
  <div class=" w-full flex flex-col md:flex-row gap-2 lg:gap-4 xl:gap-6">
    <div class=" w-full md:w-2/5 lg:w-1/3 xl:w-1/4">
      <ProfileSideBar {changeTabs} />
    </div>
    <div class=" w-full md:w-3/5 lg:w-2/3 xl:w-3/4">
      {#if activeComp === 1}
        <BookAddress 
            on:onSuccess={handleEvent} 
            {recordId} 
            {organizationAddress} 
            {shippingAddress} 
            {billingAddress} 
        />

      {:else if activeComp === 2}
        <EmailPreference 
            on:onSuccess={handleEvent} 
            {recordId} 
            {emailPreferences} 
        />

      {:else if activeComp === 3}
        <PaymentMethod 
            on:onSuccess={handleEvent}
            {recordId}  
            {changeTabs} 
            {paymentMethods} 
        />

      {:else if activeComp === 4}
        <LinkOrganization 
            on:onSuccess={handleEvent} 
            {recordId} 
            {linkOrganization} 
            {organizationAddress} 
            {shippingAddress} 
            {billingAddress} 
            {paymentAddress}
        />

      {:else if activeComp === 5}
        <SitePreference 
            on:onSuccess={handleEvent} 
            {recordId} 
            {changeTabs}
            {sitePreferences} 
        />

      {:else}
        <PersonalInfo 
            on:onSuccess={handleEvent} 
            {recordId} 
            {contact} 
        />
      {/if}
    </div>
  </div>
</div>
