<script>
  let selectedOption = "";
  let confirmationNumber = "";
  let itemNumber = "";
  let selectOptionNumber = "";
  
  let firstName = '';
  let lastName = '';
  let email = '';
  let phoneNumber = '';
  let companyName = '';
  let location = '';
  let accountNumber = '';

  function sanitize(input) {
    if (typeof input !== "string") {
      
      return input; // or handle it appropriately
    } else {
      // Remove all <script> tags specifically
      input = input.replace(/<script[^>]*>.*?<\/script>/gi, "");

      // Remove all other HTML tags
      return input.replace(/<\/?[^>]+(>|$)/g, "");
    }
}

function handleSubmit() {
  const sanitizedData = {
    selectedOption: sanitize(selectedOption),
    selectOptionNumber: sanitize(selectOptionNumber),
    confirmationNumber: sanitize(confirmationNumber),
    itemNumber: sanitize(itemNumber),
    firstName: sanitize(firstName),
    lastName: sanitize(lastName),
    email: sanitize(email),
    phoneNumber: sanitize(phoneNumber),
    companyName: sanitize(companyName),
    location: sanitize(location),
    accountNumber: sanitize(accountNumber)
  };

  console.log(sanitizedData);
}



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

<div class="  w-full p-4">
 

  <form on:submit|preventDefault={handleSubmit}>
   
    <div class=" flex flex-col lg:flex-row justify-between  h-full  ">
      
    <div class="lg:w-1/2 w-full pb-6 mx-auto h-full">
      <h2 class="text-primary-400 font-semibold text-base pb-6">Invoice</h2>
      <div class="mb-4">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block font-semibold mb-2 text-sm"
          >Please provide one of the following</label
        >
        <div
          class="flex flex-col md:flex-row lg:flex-row justify-between w-3/4 p-2"
        >
          <div class="flex items-center mb-2 text-sm">
            <input
              type="radio"
              id="poNumber"
              name="reference"
              value="PO Number"
              bind:group={selectedOption}
              required
              class="text-sm"
            />
            <label for="poNumber" class="ml-2 text-sm">PO Number</label>
          </div>
          <div class="flex items-center mb-2 text-sm">
            <input
              type="radio"
              id="orderNumber"
              name="reference"
              value="Order Number"
              bind:group={selectedOption}
              required
            />
            <label for="orderNumber" class="ml-2">Order Number</label>
          </div>
          <div class="flex items-center mb-2 text-sm">
            <input
              type="radio"
              id="invoiceNumber"
              name="reference"
              value="Invoice Number"
              bind:group={selectedOption}
              required
            />
            <label for="invoiceNumber" class="ml-2">Invoice Number</label>
          </div>
        </div>
        <input
          type="text"
          class="border p-2 w-full lg:w-3/4 md:w-3/4 text-sm rounded-md"
          bind:value={selectOptionNumber}
          required
        />
      </div>

      <div class="mb-4 p-2">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block font-semibold mb-2 text-sm"
          >If possible please provide the following</label
        >
        <input
          type="text"
          placeholder="Confirmation Number"
          bind:value={confirmationNumber}
          class="border p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
        />
        <input
          type="text"
          placeholder="Item Number"
          bind:value={itemNumber}
          class="border p-2 w-full lg:w-3/4 md:w-3/4 text-sm rounded-md"
        />
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


