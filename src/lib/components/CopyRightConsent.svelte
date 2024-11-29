<script>
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';

  let thankYouMessageVisible = false;
  let uploadOption = ''; 
  let email = '';
  let emailError = '';
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  let   title="";
  let firstname = '';
  let lastname = '';
  let company = '';
  let errormessage = '';
  let phone = '';
  let message = '';
  let countrySelect;
  let street = "";
  let postalcode = "";
  let country = "";
  let city = "";
  let selectedFileName = '';
  let description = "";
  let url = ""; 
  let ExtractedData = null;
  let image = null;
  let fileName = ''; 

  const countries = [
      "United States", "Canada", "United Kingdom", "Australia", "Germany", "France",
      "India", "Brazil", "Japan", "South Africa", "Italy", "Spain", "Mexico", 
      "China", "Russia", "Netherlands", "Sweden", "Norway", "New Zealand", "Singapore", "China", "Other"
  ];


  function handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
          selectedFileName = file.name;

          if (file.type.startsWith('image/')) {
              fileName = 'image'; 
              image = file;
              ExtractedData = null; 
          } else {
              fileName = 'ExtractedData';
              image = null; 
          }


          if (file.size > maxFileSize) {
              alert("File is too large, maximum size is 25MB.");
              return;
          }


          if (file.type === 'text/plain' || file.type === 'application/csv' || file.type === 'application/pdf') {
              const reader = new FileReader();
              reader.onload = () => {
                  let fileContent = reader.result;


                  fileContent = sanitizeFileContent(fileContent);
                  ExtractedData = fileContent;  

              };

              reader.readAsText(file);  
          }
      }
  }


  function sanitizeFileContent(content) {
      if (typeof content === 'string') {

          const scriptRegex = /<script.*?>.*?<\/script>/gi;
          return content.replace(scriptRegex, ''); 
      }
      return content; 
  }

  onMount(() => {
      countries.forEach(country => {
          const option = document.createElement('option');
          option.value = country;
          option.textContent = country;
          countrySelect.appendChild(option);
      });
  });

  function hideThankYouMessage() {
      setTimeout(() => {
          thankYouMessageVisible = false;
      }, 3000);
  }
