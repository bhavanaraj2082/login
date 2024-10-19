<script>
  import Icon from "@iconify/svelte";
let firstName = "";
let lastName = "";
let email = "";
let phoneNumber = "";
let companyName = "";
let location = "";
let accountNumber = "";

let documentRequired = "";
let attachments = [];
let totalSize = 0;

const maxFileSize = 25 * 1024 * 1024;

const handleFileChange = (event) => {
const files = Array.from(event.target.files);
let filesAdded = false;

for (const file of files) {
  if (totalSize + file.size > maxFileSize) {
    alert('Total file size exceeds 25 MB limit. Please select smaller files.');
    return;
  }
  totalSize += file.size;
  attachments.push(file);
  filesAdded = true;
  attachments = attachmentFunction(attachments);
}

if (filesAdded) {
  alert(`${files.length} file(s) added successfully!`);
}

event.target.value = '';
};

const removeAttachment = (index) => {
if (attachments[index]) {
  totalSize -= attachments[index].size;
  attachments.splice(index, 1);
  alert('File removed successfully!');
  attachments = attachmentFunction(attachments);
}
};

function attachmentFunction(attachments) {
return attachments;
}

const sanitize = (input) => {
if (typeof input !== 'string') {
    
    return input; // or handle it appropriately
  } else {
    // Remove all <script> tags specifically
    input = input.replace(/<script[^>]*>.*?<\/script>/gi, "");

    // Remove all other HTML tags
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  }
};

async function handleSubmit(event) {
  event.preventDefault();
  // let attachments = attachments.map(a => sanitize(a.name));

  const sanitizedData = {
    documentRequired: sanitize(documentRequired),
    // attachments: attachments,
    firstName: sanitize(firstName),
    lastName: sanitize(lastName),
    email: sanitize(email),
    phoneNumber: sanitize(phoneNumber),
    companyName: sanitize(companyName),
    location: sanitize(location),
    accountNumber: sanitize(accountNumber),
  };
  console.log(sanitizedData);

  const finalData = {
    documentRequired: sanitizedData.documentRequired,
    firstName: sanitizedData.firstName,
    lastName: sanitizedData.lastName,
    email: sanitizedData.email,
    phoneNumber: sanitizedData.phoneNumber,
    companyName: sanitizedData.companyName,
    location: sanitizedData.location,
    accountNumber: sanitizedData.accountNumber,
  };
  const response = await fetch("/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalData),
  });
  if (response.ok) {
    const data = await response.json();
    console.log(" information saved:", data.record);
    firstName = "";
    lastName = "";
    email = "";
    phoneNumber = "";
    companyName = "";
    location = "";
    accountNumber = "";
    alert("Form submitted successfully!");
  } else {
    const errorData = await response.json();
    console.error("Failed to save contact information:", errorData.error);
    alert(
      "There was an error submitting your information. Please try again."
    );
  }
}

const locations = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
];
let fileInputRef; 

const triggerFileInput = () => {
if (fileInputRef) {
  fileInputRef.click();
}
};
</script>

<div class="w-full p-4">
<form on:submit={handleSubmit}>
  <div class=" w-full pb-6 h-full">
    <h2 class="text-primary-400 font-semibold text-base pb-4">
      Product Documentation
    </h2>

    <div class="my-4">
      <label class="block text-base"
        >*Please select the document you require</label
      >
      <div class="text-sm my-4 w-full md:w-3/4 lg:w-3/4 flex justify-between">
        <label>
          <input type="radio" bind:group={documentRequired} value="SDS / CoA / CoO" class="text-wrap"/>
          SDS / CoA / CoO
        </label>
        <label>
          <input type="radio" bind:group={documentRequired} value="Other Documentation" />
          Other Documentation
        </label>
      </div>

    </div>
    <div class="py-10 px-5 border border-gray-300 rounded-sm">
      <p>Did you know that you can find SDS, CoA, and CoO online?</p>
      <p>Please try our <a href="/document-search-page" class="text-blue-500 font-semibold">Document Search Page</a></p>
    </div>

    <div class="mt-8">
      <label class="block text-base pb-2 font-semibold">Please upload a list of products or a sample document here:</label>
      <button type="button " on:click={triggerFileInput} class=" text-primary-400 border border-primary-400 mb-4 px-2 rounded-md lg:ml-8 md:ml-8 hover:text-white hover:bg-primary-400">
        Choose Files
      </button>
      <input type="file" multiple on:change={handleFileChange} bind:this={fileInputRef} class="hidden" />

      {#each attachments as file, index}
        <div class="flex items-center mt-2">
          <span class="mr-2">{file.name}</span>
          <a href={URL.createObjectURL(file)} download class="text-blue-500 mr-2"><Icon icon="line-md:download-loop" class="w-8 h-5 text-black" /></a>
          <button type="button" on:click={() => removeAttachment(index)} class="text-red-500"><Icon icon="material-symbols:delete" class="w-8 h-5 text-red" /></button>
        </div>
      {/each}
      
    </div>
    <div class="flex justify-center">
      <p class="text-gray-400 text-sm">Attachments are limited to a combined size of 25MB</p>
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


