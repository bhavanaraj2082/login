<script>
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";
  let technical_issue="";
  let issue = "";
  let assistance = "";
  let attachments = [];
  let totalSize = 0;
  let firstName = "";
  let lastName = "";
  let email = "";
  let phoneNumber = "";
  let companyName = "";
  let location = "";
  let accountNumber = "";
  let message = "";
  let errormessage = "";
  const maxFileSize = 25 * 1024 * 1024;
  let selectedOption = "";
  let isDropdownOpen = false;

  const options = [
    "General Search",
    "Structure Search",
    "Advance Search",
    "Product Information",
    "Pricing Issues",
    "Product Availability Issues",
    "Product backordered",
    "Certificate of Analysis",
    "Certificate of Origin",
    "SDS (Safety Data Sheets)",
    "Other Technical Documents",
    "Shopping Cart",
    "Order Center",
    "Custom DNA & RNA Oligos & Gene Editing & Peptide Orders",
    "Loggin in to my account",
    "Web profile change",
    "Website slower than expected",
    "Other"
  ];

  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  const selectOption = (option) => {
    selectedOption = option;
    isDropdownOpen = false;
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    let filesAdded = false;

    for (const file of files) {
      if (totalSize + file.size > maxFileSize) {
        alert(
          "Total file size exceeds 25 MB limit. Please select smaller files."
        );
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

    event.target.value = "";
  };

  const removeAttachment = (index) => {
    if (attachments[index]) {
      totalSize -= attachments[index].size;
      attachments.splice(index, 1);
      alert("File removed successfully!");
      attachments = attachmentFunction(attachments);
    }
  };

  function attachmentFunction(attachments) {
    return attachments;
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
  <form
    method="POST"
    action="?/contact"
    use:enhance={() => {
      return async ({ result }) => {
       
        // console.log(result);

        if (result.data.record && result.type === "success") {
          // console.log(`${result.data.message}`);
          // Clear the form
          technical_issue="";
          issue = "";
          assistance = "";
          firstName = "";
          lastName = "";
          email = "";
          phoneNumber = "";
          companyName = "";
          location = "";
          accountNumber = "";
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
      };
    }}
  >
    <div class=" w-full pb-6 h-full">
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
      <h2 class="text-primary-400 font-semibold text-base pb-6">
        Technical Problems
      </h2>
      <input hidden name="issueName" value="Technical Problems" />
      <div class=" relative">
        <label class="block text-sm pb-2">Where are you experiencing difficulties on our website?</label>
        <div class="border rounded-md cursor-pointer" on:click={toggleDropdown}>
          <input
            type="text"
            name="technical_issue"
            placeholder="Select an option"
            class="w-full border-none pt-2 text-sm focus:outline-none"
            readonly
            
            bind:value={selectedOption}
          />
          {#if isDropdownOpen}
            <div class="absolute w-full bg-white border rounded-md max-h-40 overflow-y-auto z-10">
              <ul>
                {#each options as option}
                  <li class="p-2 text-sm hover:bg-gray-200" on:click={() => selectOption(option)}>
                    {option}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </div>
      <div class="mt-4">
        <label class="block text-sm"
          >Please let us know how we may assist you:</label
        >
        <textarea
          rows="5"
          name="assistance"
          bind:value={assistance}
          class="w-full border p-2 text-sm"
          required
        ></textarea>
      </div>

      <div class="mt-4">
        <label class="block text-sm pb-2"
          >Please attach any images or files that may assist in troubleshooting
          or investigation:</label
        >
        <button
          type="button "
          on:click={triggerFileInput}
          class=" text-primary-400 border border-primary-400 mb-4 px-2 rounded-md lg:ml-8 md:ml-8 hover:text-white hover:bg-primary-400"
        >
          Choose Files
        </button>
        <input
          type="file"
          multiple
          on:change={handleFileChange}
          bind:this={fileInputRef}
          class="hidden"
        />

        {#each attachments as file, index}
          <div class="flex items-center mt-2">
            <span class="mr-2">{file.name}</span>
            <a
              href={URL.createObjectURL(file)}
              download
              class="text-blue-500 mr-2"
              ><Icon
                icon="line-md:download-loop"
                class="w-8 h-5 text-black"
              /></a
            >
            <button
              type="button"
              on:click={() => removeAttachment(index)}
              class="text-red-500"
              ><Icon
                icon="material-symbols:delete"
                class="w-8 h-5 text-red"
              /></button
            >
          </div>
        {/each}
      </div>
      <div class="flex justify-center ">
        <p class="text-gray-400 text-sm">
          Attachments are limited to a combined size of 25MB
        </p>
      </div>
      <div class="mt-4">
        <label class="block text-sm">*Would you like us to contact you?</label>
        <div class="mt-2">
          <label class="block text-sm py-2">
            <input
              type="radio"
              name="issue"
              value="Please respond to my question/comment"
              bind:group={issue}
              class="mr-2"
              required
            />
            Please respond to my question/comment
          </label>
          <label class="block text-sm py-2">
            <input
              type="radio"
              name="issue"
              value="need further information please contact me"
              bind:group={issue}
              class="mr-2"
              required
            />
            If you need further information, please contact me
          </label>
          <label class="block text-sm py-2">
            <input
              type="radio"
              name="issue"
              value="Please do not contact me regarding my comment"
              bind:group={issue}
              class="mr-2"
              required
            />

            Please do not contact me regarding my comment
          </label>
        </div>
      </div>
    </div>
    <div class=" w-full pb-6 mx-auto h-full ">
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

      <button
        type="submit"
        class="w-full bg-primary-400 text-white p-2 rounded hover:bg-primary-500 mt-4"
      >
        Submit
      </button>
    </div>
  </form>
</div>
