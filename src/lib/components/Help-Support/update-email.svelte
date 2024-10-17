<script>
  let firstName = "";
  let lastName = "";
  let assistance = '';
  let email = "";
  let phoneNumber = "";
  let companyName = "";
  let location = "";
  let accountNumber = "";
  let currentEmail = "";
  let newEmail="";
  const locations = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "India",
  ];
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

const handleSubmit = (event) => {
  event.preventDefault();
  alert('Form submitted successfully!');

  console.log(sanitize(currentEmail));
  console.log(sanitize(newEmail));
  console.log(sanitize(firstName));
  console.log(sanitize(lastName));
  console.log(sanitize(email));
  console.log(sanitize(phoneNumber));
  console.log(sanitize(companyName));
  console.log(sanitize(location));
  console.log(sanitize(accountNumber));
  console.log('Assistance Needed:', sanitize(assistance));
};


</script>
<div class="w-full p-4">
  <form on:submit={handleSubmit} >
    <div class=" w-full pb-6 h-full">
      <h2 class="text-primary-400 font-semibold text-base pb-6">UPDATE EMAIL ADDRESS</h2>
      
      <label class="text-base">*Current Email address (From online account)</label>
      <input
      type="email"
      
      bind:value={currentEmail}
      class="border rounded-md p-2 text-sm h-9 w-full  mb-4 mt-2"
      required
    />
    <label class="text-base">*New Email address</label>
      <input
      type="email"
      
      bind:value={newEmail}
      class="border rounded-md p-2 text-sm h-9 w-full mt-2"
      required
    />
      <div class="mt-4">
        <label class="block text-base">*Please share any comments that would help us complete your request</label>
        <textarea rows="5" bind:value={assistance} class="w-full border p-2 text-sm mt-2" required></textarea>
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

