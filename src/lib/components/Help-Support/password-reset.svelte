<script>
    import { enhance } from '$app/forms';
  let firstName = "";
  let lastName = "";
  let assistance = '';
  let email = "";
  let phoneNumber = "";
  let companyName = "";
  let location = "";
  let accountNumber = "";
  let resetemail = "";
  let message="";
  let errormessage = "";
  const locations = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "India",
  ];

</script>
<div class="w-full p-4">
  <form method="POST" action="?/contact"  use:enhance={() => {
    return async({ result }) => {
   
      // console.log(result);

      if(result)
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
      resetemail = '';
      assistance = '';
      message= 'Your information has been submitted successfully!';
      // alert('Your information has been submitted successfully!');
    }
    else {
      console.error(`${result.data.error}`, result.data.details);
      errormessage = 'There was an error submitting your information. Please try again.';
      alert('There was an error submitting your information. Please try again.');
    }  
    setTimeout(() => {
          errormessage = ""
          message = ""
        }, 2000);
    }; 
}} >
    <div class=" w-full pb-6 h-full">
      <h2 class="text-primary-400 font-semibold text-base pb-6">Password Reset</h2>
      <input hidden name="issueName" value="Password Reset"/>
      <label class="text-base">*Email address/User ID (From online account)</label>
      <input
      type="email"
      name="resetemail"
      bind:value={resetemail}
      class="border rounded-md p-2 text-sm h-9 w-full mt-2"
      required
    />
      <div class="mt-4">
        <label class="block text-base">*Please share any comments that would help us complete your request</label>
        <textarea rows="5" name="assistance" bind:value={assistance} class="w-full border p-2 text-sm mt-2" required></textarea>
      </div>
      </div>
      <div class=" w-full pb-6 mx-auto h-full">
        <h2 class="text-primary-400 font-semibold text-base pb-6">
          Please provide your contact information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
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
          name="location"
            bind:value={location}
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
  
        
          <button
            type="submit"
            class="w-full bg-primary-400 text-white p-2 rounded hover:bg-primary-500 mt-4"
          >
            Submit
          </button>
     
      </div>
  </form>
  {#if message != ""}
      <h2
        class="text-center bg-green-50 text-green-500 font-semibold text-base w-full"
      >
        {message}
      </h2>
      {:else if errormessage!= ""}
      <h2
      class="text-center bg-red-50 text-red-500 font-semibold text-base w-full"
    >
      {errormessage}
    </h2>
    {/if}
</div>
