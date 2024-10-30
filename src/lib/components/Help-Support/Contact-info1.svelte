<script>
  import { enhance } from '$app/forms';
  let firstName = '';
  let lastName = '';
  let email = '';
  let phoneNumber = '';
  let companyName = '';
  let location = '';
  let accountNumber = '';
let message = '';
  const locations = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'India'
  ];


</script>

<div class="lg:w-1/2 w-full p-4 mx-auto">
  {#if message!=""}
  <h2 class="text-center text-green-400 font-semibold">{message}</h2>
  {/if}
  <h2 class="text-primary-400 font-semibold text-base pb-6">
    Please provide your contact information
  </h2>
  
  <form method="POST" action="?/contact"  use:enhance={() => {
    return async({ result }) => {
      

      if(result.data.record && result.type === 'success')
    {
      // console.log(`${result.data.message}` );
      // Clear the form 
      firstName = '';
      lastName = '';
      email = '';
      phoneNumber = '';
      companyName = '';
      location = '';
      accountNumber = '';
      message = 'Your information has been submitted successfully!';
      // alert('Your information has been submitted successfully!');
    }
    else {
      // console.error(`${result.data.error}`, result.data.details);
      message='There was an error submitting your information. Please try again.';
      // alert('There was an error submitting your information. Please try again.');
    }  
    }; 
}} class="grid grid-cols-1 md:grid-cols-2 gap-4">

    <input type="text" name="firstName" placeholder="First Name" bind:value={firstName} class="border rounded-md p-2 text-sm h-9 w-full" required />
    <input type="text" name="lastName" placeholder="Last Name" bind:value={lastName} class="border rounded-md p-2 text-sm h-9 w-full" required />
    <input type="email" name="email" placeholder="Email" bind:value={email} class="border rounded-md p-2 text-sm h-9 w-full" required />
    <input type="tel" name="phoneNumber" placeholder="Phone Number" bind:value={phoneNumber} class="border rounded-md p-2 text-sm h-9 w-full" required />
    <input type="text" name="companyName" placeholder="Company/Institution Name" bind:value={companyName} class="border rounded-md p-2 text-sm h-9 w-full" />
    <select bind:value={location} name="location" class="border rounded-md p-2 text-sm h-9 w-full" required>
      <option value="" disabled selected>Location</option>
      {#each locations as loc}
        <option value={loc}>{loc}</option>
      {/each}
    </select>
    <input type="text" name="accountNumber" placeholder="Account Number" bind:value={accountNumber} class="border rounded-md p-2 text-sm h-9 w-full" required />
    
    <div class="flex justify-center col-span-2 mt-2">
      <button type="submit" class="w-3/4 bg-primary-400 text-white p-2 rounded hover:bg-primary-500 mt-4">
        Submit
      </button>
    </div>
  </form>
</div>
