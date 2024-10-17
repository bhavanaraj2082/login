<script>
  let accountNumber = "";
  let assistanceMessage = "";
  let firstName = '';
  let lastName = '';
  let email = '';
  let phoneNumber = '';
  let companyName = '';
  let location = '';
  
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

  console.log("Account Number:", sanitize(accountNumber));
  console.log("Assistance Message:", sanitize(assistanceMessage));
  console.log(sanitize(firstName));
  console.log(sanitize(lastName));
  console.log(sanitize(email));
  console.log(sanitize(phoneNumber));
  console.log(sanitize(companyName));
  console.log(sanitize(location));
};


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
  <form on:submit={handleSubmit}>
    <div class=" flex flex-col lg:flex-row justify-between  h-full  ">
    <div class="lg:w-1/2 w-full pb-6 mx-auto h-full">
      <div >
        <h2 class="text-primary-400 font-semibold text-base pb-6">
          Other Account Issues
        </h2>
        <label for="account-number" class="block mb-2 text-sm"
          >Account Number</label
        >
        <input
          type="text"
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


