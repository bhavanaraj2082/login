<script>
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';

    let thankYouMessageVisible = false;
    let uploadOption = ''; 
    let email = '';
    let emailError = '';
    const maxFileSize = 5 * 1024 * 1024; // 5MB
  
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


</script>
<body class="bg-gray-100 p-2 md:p-8">
    <div class="mx-auto">
        <h1 class="text-2xl font-bold mb-4 mt-5 text-center">Copyright Consent</h1>
        <p class="mb-2 text-sm text-justify">In case you are requesting our consent to use copyrighted material available on our website, please make sure that you have checked our <a href="/terms" class="text-primary-500">Site Use Terms</a>.</p>
        <p class="mb-2  text-sm text-justify">If you are requesting copyright consent that is not already provided by the “Intellectual Property Rights” section, then please fill out the below form, and send it to us. We will review your request.</p>
        <p class="mb-2 text-sm text-justify">Please note that sending the below request form does NOT give you any license or consent, including implied, to use our copyrighted work unless you receive our explicit consent or if the consent is provided according to the Site Use Terms.</p>
        <p class="mb-2 text-sm ">Fields indicated by an * are required.</p>
        
        <form method="POST" action="/site1" enctype="multipart/form-data" class="space-y-4" use:enhance={() => {
            return async ({ result }) => {
                console.log(result);
                if (result.data.body && result.type === 'success') {
                    ExtractedData="";
                    image="";
                    thankYouMessageVisible = true; 
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
            <div class="mb-4">
                <label for="title" class="block text-gray-700 font-semibold text-sm ">*Title</label>
                <select id="title" name="title" class="border rounded w-full md:w-1/2 p-2" required>
                    <option value="" disabled selected >Select Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Ph.D.">Ph.D.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Rev.">Rev.</option>
                    <option value="Sir">Sir</option>
                    <option value="Madam">Madam</option>
                </select>
            </div>
            

            <!-- Name fields -->
            <div class="mb-4 flex flex-col md:flex-row">
                <div class="mb-2 md:mb-0 md:mr-2 w-full md:w-1/2">
                    <label for="firstname" class="block text-gray-700 font-semibold text-sm">*First Name</label>
                    <input type="text" placeholder="First Name" name="firstname" bind:value={firstname} class="border rounded-md p-2 text-sm w-full" required />
                </div>
                <div class="mb-2 md:mb-0 md:ml-2 w-full md:w-1/2">
                    <label for="lastname" class="block text-gray-700 font-semibold text-sm">*Last Name</label>
                    <input type="text" placeholder="LastName" name="lastname" bind:value={lastname} class="border rounded-md p-2 text-sm w-full" required />
                </div>
            </div>

            <!-- Company and address fields -->
            <div class="mb-4 flex flex-col md:flex-row">
                <div class="mb-2 md:mb-0 md:mr-2 w-full md:w-1/2">
                    <label for="company" class="block text-gray-700 font-semibold text-sm">*Company Name</label>
                    <input type="text" placeholder="Company Name" name="company" bind:value={company} class="border rounded-md p-2 text-sm w-full" />
                </div>
                <div class="mb-2 md:mb-0 md:ml-2 w-full md:w-1/2">
                    <label for="street" class="block text-gray-700 font-semibold text-sm">*Street or Postbox</label>
                    <input type="text" placeholder="Street" id="street" name="street" bind:value={street} class="border rounded w-full p-2" required />
                </div>
            </div>

            <!-- Postalcode and City -->
            <div class="mb-4 flex flex-col md:flex-row">
                <div class="mb-2 md:mb-0 md:mr-2 w-full md:w-1/2">
                     <label for="postalcode" class="block text-gray-700 font-semibold text-sm">*ZIP or Postal Code</label> 
                    <input type="number" placeholder="postal/ZipCode" id="postalcode" name="postalcode" bind:value={postalcode} class="border rounded w-full p-2" required />
                </div>
                <div class="mb-2 md:mb-0 md:ml-2 w-full md:w-1/2">
                    <label for="city" class="block text-gray-700 font-semibold text-sm">*City or Town</label> 
                    <input type="text" id="city" placeholder="city" name="city" bind:value={city} class="border rounded w-full p-2" required />
                </div>
            </div>

            <!-- Country & Email -->
            <div class="mb-4 flex flex-col md:flex-row">
                <div class="mb-2 md:mb-0 md:mr-2 w-full md:w-1/2">
                    <label for="country" class="block text-gray-700 font-semibold text-sm">*Country</label>
                    <select id="country"  bind:value={country} bind:this={countrySelect} name="location" class="border rounded w-full p-2" >
                        <option value="" disabled selected>Select Country</option>
                    </select>
                </div>
                <div class="mb-2 md:mb-0 md:ml-2 w-full md:w-1/2">
                    <label for="email" class="block text-gray-700 font-semibold text-sm">*Email Address</label>
                    <input type="email" id="email" name="email" placeholder="Email" bind:value={email} class="border rounded w-full p-2" required />
                    {#if emailError}
                        <p class="text-red-500 text-sm">{emailError}</p>
                    {/if}
                </div>
            </div>

            <!-- File/Image Upload Selection -->
            <fieldset class="mb-4">
                <div class="font-semibold text-gray-700">Please attach it to this request or share the link so that we could allocate it.</div>
                <div class="flex flex-col md:flex-row mb-4">
                    <div class="mb-4 w-full md:w-1/2">
                        <!-- Radio buttons to choose between file or URL -->
                        <div class="mb-4">
                            <input type="radio" id="toggleUpload" name="uploadOption" value="file" bind:group={uploadOption} class="mr-2" />
                            <label for="toggleUpload" class="text-sm text-gray-700">Choose File or Image</label>
                       
                
                        <div class="mb-4">
                            <input type="radio" id="toggleURL" name="uploadOption" value="url" bind:group={uploadOption} class="mr-2" />
                            <label for="toggleURL" class="text-sm text-gray-700">Provide URL to the Work</label>
                        </div>
                    </div>
                
                        <!-- Upload File -->
                        {#if uploadOption === 'file'}
                            <div>
                                <label for="file" class="block font-semibold text-gray-700 text-sm mt-2">Choose File (.csv,.txt,.pdf,.jpg,.png,.jpeg) </label>
                                <input type="file" id="file" name={fileName} accept=".csv,.txt,.pdf,.jpg,.jpeg,.png" class="border rounded p-2 w-full" on:change={handleFileChange} />
                            </div>
                        {/if}
                
              <!-- URL -->
                        {#if uploadOption === 'url'}
                            <div class="mb-4">
                                <label for="url" class="block text-gray-700 font-semibold">*URL to the Work</label>
                                <input type="url" id="url" name="url" bind:value={url} class="border rounded w-full p-2" required />
                            </div>
                        {/if}
                    </div>
                </div>
            </fieldset>


            <div class="mb-4">
                <label for="description" class="block text-gray-700 text-sm font-semibold ">
                    Please describe the way and the purpose you are going to use our copyrighted work</label>
                <textarea id="description" name="description" rows="3" class="border rounded w-full lg:w-1/2 p-2" bind:value={description} ></textarea>
            </div>

           

            <button type="submit" class="bg-primary-500 text-white py-2 px-4 rounded">Submit Request</button>
        </form>

        <!-- Thank you message -->
        {#if thankYouMessageVisible}
            <p class="text-green-500 text-center mt-4">Thank you for submitting your request!</p>
        {/if}
    </div>
</body>
