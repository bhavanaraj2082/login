<script>
  import { enhance } from "$app/forms";
  let firstName = "";
  let lastName = "";
  let email = "";
  let phoneNumber = "";
  let companyName = "";
  let location = "";
  let accountNumber = "";
  let addressType = "";
  let primaryAddress = "";
  let updateAddress = "";
  let message = "";
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
  <form
    method="POST"
    action="?/contact"
    use:enhance={() => {
      return async ({ result }) => {
        console.log(result);

        if (result) {
          // console.log(`${result.data.message}` );
          // Clear the form
          firstName = "";
          lastName = "";
          email = "";
          phoneNumber = "";
          companyName = "";
          location = "";
          accountNumber = "";
          addressType = "";
          primaryAddress = "";
          updateAddress = "";
          message = "Your information has been submitted successfully!";
          // alert('Your information has been submitted successfully!');
        } else {
          console.error(`${result.data.error}`, result.data.details);
          errormessage =
            "There was an error submitting your information. Please try again.";
          alert(
            "There was an error submitting your information. Please try again."
          );
        }
        setTimeout(() => {
          errormessage = "";
          message = "";
        }, 2000);
      };
    }}
  >
    <div class=" w-full pb-6 h-full">
      <h2 class="text-primary-400 font-semibold text-base pb-4">
        Update Billing
      </h2>
      <input hidden name="issueName" value="Update Billing" />
      <div>
        <label class="block text-base">Is the new address:</label>
        <div class="flex flex-col text-sm my-4">
          <label class="mb-3">
            <input
              type="radio"
              name="issue"
              bind:group={addressType}
              value="New single address"
            />
            A new single address that replaces the original
          </label>
          <label>
            <input
              type="radio"
              name="issue"
              bind:group={addressType}
              value="Additional location"
            />
            An additional location/address; original address should be maintained
          </label>
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-base"
          >Would you like the new address to become your primary address in your
          online profile?</label
        >
        <div class="text-sm my-4 w-1/6 flex justify-between">
          <label>
            <input
              type="radio"
              name="primaryAddress"
              bind:group={primaryAddress}
              value="Yes"
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="primaryAddress"
              bind:group={primaryAddress}
              value="No"
            />
            No
          </label>
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-base"
          >Please indicate the address(es) you would like to update:</label
        >
        <div class="flex flex-col text-sm my-4">
          <label class="mb-3">
            <input
              type="radio"
              name="updateAddress"
              bind:group={updateAddress}
              value="Shipping address only"
            />
            Shipping address only
          </label>
          <label class="mb-3">
            <input
              type="radio"
              name="updateAddress"
              bind:group={updateAddress}
              value="Billing address only"
            />
            Billing address only
          </label>
          <label>
            <input
              type="radio"
              name="updateAddress"
              bind:group={updateAddress}
              value="Shipping and billing address"
            />
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
          name="firstName"
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
          bind:value={location}
          name="location"
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
    <h2 class="text-center text-green-500 font-semibold text-base w-full">
      {message}
    </h2>
  {:else if errormessage != ""}
    <h2 class="text-center text-red-500 font-semibold text-base w-full">
      {errormessage}
    </h2>
  {/if}
</div>
