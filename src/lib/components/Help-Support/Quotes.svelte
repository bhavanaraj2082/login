<script>
  import { enhance } from "$app/forms";
  let products = [{ itemNumber: "", quantity: "" }];
  let exportMaterial = "";
  let firstName = "";
  let lastName = "";
  let email = "";
  let phoneNumber = "";
  let companyName = "";
  let location = "";
  let accountNumber = "";
  let streetAddress = "";
  let city = "";
  let postalCode = "";
  let shippinglocation = "";
  let billingStreetAddress = "";
  let billingCity = "";
  let billingPostalCode = "";
  let billingLocation = "";
  let useShippingAddress = false;
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
  const shippinglocations = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "India",
  ];
  const billinglocations = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "India",
  ];
  const handleRadioChange = (event) => {
    useShippingAddress = event.target.value === "yes";
    if (useShippingAddress) {
      billingStreetAddress = streetAddress;
      billingCity = city;
      billingPostalCode = postalCode;
      billingLocation = shippinglocation;
    } else {
      billingStreetAddress = "";
      billingCity = "";
      billingPostalCode = "";
      billingLocation = "";
    }
  };
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
         
          exportMaterial = "";
          firstName = "";
          lastName = "";
          email = "";
          phoneNumber = "";
          companyName = "";
          location = "";
          accountNumber = "";
          streetAddress = "";
          city = "";
          postalCode = "";
          shippinglocation = "";
          billingStreetAddress = "";
          billingCity = "";
          billingPostalCode = "";
          billingLocation = "";
          message= 'Your information has been submitted successfully!';
          // alert("Your information has been submitted successfully!");
        } else {
          // console.error(`${result.data.error}`, result.data.details);
          errormessage = 'There was an error submitting your information. Please try again.';
          alert(
            "There was an error submitting your information. Please try again."
          );
        }
      };
    }}
  >
    <div class=" flex flex-col h-full">
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
      <div class="lg:w-3/4 w-full pb-6 h-full">
       
        <h2 class="text-primary-400 font-semibold text-base pb-6">Quotes</h2>
        <input hidden name="issueName" value="Quotes"/>
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
                placeholder="Item Number"
                bind:value={product.itemNumber}
                class="border p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
                required
              />
              <!-- <label class="hidden mb-1" for={`quantity-${index}`}>Quantity</label> -->
              <input
                id={`quantity-${index}`}
                type="number"
                placeholder="Quantity"
                bind:value={product.quantity}
                class="border p-2 w-full lg:w-3/4 md:w-3/4 mb-2 text-sm rounded-md"
                required
              />
            </div>
            {#if index > 0}
              <button
                type="button"
                on:click={() => removeProduct(index)}
                class="ml-2 text-primary-400"
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
        <fieldset
          class="flex flex-col md:flex-row lg:flex-row justify-between p-2"
        >
          <legend class="block mb-2 text-sm"
            >Do you intend to export this material?</legend
          >
          <div class="w-1/2">
            <label class="inline-flex items-center mr-4">
              <input
              name="exportMaterial"
                type="radio"
                bind:group={exportMaterial}
                value="Yes"
                class="form-radio"
              />
              <span class="ml-2 text-sm">Yes</span>
            </label>
            <label class="inline-flex items-center">
              <input
              name="exportMaterial"
                type="radio"
                bind:group={exportMaterial}
                value="No"
                class="form-radio"
              />
              <span class="ml-2 text-sm">No</span>
            </label>
          </div>
        </fieldset>
      </div>
      <div class=" w-full pb-6 mx-auto h-full">
        <h2 class="text-primary-400 font-semibold text-base pb-6">
          Please provide your contact information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
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
        <h2 class="text-primary-400 font-semibold text-base pb-6">
          Shipping Address
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
          <input
          name="streetAddress"
            type="text"
            placeholder="Street Address*"
            bind:value={streetAddress}
            class="border rounded-md p-2 text-sm h-9 w-full"
            required
          />
          <input
          name="city"
            type="text"
            placeholder="City*"
            bind:value={city}
            class="border rounded-md p-2 text-sm h-9 w-full"
            required
          />

          <select
          name="shippinglocation"
            bind:value={shippinglocation}
            class="border rounded-md p-2 text-sm h-9 w-full"
            required
          >
            <option value="" disabled selected>Location</option>
            {#each shippinglocations as shiploc}
              <option value={shiploc}>{shiploc}</option>
            {/each}
          </select>
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code*"
            bind:value={postalCode}
            class="border rounded-md p-2 text-sm h-9 w-full"
            required
          />
        </div>
        <h2 class="text-primary-400 font-semibold text-base pb-6">
          Billing Address
        </h2>

        <fieldset class="flex flex-col justify-between p-2">
          <label for="sameasShipping" class="block mb-2 text-sm"
            >Same as shipping address?</label
          >
          <div class="w-1/2">
            <input
           
              type="radio"
              id="yes"
              name="sameasShipping"
              value="yes"
              on:change={handleRadioChange}
            />
            <label for="yes" class="mr-4 text-sm">Yes</label>
            <input
              type="radio"
              id="no"
              name="sameasShipping"
              value="no"
              on:change={handleRadioChange}
              checked
            />
            <label for="no" class="text-sm">No</label>
          </div>
        </fieldset>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
          name="billingStreetAddress"
            type="text"
            placeholder="Street Address*"
            bind:value={billingStreetAddress}
            class="border rounded-md p-2 text-sm h-9 w-full"
            required
          />
          <input
          name="billingCity"
            type="text"
            placeholder="City*"
            bind:value={billingCity}
            class="border rounded-md p-2 text-sm h-9 w-full"
            required
          />

          <select
          name="billingLocation"
            bind:value={billingLocation}
            class="border rounded-md p-2 text-sm h-9 w-full"
            required
          >
            <option value="" disabled selected>Location</option>
            {#each billinglocations as billloc}
              <option value={billloc}>{billloc}</option>
            {/each}
          </select>

          <input
            type="text"
            name="billingPostalCode"
            placeholder="Postal Code*"
            bind:value={billingPostalCode}
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
