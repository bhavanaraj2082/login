<script>
  
  let firstName = "";
  let lastName = "";
  let email = "";
  let phoneNumber = "";
  let companyName = "";
  let location = "";
  let accountNumber = "";
  let addressType = '';
  let primaryAddress = '';
  let updateAddress = '';

  const sanitize = (input) => {
    if (typeof input !== "string") {
      
      return input; // or handle it appropriately
    } else {
      // Remove all <script> tags specifically
      input = input.replace(/<script[^>]*>.*?<\/script>/gi, "");

      // Remove all other HTML tags
      return input.replace(/<\/?[^>]+(>|$)/g, "");
    }
};

async function handleSubmit (event) {
  event.preventDefault();
  const sanitizedData ={
    firstName : sanitize(firstName),
    lastName : sanitize(lastName),
    email: sanitize(email),
    phoneNumber : sanitize(phoneNumber),
    companyName : sanitize(companyName),
    location : sanitize(location),
    accountNumber : sanitize(accountNumber),
    addressType :  sanitize(addressType),
    primaryAddress: sanitize(primaryAddress),
    updateAddress: sanitize(updateAddress)
  }
  
 console.log(sanitizedData);
 const finalData = {
  firstName : sanitizedData.firstName,
    lastName : sanitizedData.lastName,
    email: sanitizedData.email,
    phoneNumber : sanitizedData.phoneNumber,
    companyName : sanitizedData.companyName,
    location : sanitizedData.location,
    accountNumber : sanitizedData.accountNumber,
    issue :  sanitizedData.addressType,
    primaryAddress : sanitizedData.primaryAddress,
    updateAddress :  sanitizedData.updateAddress
 }
 const response = await fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalData)
    });
    if (response.ok) {
      const data = await response.json();
      console.log(' information saved:', data.record);
        // Clear the form 
      firstName = '';
      lastName = '';
      email = '';
      phoneNumber = '';
      companyName = '';
      location = '';
      accountNumber = '';
      addressType = '';
      primaryAddress = '';
      updateAddress = '';
  alert("Form submitted successfully!");
    }
    else {
      const errorData = await response.json();
      console.error('Failed to save contact information:', errorData.error);
      alert('There was an error submitting your information. Please try again.');
    }
};

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
  <form on:submit={handleSubmit}>
    <div class=" w-full pb-6 h-full">
      <h2 class="text-primary-400 font-semibold text-base pb-4">Shipping Info</h2>
      <div>

        <label class="block text-base ">Is the new address:</label>
        <div class="flex flex-col text-sm my-4">
        <label class="mb-3">
          <input type="radio" bind:group={addressType} value="New single address" />
          A new single address that replaces the original
        </label>
        <label>
          <input type="radio" bind:group={addressType} value="Additional location"/>
          An additional location/address; original address should be maintained
        </label>
      </div>
      </div>
    
      <div class="mt-4">
        <label class="block text-base">Would you like the new address to become your primary address in your online profile?</label>
        <div class="text-sm my-4 w-1/6 flex justify-between">
        <label>
          <input type="radio" bind:group={primaryAddress} value="Yes" />
          Yes
        </label>
        <label>
          <input type="radio" bind:group={primaryAddress} value="No" />
          No
        </label>
      </div>
      </div>
    
      <div class="mt-4">
        <label class="block text-base">Please indicate the address(es) you would like to update:</label>
        <div class="flex flex-col text-sm my-4">
        <label class="mb-3">
          <input type="radio" bind:group={updateAddress} value="Shipping address only" />
          Shipping address only
        </label>
        <label class="mb-3">
          <input type="radio" bind:group={updateAddress} value="Billing address only" />
          Billing address only
        </label>
        <label>
          <input type="radio" bind:group={updateAddress} value="Shipping and billing address" />
          Shipping and billing address
        </label>
      </div>
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
          bind:value={firstName}
          class="border rounded-md p-2 text-sm h-9 w-full"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          bind:value={lastName}
          class="border rounded-md p-2 text-sm h-9 w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          bind:value={email}
          class="border rounded-md p-2 text-sm h-9 w-full"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          bind:value={phoneNumber}
          class="border rounded-md p-2 text-sm h-9 w-full"
          required
        />
        <input
          type="text"
          placeholder="Company/Institution Name"
          bind:value={companyName}
          class="border rounded-md p-2 text-sm h-9 w-full"
        />
        <select
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
</div>

