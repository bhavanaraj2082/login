<script>
  import { enhance } from "$app/forms";
  let products = [{ itemNumber: "", quantity: "" }];

  let firstName = "";
  let lastName = "";
  let email = "";
  let phoneNumber = "";
  let companyName = "";
  let location = "";
  let accountNumber = "";
  let message="";
  let errormessage = "";
  const addProduct = () => {
    products = [...products, { itemNumber: "", quantity: "" }];
  };

  const removeProduct = (index) => {
    products = products.filter((_, i) => i !== index);
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
          products = [{ itemNumber: "", quantity: "" }];

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
          alert(
            "There was an error submitting your information. Please try again."
          );
        }
      };
    }}
  >
    <div class=" flex flex-col h-full">
      <div class="lg:w-3/4 w-full pb-6 h-full">
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
          Pricing and Availability
        </h2>
        <input hidden name="issueName" value="Pricing and Availability"/>
        <h3 class="block mb-2 text-sm">
          Please provide the following product information
        </h3>

        {#each products as product, index}
          <div class="mb-4 flex flex-col items-start">
            <div class="flex-1 w-3/4">
              <!-- <label class=" mb-1 hidden" for={`item-number-${index}`}>Item Number</label> -->
              <input
                id={`item-number-${index}`}
                type="text"
                placeholder="*Item Number"
                bind:value={product.itemNumber}
                class="border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
                required
              />
              <!-- <label class="hidden mb-1" for={`quantity-${index}`}>Quantity</label> -->
              <input
                id={`quantity-${index}`}
                type="number"
                placeholder="*Quantity"
                bind:value={product.quantity}
                class="border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
                required
              />
            </div>
            {#if index > 0}
              <button
                type="button"
                on:click={() => removeProduct(index)}
                class="ml-2 text-red-500"
              >
                &times;
              </button>
            {/if}
          </div>
        {/each}

        <button
          type="button"
          on:click={addProduct}
          class=" text-primary-400 border border-primary-400 mb-4 px-2 rounded-md hover:text-white hover:bg-primary-400"
        >
          Add another product
        </button>
        <input hidden name="products" value={JSON.stringify(products)} />
      </div>
      <div class=" w-full pb-6 mx-auto h-full">
        <h2 class="text-primary-400 font-semibold text-base pb-6">
          Please provide your contact information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            bind:value={firstName}
            class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            bind:value={lastName}
            class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            bind:value={email}
            class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            bind:value={phoneNumber}
            class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
            required
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company/Institution Name"
            bind:value={companyName}
            class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
          />
          <select
            name="location"
            bind:value={location}
            class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
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
            class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 p-2 text-sm h-9 w-full"
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
    </div>
  </form>
</div>
