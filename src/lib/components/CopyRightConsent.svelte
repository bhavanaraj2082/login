<script>
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';

    let thankYouMessageVisible = false;
    let uploadOption = ''; 
    let email = '';
    let sanitizedContent = '';
    let emailError = '';
    let totalSize = 0;
    const maxFileSize = 25 * 1024 * 1024;
    let attachments = [];
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
    let  description="";
    let url="";

    const countries = [
        "United States", "Canada", "United Kingdom", "Australia", "Germany", "France",
        "India", "Brazil", "Japan", "South Africa", "Italy", "Spain", "Mexico", 
        "China", "Russia", "Netherlands", "Sweden", "Norway", "New Zealand", "Singapore", "Other"
    ];

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        let filesAdded = false;
        if (files.length > 0) {
            selectedFileName = files[0].name; 
        } else {
            selectedFileName = ''; 
        }
        for (const file of files) {
            if (totalSize + file.size > maxFileSize) {
                alert('Total file size exceeds 25 MB limit. Please select smaller files.');
                return;
            }
            
            totalSize += file.size;
            attachments.push(file);
            filesAdded = true;

            const reader = new FileReader();
            reader.onload = (e) => {
                sanitizedContent = e.target.result.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
                console.log(sanitizedContent); 
            };
            reader.readAsText(file);
        }

        if (filesAdded) {
            alert(`${files.length} file(s) added successfully!`);
        }
        event.target.value = ''; 
    };

    onMount(() => {
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
    });

    function toggleUploadFields(option) {
        uploadOption = option;
    }
</script>

