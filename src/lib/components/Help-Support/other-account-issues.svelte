<script>
   import { enhance } from '$app/forms';
  let accountNumber = "";
  let assistanceMessage = "";
  let firstName = '';
  let lastName = '';
  let email = '';
  let phoneNumber = '';
  let companyName = '';
  let location = '';
  let message="";
  let errormessage = "";
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

<div class="w-full p-4">
  <form method="POST" action="?/contact"  use:enhance={() => {
    return async({ result }) => {
     
      // console.log(result);

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
    
      assistanceMessage = '';
      message= 'Your information has been submitted successfully!';
      // alert('Your information has been submitted successfully!');
    }
    else {
      console.error(`${result.data.error}`, result.data.details);
      errormessage = 'There was an error submitting your information. Please try again.';
      alert('There was an error submitting your information. Please try again.');
    }  
    }; 
}}>
    <div class=" flex flex-col lg:flex-row justify-between  h-full  ">
    <div class="lg:w-1/2 w-full pb-6 mx-auto h-full">
      <div >
        {#if message != ""}
        <h2
          class="text-center bg-green-50 text-green-500 font-semibold text-base w-3/4"
        >
          {message}
        </h2>
        {:else if errormessage!= ""}
        <h2
        class="text-center bg-red-50 text-red-500 font-semibold text-base w-3/4"
      >
        {errormessage}
      </h2>
      {/if}
        <h2 class="text-primary-400 font-semibold text-base pb-6">
          Other Account Issues
        </h2>
        <input hidden name="issueName" value="Other Account Issues"/>
        <label for="account-number" class="block mb-2 text-sm"
          >Account Number</label
        >
        <input
          type="text"
          name="accountNumber"
          id="account-number"
          bind:value={accountNumber}
          required
          class="mt-1 block w-1/2 mb-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="assistance-message" class="block mb-2 text-sm"
          >Please let us know how we may assist you</label
        >
        <textarea
          id="assistance-message"
          name="assistance"
          bind:value={assistanceMessage}
          required
          rows="4"
          class="mt-1 block w-3/4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        ></textarea>
      </div>
    </div>
    <div class="lg:w-1/2 w-full pb-6 mx-auto h-full">
      <h2 class="text-primary-400 font-semibold text-base pb-6">
        Please provide your contact information
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
        name="firstName"
          type="text"
          placeholder="First Name"
          bind:value={firstName}
          class="border rounded-md p-2 text-sm h-9 w-full"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          bind:value={lastName}
          class="border rounded-md p-2 text-sm h-9 w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          bind:value={email}
          class="border rounded-md p-2 text-sm h-9 w-full"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          bind:value={phoneNumber}
          class="border rounded-md p-2 text-sm h-9 w-full"
          required
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company/Institution Name"
          bind:value={companyName}
          class="border rounded-md p-2 text-sm h-9 w-full"
        />
        <select
          bind:value={location}
          name="location"
          class="border rounded-md p-2 text-sm h-9 w-full"
          required
        >
          <option value="" disabled selected>Location</option>
          {#each locations as loc}
            <option value={loc}>{loc}</option>
          {/each}
        </select>
        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          bind:value={accountNumber}
          class="border rounded-md p-2 text-sm h-9 w-full"
          required
        />
      </div>
      <div class="flex justify-center col-span-2 mt-2">
        <button
          type="submit"
          class="w-full bg-primary-400 text-white p-2 rounded hover:bg-primary-500 mt-4"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
  </form>
</div>


