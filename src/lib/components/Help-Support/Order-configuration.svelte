<script>
  let products = [{ itemNumber: "" }];
  let poNumber = "";
  let firstName = "";
  let lastName = "";
  let email = "";
  let phoneNumber = "";
  let companyName = "";
  let location = "";
  let accountNumber = "";

  const addProduct = () => {
    products = [...products, { itemNumber: "" }];
  };

  const removeProduct = (index) => {
    products = products.filter((_, i) => i !== index);
  };

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

const handleSubmit = (e) => {
  e.preventDefault();

  const items = products.map((product) => ({
    itemNumber: sanitize(product.itemNumber),
  }));

  console.log(items);
  console.log(sanitize(firstName));
  console.log(sanitize(lastName));
  console.log(sanitize(email));
  console.log(sanitize(phoneNumber));
  console.log(sanitize(companyName));
  console.log(sanitize(location));
  console.log(sanitize(accountNumber));
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
  <form on:submit={handleSubmit}>
    <div class=" flex flex-col h-full">
      <div class="lg:w-3/4 w-full pb-6 h-full">
        <h2 class="text-primary-400 font-semibold text-base pb-6">
          ORDER CONFIGURATION
        </h2>
        <h3 class="block mb-2 text-sm">
          Please provide the following product information
        </h3>

        <div class="flex-1 w-3/4 mb-4 flex flex-col items-start">
          <!-- <label class=" mb-1 hidden" for={`item-number-${index}`}>Item Number</label> -->
          <input
            id={`item-number-${1}`}
            type="text"
            placeholder="PO Number"
            bind:value={poNumber}
            class="border p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
            required
          />
          <!-- <label class="hidden mb-1" for={`poNumber-${index}`}>poNumber</label> -->
          {#each products as product, index}
            <input
              id={`poNumber-${index}`}
              type="text"
              placeholder="Item Number"
              bind:value={product.itemNumber}
              class="border p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
              required
            />

            {#if index > 0}
              <button
                type="button"
                on:click={() => removeProduct(index)}
                class="ml-2 text-primary-400"
              >
                &times;
              </button>
            {/if}
          {/each}
        </div>

        <button
          type="button"
          on:click={addProduct}
          class=" text-primary-400 border border-primary-400 mb-4 px-2 rounded-md hover:text-white hover:bg-primary-400"
        >
          Add another product
        </button>
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
    </div>
  </form>
</div>

