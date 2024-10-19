<script>
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

  const addProduct = () => {
    products = [...products, { itemNumber: "", quantity: "" }];
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

  async function handleSubmit(e){
  e.preventDefault();

  let items = products.map((product) => ({
    itemNumber: sanitize(product.itemNumber),
    quantity: sanitize(product.quantity),
  }));

  const sanitizedData = {
items : items,
exportMaterial : sanitize(exportMaterial),
firstName : sanitize(firstName),
lastName : sanitize(lastName),
email: sanitize(email),
phoneNumber : sanitize(phoneNumber),
companyName : sanitize(companyName),
location : sanitize(location),
accountNumber : sanitize(accountNumber),
streetAddress : sanitize(streetAddress),
city : sanitize(city),
postalCode : sanitize(postalCode),
shippinglocation : sanitize(shippinglocation),
billingStreetAddress : sanitize(billingStreetAddress),
billingCity : sanitize(billingCity),
billingPostalCode : sanitize(billingPostalCode),
billingLocation : sanitize(billingLocation)

  }
  console.log(sanitizedData);

  const finalData = {
    items:sanitizedData.items,
    exportMaterial : sanitizedData.exportMaterial,
    firstName : sanitizedData.firstName,
    lastName : sanitizedData.lastName,
    email: sanitizedData.email,
    phoneNumber : sanitizedData.phoneNumber,
    companyName : sanitizedData.companyName,
    location : sanitizedData.location,
    accountNumber : sanitizedData.accountNumber,
    streetAddress : sanitizedData.streetAddress,
    city :  sanitizedData.city,
    postalCode : sanitizedData.postalCode,
    shippinglocation : sanitizedData.shippinglocation,
    billingStreetAddress : sanitizedData.billingStreetAddress,
    billingCity : sanitizedData.billingCity,
    billingPostalCode : sanitizedData.billingPostalCode,
    billingLocation : sanitizedData.billingLocation
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
      items = '';
      exportMaterial = '';
      firstName = '';
      lastName = '';
      email = '';
      phoneNumber = '';
      companyName = '';
      location = '';
      accountNumber = '';
      streetAddress = '';
      city= '';
      postalCode = '';
      shippinglocation = '';
      billingStreetAddress = '';
      billingCity = '';
      billingPostalCode = '';
      billingLocation = '';
      alert('Your information has been submitted successfully!');
    } else {
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
  <form on:submit={handleSubmit}>
    <div class=" flex flex-col h-full">
      <div class="lg:w-3/4 w-full pb-6 h-full">
        <h2 class="text-primary-400 font-semibold text-base pb-6">Quotes</h2>
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

        <fieldset
          class="flex flex-col md:flex-row lg:flex-row justify-between p-2"
        >
          <legend class="block mb-2 text-sm"
            >Do you intend to export this material?</legend
          >
          <div class="w-1/2">
            <label class="inline-flex items-center mr-4">
              <input
                type="radio"
                bind:group={exportMaterial}
                value="Yes"
                class="form-radio"
              />
              <span class="ml-2 text-sm">Yes</span>
            </label>
            <label class="inline-flex items-center">
              <input
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
        <h2 class="text-primary-400 font-semibold text-base pb-6">
          Shipping Address
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
          <input
            type="text"
            placeholder="Street Address*"
            bind:value={streetAddress}
            class="border rounded-md p-2 text-sm h-9 w-full"
            required
          />
          <input
            type="text"
            placeholder="City*"
            bind:value={city}
            class="border rounded-md p-2 text-sm h-9 w-full"
            required
          />

          <select
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
          <label for="same-as-shipping" class="block mb-2 text-sm"
            >Same as shipping address?</label
          >
          <div class="w-1/2">
            <input
              type="radio"
              id="yes"
              name="same-as-shipping"
              value="yes"
              on:change={handleRadioChange}
            />
            <label for="yes" class="mr-4 text-sm">Yes</label>
            <input
              type="radio"
              id="no"
              name="same-as-shipping"
              value="no"
              on:change={handleRadioChange}
              checked
            />
            <label for="no" class="text-sm">No</label>
          </div>
        </fieldset>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            placeholder="Street Address*"
            bind:value={billingStreetAddress}
            class="border rounded-md p-2 text-sm h-9 w-full"
            required
          />
          <input
            type="text"
            placeholder="City*"
            bind:value={billingCity}
            class="border rounded-md p-2 text-sm h-9 w-full"
            required
          />

          <select
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
