<script>
  import { enhance } from "$app/forms";
  let selectedOption = "";
  let invoiceNumber = "";
  let itemNumber = "";
  let selectOptionNumber = "";
  let firstName = "";
  let lastName = "";
  let email = "";
  let phoneNumber = "";
  let companyName = "";
  let location = "";
  let accountNumber = "";
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

<div class="  w-full p-4">
  <form
    method="POST"
    action="?/contact"
    use:enhance={() => {
      return async ({ result }) => {
       
        // console.log(result);

        if (result) {
          // console.log(`${result.data.message}`);
          // Clear the form
          selectedOption = "";
          selectOptionNumber = "";
          invoiceNumber = "";
          itemNumber = "";
          firstName = "";
          lastName = "";
          email = "";
          phoneNumber = "";
          companyName = "";
          location = "";
          accountNumber = "";
          message= 'Your information has been submitted successfully!';
          // alert("Your information has been submitted successfully!");
        } else {
          console.error(`${result.data.error}`, result.data.details);
          errormessage = 'There was an error submitting your information. Please try again.';
          // alert(
          //   "There was an error submitting your information. Please try again."
          // );
        }
      };
    }}
  >
    <div class=" flex flex-col lg:flex-row justify-between h-full">
      <div class="lg:w-1/2 w-full pb-6 mx-auto h-full">
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
          Order Status
        </h2>
        <input hidden name="issueName" value="Order Status"/>
        <div class="mb-4">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="block  mb-2 text-sm"
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
                class="form-radio w-3.5 h-3.5 text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
                />
              <label for="poNumber" class="ml-2 text-sm">PO Number</label>
            </div>
            <div class="flex items-center mb-2 text-sm">
              <input
                type="radio"
                id="orderNumber"
                name="reference"
                value="Order Number"
                class="form-radio w-3.5 h-3.5 text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500"
                bind:group={selectedOption}
                required
              />
              <label for="orderNumber" class="ml-2">Order Number</label>
            </div>
          </div>
          <input
            name="selectOptionNumber"
            type="text"
            class="border border-gray-30 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 w-full lg:w-3/4 md:w-3/4 text-sm rounded-md"
            bind:value={selectOptionNumber}
            required
          />
        </div>

        <div class="mb-4 p-2">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="block  mb-2 text-sm"
            >If possible please provide the following</label
          >
          <input
            name="invoiceNumber"
            type="text"
            placeholder="Invoice Number"
            bind:value={invoiceNumber}
            class="border border-gray-30 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
          />
          <input
            name="itemNumber"
            type="text"
            placeholder="Item Number"
            bind:value={itemNumber}
            class="border border-gray-30 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 w-full lg:w-3/4 md:w-3/4 text-sm rounded-md"
          />
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
            class="border border-gray-30 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 rounded-md p-2 text-sm h-9 w-full"
            required
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            bind:value={lastName}
            class="border border-gray-30 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 rounded-md p-2 text-sm h-9 w-full"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            bind:value={email}
            class="border border-gray-30 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 rounded-md p-2 text-sm h-9 w-full"
            required
          />
          <input
            name="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            bind:value={phoneNumber}
            class="border border-gray-30 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 rounded-md p-2 text-sm h-9 w-full"
            required
          />
          <input
            name="companyName"
            type="text"
            placeholder="Company/Institution Name"
            bind:value={companyName}
            class="border border-gray-30 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 rounded-md p-2 text-sm h-9 w-full"
          />
          <select
            name="location"
            bind:value={location}
            class="border border-gray-30 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 rounded-md p-2 text-sm h-9 w-full"
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
            class="border border-gray-30 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 rounded-md p-2 text-sm h-9 w-full"
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