<body class="bg-gray-100 p-4 md:p-8">
    <div class="m mx-auto">
        <h1 class="text-3xl font-bold mb-4 mt-10 text-center">Copyright Consent</h1>
        <p class="mb-2 text-justify">In case you are requesting our consent to use copyrighted material available on our website, please make sure that you have checked our <a href="/terms" class="text-primary-500">Site Use Terms</a>.</p>
        <p class="mb-2 text-justify">If you are requesting copyright consent that is not already provided by the “Intellectual Property Rights” section, then please fill out the below form, and send it to us. We will review your request.</p>
        <p class="mb-2 text-justify">Please note that sending the below request form does NOT give you any license or consent, including implied, to use our copyrighted work unless you receive our explicit consent or if the consent is provided according to the Site Use Terms.</p>
        <p class="mb-2">Fields indicated by an * are required.</p>
        
        <form method="POST" action="/site1" enctype="multipart/form-data" class="space-y-4" use:enhance={() => {
            return async ({ result }) => {
                console.log(result);
                if (result.data.body && result.type === 'success') {
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
                    url=""
                    description=""
                    message = 'Your information has been submitted successfully!';
                } else {
                    console.log(`${result.data.error}`, result.data.details);
                    errormessage = 'There was an error submitting your information. Please try again.';
                    alert('There was an error submitting your information. Please try again.');
                }  
            }; 
        }}>
            <div class="mb-4">
                <label for="title" class="block  text-gray-700 font-semibold">*Title</label>
                <input type="text" id="title" name="title" class="border rounded w-full md:w-1/2 p-2" required />
            </div>
            <div class="mb-4 flex flex-col md:flex-row">
                <div class="mb-2 md:mb-0 md:mr-2 w-full md:w-1/2">
                    <label for="firstname" class="block text-gray-700 font-semibold">*First Name</label>
                    <input type="text" name="firstname" bind:value={firstname} class="border rounded-md p-2 text-sm w-full" required />
                </div>
                <div class="mb-2 md:mb-0 md:ml-2 w-full md:w-1/2">
                    <label for="lastname" class="block text-gray-700 font-semibold">*Last Name</label>
                    <input type="text" name="lastname" bind:value={lastname} class="border rounded-md p-2 text-sm w-full" required />
                </div>
            </div>
            <div class="mb-4 flex flex-col md:flex-row">
                <div class="mb-2 md:mb-0 md:mr-2 w-full md:w-1/2">
                    <label for="company" class="block text-gray-700 font-semibold">*Company Name</label>
                    <input type="text" name="company" bind:value={company} class="border rounded-md p-2 text-sm w-full" />
                </div>
                <div class="mb-2 md:mb-0 md:ml-2 w-full md:w-1/2">
                    <label for="street" class="block  text-gray-700 font-semibold">*Street or Postbox</label>
                    <input type="text" id="street" name="street" bind:value={street} class="border rounded w-full p-2" required />
                </div>
            </div>
            <div class="mb-4 flex flex-col md:flex-row">
                <div class="mb-2 md:mb-0 md:mr-2 w-full md:w-1/2">
                    <label for="postalcode" class="block  text-gray-700  font-semibold">*ZIP or Postal Code</label>
                    <input type="number" id="postalcode" name="postalcode" bind:value={postalcode} class="border rounded w-full p-2" required />
                </div>
                <div class="mb-2 md:mb-0 md:ml-2 w-full md:w-1/2">
                    <label for="city" class="block text-gray-700 font-semibold">*City or Town</label>
                    <input type="text" id="city" name="city" bind:value={city} class="border rounded w-full p-2" required />
                </div>
            </div>
            <div class="mb-4 flex flex-col md:flex-row">
                <div class="mb-2 md:mb-0 md:mr-2 w-full md:w-1/2">
                    <label for="country" class="block text-gray-700 font-semibold">*Country</label>
                    <select id="country" bind:value={country} bind:this={countrySelect} name="location" class="border rounded w-full p-2" required>
                        <option value="" disabled selected>Select Country</option>
                    </select>
                </div>
                <div class="mb-2 md:mb-0 md:ml-2 w-full md:w-1/2">
                    <label for="email" class="block  text-gray-700 font-semibold">*Email Address</label>
                    <input type="email" id="email" name="email" bind:value={email} class="border rounded w-full p-2" required />
                    {#if emailError}
                        <p class="text-red-500 text-sm">{emailError}</p>
                    {/if}
                </div>
            </div>
            <fieldset class="mb-4">
                <legend class="font-semibold text-gray-700">Please attach it to this request or share the link.</legend>
                <div class="flex flex-col md:flex-row items-start">
                    <div class="mb-2 md:mb-0 md:mr-4">
                        <input type="radio" id="attachFile" name="uploadOption" value="file" on:change={() => toggleUploadFields('file')} />
                        <label for="attachFile" class="ml-2 text-gray-700">Attach a File</label>
                    </div>
                    <div class="mb-2 md:mb-0 md:mr-4">
                        <input type="radio" id="shareLink"  name="uploadOption" value="url" on:change={() => toggleUploadFields('url')} />
                        <label for="shareLink"  class="ml-2 text-gray-700">Share the Link</label>
                    </div>
                </div>
    
              
                <div class={uploadOption === 'file' ? 'block' : 'hidden'}>
                    <label for="file" class="block font-semibold text-gray-700 mt-2">Choose File (.csv, .txt, .pdf)</label>
                    <div class="relative">
                        <input type="file" id="file" name="file" accept=".csv,.txt,.pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" on:change={handleFileChange} />
                        <div class="border rounded w-full md:w-1/2 p-2 cursor-pointer  flex items-center justify-between">
                            <span>{selectedFileName || "No File Chosen"}</span>
                            <span class="text-gray-500">Browse</span>
                        </div>
                        <input type="text" name="ExtractedData" value={sanitizedContent} hidden>
                        
                    </div>
                </div>
                <div class={uploadOption === 'url' ? 'block' : 'hidden'}>
                    <label for="url" class="block font-semibold mt-2">Paste the URL</label>
                    <input type="url" id="url" bind:value={url} name="url" class="border rounded w-full md:w-1/2 p-2" />
                </div>
            </fieldset>
    
            <div class="mb-4 p-4">
                <h2 class="text-sm  md:w-1/2 font-semibold">Please describe the way and the purpose you are going to use our copyrighted work</h2>
                <textarea id="description" bind:value={description} name="description" class="border rounded w-full md:w-1/2 p-2 mt-2" rows="4"></textarea>
            </div>
            <div class="flex justify-center w-full md:w-1/2 mt-1">
                <button type="submit" class="text-white text-lg w-full md:w-1/2 bg-primary-500 rounded p-1">Submit</button>
            </div>
        </form>
        {#if thankYouMessageVisible}
            <p class="mt-4 text-green-500 text-center">{message}</p>
        {/if}
        {#if errormessage}
            <p class="mt-4 text-red-500 text-center">{errormessage}</p>
        {/if}
    </div>
</body>
