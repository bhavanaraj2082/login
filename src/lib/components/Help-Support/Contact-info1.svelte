<script>
  let firstName = '';
  let lastName = '';
  let email = '';
  let phoneNumber = '';
  let companyName = '';
  let location = '';
  let accountNumber = '';

  const locations = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'India'
  ];

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

  async function handleSubmit() {
    const sanitizedData = {
      firstName: sanitize(firstName),
      lastName: sanitize(lastName),
      email: sanitize(email),
      phoneNumber: sanitize(phoneNumber),
      companyName: sanitize(companyName),
      location: sanitize(location),
      accountNumber: sanitize(accountNumber)
    };

    console.log(sanitizedData);
    const response = await fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sanitizedData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Contact information saved:', data.record);
      // Clear the form 
      firstName = '';
      lastName = '';
      email = '';
      phoneNumber = '';
      companyName = '';
      location = '';
      accountNumber = '';
      alert('Your information has been submitted successfully!');
    } else {
      const errorData = await response.json();
      console.error('Failed to save contact information:', errorData.error);
      alert('There was an error submitting your information. Please try again.');
    }
  }
</script>

<div class="lg:w-1/2 w-full p-4 mx-auto">
  <h2 class="text-primary-400 font-semibold text-base pb-6">
    Please provide your contact information
  </h2>
  
  <form on:submit|preventDefault={handleSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input type="text" placeholder="First Name" bind:value={firstName} class="border rounded-md p-2 text-sm h-9 w-full" required />
    <input type="text" placeholder="Last Name" bind:value={lastName} class="border rounded-md p-2 text-sm h-9 w-full" required />
    <input type="email" placeholder="Email" bind:value={email} class="border rounded-md p-2 text-sm h-9 w-full" required />
    <input type="tel" placeholder="Phone Number" bind:value={phoneNumber} class="border rounded-md p-2 text-sm h-9 w-full" required />
    <input type="text" placeholder="Company/Institution Name" bind:value={companyName} class="border rounded-md p-2 text-sm h-9 w-full" />
    <select bind:value={location} class="border rounded-md p-2 text-sm h-9 w-full" required>
      <option value="" disabled selected>Location</option>
      {#each locations as loc}
        <option value={loc}>{loc}</option>
      {/each}
    </select>
    <input type="text" placeholder="Account Number" bind:value={accountNumber} class="border rounded-md p-2 text-sm h-9 w-full" required />
    
    <div class="flex justify-center col-span-2 mt-2">
      <button type="submit" class="w-3/4 bg-primary-400 text-white p-2 rounded hover:bg-primary-500 mt-4">
        Submit
      </button>
    </div>
  </form>
</div>