</script>
<div class="lg:w-11/12 max-w-7xl px-3 mx-auto mb-3">
  <div class="bg-gray-50 mx-auto w-full py-2 px-3 md:px-8 lg:px-0">
      <h1 class="text-2xl font-bold mb-4 mt-5 text-center">Copyright Consent</h1>
      <p class="mb-2 text-sm text-justify">In case you are requesting our consent to use copyrighted material available on our website, please make sure that you have checked our <a href="/terms/site-and-terms" class="text-primary-500">Site Use Terms</a>.</p>
      <p class="mb-2  text-sm text-justify">If you are requesting copyright consent that is not already provided by the “Intellectual Property Rights” section, then please fill out the below form, and send it to us. We will review your request.</p>
      <p class="mb-2 text-sm text-justify">Please note that sending the below request form does NOT give you any license or consent, including implied, to use our copyrighted work unless you receive our explicit consent or if the consent is provided according to the Site Use Terms.</p>
      <p class="mb-2 text-sm ">Fields indicated by an * are required.</p>
      
      <form method="POST" action="?/submitForm" enctype="multipart/form-data" class="space-y-4" use:enhance={() => {
          return async ({ result }) => {
              console.log(result);
              if (result) {
                  title="";
                  ExtractedData="";
                  image="";
                  thankYouMessageVisible = true; 
                  hideThankYouMessage();
                  firstname = "";
                  lastname = "";
                  email = "";
                  phone = "";
                  company = "";
                  street = "";
                  postalcode = "";
                  country = "";
                  city = "";
                  url = "";
                  description = "";
                  message = 'Your information has been submitted successfully!';
              } else {
                  console.log(`${result.data.error}`, result.data.details);
                  errormessage = 'There was an error submitting your information. Please try again.';
                  alert('There was an error submitting your information. Please try again.');
              }  
          }; 
      }}>
          <!-- Title -->
          <div class="md:w-1/2">
              <label for="title" class="block text-gray-700 font-semibold text-sm py-2">*Title</label>
              <select id="title" name="title"  class="hover:border-primary-500 focus:border-primary-400  text-sm focus:outline-none focus:ring-0 rounded mb-2 w-full md:w-4/5 p-2" required>
                  <option value="" disabled selected >Select Title</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Ph.D.">Ph.D.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Rev.">Rev.</option>      
              </select>
          </div>    
          <!-- Name fields -->
          <div class="mb-4 flex flex-col md:flex-row gap-x-6">
              <div class="mb-3 md:mb-0 md:mr-12 w-full md:w-1/2">
                  <label for="firstname" class="block text-gray-700 font-semibold text-sm my-2">*First Name</label>
                  <input type="text" placeholder="First Name" name="firstname" bind:value={firstname} class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0 rounded p-2  text-sm w-full" required />
              </div>
              <div class="mb-2 md:mb-0 md:ml-12 w-full md:w-1/2">
                  <label for="lastname" class="block text-gray-700 font-semibold text-sm my-2">*Last Name</label>
                  <input type="text" placeholder="LastName" name="lastname" bind:value={lastname} class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0 rounded p-2 text-sm w-full" required />
              </div>
          </div>
          <!-- Company and address fields -->
          <div class="mb-4 flex flex-col md:flex-row gap-x-6">
              <div class="mb-2 md:mb-0 md:mr-12 w-full md:w-1/2 my-2">
                  <label for="company" class="block text-gray-700 font-semibold text-sm my-2">*Company Name</label>
                  <input type="text" placeholder="Company Name" name="company" bind:value={company} class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0 rounded p-2 text-sm w-full" />
              </div>
              <div class="mb-2 md:mb-0 md:ml-12 w-full md:w-1/2 my-2 ">
                  <label for="street" class="block text-gray-700 font-semibold text-sm my-2">*Street or Postbox</label>
                  <input type="text" placeholder="Street" id="street" name="street" bind:value={street} class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0 rounded text-sm w-full p-2" required />
              </div>
          </div>

          <!-- Postalcode and City -->
          <div class="mb-4 flex flex-col md:flex-row gap-x-6">
              <div class="mb-2 md:mb-0 md:mr-12 w-full md:w-1/2 my-2">
                   <label for="postalcode" class="block text-gray-700 font-semibold text-sm my-2">*ZIP or Postal Code</label> 
                  <input type="tel" placeholder="postal/ZipCode" id="postalcode" name="postalcode" bind:value={postalcode} class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0 rounded text-sm w-full p-2" required />
              </div>
              <div class="mb-2 md:mb-0 md:ml-12 w-full md:w-1/2 my-2">
                  <label for="city" class="block text-gray-700 font-semibold text-sm my-2">*City or Town</label> 
                  <input type="text" id="city" placeholder="city" name="city" bind:value={city} class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0 rounded text-sm w-full p-2" required />
              </div>
          </div>
          <!-- Country & Email -->
          <div class="mb-4 flex flex-col md:flex-row gap-x-6">
              <div class="mb-2 md:mb-0 md:mr-12 w-full md:w-1/2">
                  <label for="country" class="block text-gray-700 font-semibold text-sm my-2">*Country</label>
                  <select id="country"  bind:value={country} bind:this={countrySelect} name="location" class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0 rounded text-sm w-full p-2" >
                      <option value="" disabled selected>Select Country</option>
                  </select>
              </div>
              <div class="mb-2 md:mb-0 md:ml-12 w-full md:w-1/2">
                  <label for="email" class="block text-gray-700 font-semibold text-sm my-2">*Email Address</label>
                  <input type="email" id="email" name="email" placeholder="Email" bind:value={email} class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0 rounded w-full text-sm p-2" required />
                  {#if emailError}
                      <p class="text-red-500 text-sm">{emailError}</p>
                  {/if}
              </div>
          </div>
          <!-- File/Image Upload Selection -->
          <fieldset class="mb-4">
              <div class="font-semibold text-gray-700 mt-2 md:w-5/12">Please attach it to this request or share the link so that we could allocate it.</div>
              <div class="flex flex-col md:flex-row mb-0">
                  <div class="mt-1 w-full md:w-1/2">
                      <!-- Radio buttons to choose between file or URL -->
                      <div class="mb-4">
                          <input type="radio" id="toggleUpload" name="uploadOption" value="file" bind:group={uploadOption} class="mr-2 rounded text-primary-600  focus:outline-none focus:ring-0 focus:ring-primary-600 " />
                          <label for="toggleUpload" class="text-sm text-gray-700 ">Choose File or Image</label>
                     
                      <div class="mb-4">
                          <input type="radio" id="toggleURL" name="uploadOption" value="url" bind:group={uploadOption} class="mr-2 rounded text-primary-600  focus:outline-none focus:ring-0 focus:ring-primary-600" />
                          <label for="toggleURL" class="text-sm text-gray-700">Provide URL to the Work</label>
                      </div>
                  </div>
                      <!-- Upload File -->
                      {#if uploadOption === 'file'}
                          <div>
                              <label for="file" class="block font-semibold text-gray-700 text-sm mt-2 mb-1">Choose File (.csv,.txt,.pdf,.jpg,.png,.jpeg) </label>
                              <input type="file" id="file" name={fileName} accept=".csv,.txt,.pdf,.jpg,.jpeg,.png" class="border border-gray-400  focus:outline-primary-400 rounded p-2 w-full md:w-3/4 lg:w-4/5" on:change={handleFileChange} />
                          </div>
                      {/if}
              
            <!-- URL -->
                      {#if uploadOption === 'url'}
                          <div class="mb-4">
                              <label for="url" class="block text-gray-700 font-semibold text-sm mb-1">*URL to the Work</label>
                              <input type="url" placeholder="URL" id="url" name="url" bind:value={url} class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0  rounded w-full md:w-3/4 lg:w-4/5 p-2" required />
                          </div>
                      {/if}
                  </div>
              </div>
          </fieldset>

          <div class="mb-4">
              <label for="description" class="block text-gray-700 md:w-5/12 font-semibold mb-2">
                  Please describe the way and the purpose you are going to use our copyrighted work</label>
              <textarea id="description" name="description" rows="3" class="hover:border-primary-500 focus:border-primary-400 focus:outline-none focus:ring-0  rounded w-full md:w-5/12 p-2" bind:value={description} ></textarea>
          </div>

          <button type="submit" class="bg-primary-500 hover:bg-primary-700 text-white py-2 px-4 rounded">Submit Request</button>
      </form>

      <!-- Thank you message -->
 
      {#if thankYouMessageVisible}
      <div class="flex justify-center items-center">
          <p class="text-white text-center w-1/2 bg-green-600 p-2 rounded-lg">
              Thank you for submitting your request!
          </p>
      </div>
      {/if}
  </div>
</div>
