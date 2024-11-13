<script>
    import Icon from '@iconify/svelte';
    let selectedOptions = {
        'existing-connection': false,
        'more-info': false,
        'setup-connection': false,
        'existing-organization': false,
        'other-question': false,
    };
    function handleOptionChange(option) {
        selectedOptions[option] = !selectedOptions[option];
    }
        import { enhance } from '$app/forms';
    const locations = ["India", "USA", "UK", "Australia", "Canada", "Germany", "France", "Japan", "Brazil", "South Africa"];
    let phone = ''; 
    let name = '';
    let message = '';
    let subject = '';
    let formValid = true;
    let formSubmitted = false;
    let showErrors = false;
    let successMessage = '';
    let errorMessage = '';
    let fname='';
    let lname='';
    let email='';
    let number='';
    let location='';
    let details='';
    let company='';
    let role='';
    function resetForm() {
    phone = '';
    name = '';
    message = '';
    subject = '';
    successMessage = '';
    errorMessage = '';
    fname='';
    lname='';
    email='';
    number='';
    location='';
    details='';
    company='';
    role='';
}
    function handleSubmit(event) {
        if (number.length !== 10 || email.length === 0 || fname.length === 0 || company.length === 0 || details.length === 0 || role.length===0 || lname.length === 0) {
            console.log('Validation failed: Missing required fields');
            event.preventDefault();
            formValid = false;
            showErrors = true;
        } else {
            formValid = true;
            formSubmitted = true;
            showErrors = false;
        }
        if (!formValid) { 
            event.preventDefault(); 
        }
    }
    function showMessage(message1, keywordError) {
        successMessage = message1;
        errorMessage = keywordError;
        if (keywordError === 'success') {
        setTimeout(() => {resetForm();}, 2000);  
    }
    }
</script>
<section class="mt-16 md:px-16 px-5 md:mt-10">
    <div class="hover:text-primary-300 text-primary-500 text-xl font-semibold mb-7">Chemikart Solutions</div>
        <p class="text-base leading-6 text-content mx-auto text-justify-center font-montserrat">
        We offer a full range of e-Commerce tools designed to enable greater spend control for your procurement staff, providing your researchers with ease of access to the products they've come to rely on.
        </p>
        <p class="text-base leading-6 text-content mx-auto text-justify-center font-montserrat mt-2">
        We have three solutions available to help you save time and cost in procurement management. Read further for more details of each solution, or fill out our contact form and our team will reach out to you to answer any questions.
        </p>      
        <div class="mt-12 mx-auto">
            <div class="flex gap-5 flex-wrap lg:flex-nowrap max-md:flex-col">
                <div class="w-full lg:w-3/5">
                    <div class="space-y-10 md:space-y-8 max-md:space-y-6">
                        <div class="flex flex-col md:flex-row items-start gap-4">
                            <Icon icon="game-icons:on-target" class="w-10 h-10 text-primary-500 flex-shrink-0" />
                            <div class="flex-auto">
                                <h2 class="text-heading font-semibold text-lg font-worksans text-primary-500">The One-to-One Solution: E-Procurement</h2>
                                <p class="text-content font-montserrat mt-4">e-Procurement provides seamless system-to-system connectivity of your existing spend management system.</p>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row items-start gap-4">
                            <Icon icon="mdi:family-tree" class="w-10 h-8 text-primary-500 flex-shrink-0" />
                            <div class="flex-auto">
                                <h2 class="text-heading font-semibold text-lg font-worksans text-primary-500">The Customized Solution: Pipeline®</h2>
                                <p class="text-content font-montserrat mt-4">This customized service balances your organization's business needs with the product requirements of your researchers.</p>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row items-start gap-4">
                            <Icon icon="fluent-mdl2:text-document-shared" class="w-10 h-8 text-primary-500 flex-shrink-0" />
                            <div class="flex-auto">
                                <h2 class="text-heading font-semibold text-lg font-worksans text-primary-500">The Simple Solution: Chemikart E-Shop</h2>
                                <p class="text-content font-montserrat mt-4">Your procurement staff can access our products simply, easily, and securely through chemikart.com.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <aside class="w-full lg:w-2/5 md:ml-0 lg:ml-8 max-md:w-full">
                    <div class="flex flex-col items-start space-y-5 text-black">
                        <Icon icon="game-icons:chemical-drop" class="w-20 h-24 text-primary-500" />
                        <p class="text-content font-montserrat">Discover our latest website features and enhance your experience with Chemikart.<br>Find information regarding new features as well as tips and tricks with Get Site Smart.</p>
                        <div class="mt-8">
                            <button class="px-10 py-3 text-primary-500 border-2 border-primary-500 rounded hover:bg-primary-500 hover:text-white transition-all">
                                Learn More
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
            
        </div>
</section>
<section class="mx-4 sm:mx-8 md:mx-10">
    <hr class="self-center mt-20 h-px w-full border border-black border-opacity-40 max-md:mt-10" />
</section>
<section class="px-4 sm:px-8 md:px-12 lg:px-16 mt-8">
    <div class="flex gap-8 max-md:flex-col">
        <div class="flex flex-col w-[65%] max-md:w-full">
            <div class="flex flex-col text-sm leading-6 text-black max-md:mt-6">
                <h3 class="text-heading font-semibold text-lg font-worksans mt-8 text-primary-500">The One-to-One Solution: E-Procurement</h3>
                <p class="mt-4 text-base text-content font-montserrat">
                    Chemikart is your source for procurement optimization. If you are already using an electronic spend management solution, leverage your investment to generate even greater savings by automating Chemikart's purchases and link your current buying platform to us.
                </p>
                <p class="mt-4 text-base text-content font-montserrat">
                    We support all major e-Procurement providers and have a dedicated technical team available to work with your organization or platform provider and install customized, scalable, all-in-one procurement solutions. e-Procurement offers efficiencies across the purchasing cycle, enabling product selection through e-Catalogs, both punchout or hosted file, accepting e-Purchase orders, sending electronic invoices, order confirmations, and advanced shipping notices, and more.
                </p>
                <h4 class="mt-6 text-heading font-semibold text-lg font-worksans text-primary-500">Three Steps to Install e-Procurement</h4>
                <ol class="list-decimal list-inside mt-4 space-y-3 text-base text-content font-montserrat">
                    <li>Create a Project Plan: We will partner with you to gather requirements, provide detailed analysis, then implement a project plan with milestones.</li>
                    <li>Setup & Testing: We will work through setup and testing to ensure end-to-end processes are in place.</li>
                    <li>Launch and Go-Live Monitoring: After testing, we provide post-go-live monitoring to ensure the solution meets your expectations.</li>
                </ol>
            </div>
        </div>
        <div class="flex flex-col w-[35%] max-md:w-full max-md:mt-6">
            <h3 class="text-heading font-semibold text-lg font-worksans mt-8 text-primary-500">Benefits to e-Procurement</h3>
            <ol class="list-decimal list-inside mt-4 space-y-3 text-base text-content font-montserrat">
                <li>Process efficiency from end-to-end driven by real-time data exchange, speed, and transaction efficiency.</li>
                <li>Cost Reduction via reduced transaction costs and administrative overhead.</li>
                <li>A variety of spend analysis options and direct spend control.</li>
                <li>Automated transactions increase productivity through improved order handling accuracy, paperless invoicing, and faster procure-to-pay cycles.</li>
                <li>Global approach and management of scale, harmonized for all your sites.</li>
            </ol>
            <button class="px-6 py-3 mt-4 text-primary-500 border-2 border-primary-500 rounded hover:bg-primary-500 hover:text-white transition-all max-md:self-start">
                Request More Information
            </button>
        </div>
    </div>
    <div class="flex gap-8 max-md:flex-col mt-12">
        <div class="flex flex-col w-[65%] max-md:w-full">
            <h3 class="text-heading font-semibold text-lg font-worksans mt-8 text-primary-500">The Customized Solution: Pipeline®</h3>
            <p class="mt-4 text-base text-content font-montserrat">
                An advanced ordering process customized to meet your business needs. PIPELINE® delivers options and benefits beyond simple ordering, providing direct, private connection to our order processing and fulfillment system. Flexible ordering processes are customized to meet your organization's requirements.
            </p>
            <p class="mt-4 text-base text-content font-montserrat">
                When you create your order through PIPELINE®, you see the exact purchase total. In addition, it provides a portal to information and special offers that have been tailored specifically for your organization.
            </p>
            <p class="mt-4 text-base text-content font-montserrat">
                To learn more about creating your PIPELINE® experience, submit the form to have one of our team members reach out.
            </p>
        </div>
        <div class="flex flex-col w-[35%] max-md:w-full max-md:mt-6">
            <h4 class="text-heading font-semibold text-lg font-worksans mt-8 text-primary-500">Benefits of PIPELINE®</h4>
            <ul class="list-disc list-inside mt-4 space-y-2 text-base text-content font-montserrat">
                <li>Elimination of paper transactions</li>
                <li>No IT investment required</li>
                <li>Support of procurement approval levels</li>
                <li>Real-time product availability with contract pricing</li>
                <li>Customized invoicing and payment</li>
                <li>Streamlined reconciliation process</li>
            </ul>
            <button class="px-6 py-3 mt-4 text-primary-500 border-2 border-primary-500 rounded hover:bg-primary-500 hover:text-white transition-all max-md:self-start">
                Request More Information
            </button>
        </div>
    </div>
    <div class="flex gap-8 max-md:flex-col mt-12">
        <div class="flex flex-col w-[65%] max-md:w-full">
            <h3 class="text-heading font-semibold text-lg font-worksans mt-8 text-primary-500">The Simple Solution: Chemikart E-Shop</h3>
            <p class="mt-4 text-base text-content font-montserrat">
                Your online order is integrated with our fulfillment systems, allowing for rapid processing. You can request quotes, place orders, and track deliveries all in one place.
            </p>
            <p class="mt-4 text-base text-content font-montserrat">
                With Chemikart.com as the leading Web site in the industry, you can rest assured you're getting the most competitive service available.
            </p>
        </div>
        <div class="flex flex-col w-[35%] max-md:w-full max-md:mt-6">
            <h4 class="text-heading font-semibold text-lg font-worksans mt-8 text-primary-500">Benefits of the Chemikart e-Shop:</h4>
            <ul class="list-disc list-inside mt-4 space-y-2 text-base text-content font-montserrat">
                <li>Your information is safe and secure</li>
                <li>Advanced tools and product searches</li>
                <li>Account-specific pricing</li>
                <li>e-Quotes converted directly to orders</li>
            </ul>
            <button class="px-6 py-3 mt-4 text-primary-500 border-2 border-primary-500 rounded hover:bg-primary-500 hover:text-white transition-all max-md:self-start">
                Request More Information
            </button>
        </div>
    </div>
</section>
<section class="mx-4 sm:mx-8 md:mx-10">
<hr class="self-center mt-20 h-px w-full border border-black border-opacity-40 max-md:mt-10" />
</section>
<section class="flex flex-col items-start px-4 sm:px-8 md:px-12 py-6 mt-16 max-w-full w-full max-md:px-2 max-md:mt-10">
<h2 class="text-heading font-semibold text-lg font-worksans text-primary-500 ml-3">Contact Our Team</h2>
<fieldset class="mb-8">
        <legend class="mt-8 ml-2.5 text-lg leading-relaxed font-semibold text-heading font-worksans max-md:ml-1.5 text-4s text-primary-500">Select all that apply</legend>
        <div class="flex flex-col gap-4 mt-4 ml-2.5 text-lg leading-relaxed text-content font-montserrat max-md:ml-1.5 text-4s">
            {#each Object.keys(selectedOptions) as option}
                <div class="flex items-center gap-3">
                    <input type="checkbox" id={option} class="sr-only" 
                            checked={selectedOptions[option]} 
                            on:change={() => handleOptionChange(option)} />
                    <label for={option} class="flex items-center cursor-pointer">
                        <Icon icon={selectedOptions[option] ? "ci:checkbox-checked" : "ci:checkbox-unchecked"} alt="" class="w-5 h-5 object-contain shrink-0 text-primary-500" />
                        <span class="ml-2">
                            {option === 'existing-connection' ? "I have a question about an existing B2B connection." :
                            option === 'more-info' ? "I would like more information about B2B solutions" :
                            option === 'setup-connection' ? "I would like to be contacted about setting up a B2B connection" :
                            option === 'existing-organization' ? "I would like to know if there is an existing B2B connection for my organization" :
                            "I have another question (fill in below)"}
                        </span>
                    </label>
                </div>
            {/each}
        </div>
    </fieldset>
<form method="POST" action="?/contactus" class="w-full mt-3 max-w-3xl ml-3" use:enhance={() => {
    return async({ result }) => {
    let message1 = '';
    let keywordError = '';
    console.log(result); 
    keywordError = result.data.type;
    if (keywordError === "success") {
        message1 = result.data.data.message; 
        console.log(message1);
        resetForm();
    }
    else if (keywordError === "error") {
        message1 = result.data.data.error; 
        console.log(message1);
    }
    showMessage(message1, keywordError);
    };
}}>
    <div class="mt-3">
        {#if errorMessage === "success"}
            <div class="text-center bg-green-100 text-green-700 py-2 mb-4 rounded-md">
                {successMessage}
            </div>
            {:else if errorMessage === 'error'}
                <div class="text-center bg-red-100 text-red-700 py-2 mb-4 rounded-md">
                    {successMessage}
                </div>
            {/if}
            </div>
                <div class="w-full mt-3 max-w-full sm:max-w-lg md:max-w-3xl overflow-hidden">
                    <div class="flex flex-col md:flex-row md:space-x-4">
                        <div class="flex-1 mb-4 w-5/6 sm:w-full">
                            <input type="text" name="fname" id="fname" bind:value={fname} class="flex w-full border border-gray-300 p-3 focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="First Name*" />
                            {#if showErrors && fname.length === 0}
                                <span class="text-red-400 text-xs">First Name is required</span>
                            {/if}
                            {#if fname.length > 0 && !/^[A-Za-z\s]+$/.test(fname)}
                                <span class="text-red-400 text-xs">First Name cannot contain numbers or special characters</span>
                            {/if}
                            </div>
                            <div class="flex-1 mb-4 w-5/6 sm:w-full" >
                                <input type="text" name="lname" id="lname" bind:value={lname} class="flex w-full border border-gray-300 p-3 focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Last Name*" />
                                {#if showErrors && lname.length === 0}
                                    <span class="text-red-400 text-xs">Last Name is required</span>
                                {/if}
                                {#if lname.length > 0 && !/^[A-Za-z\s]+$/.test(lname)}
                                    <span class="text-red-400 text-xs">Last Name cannot contain numbers or special characters</span>
                                {/if}
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row md:space-x-4">
                        <div class="flex-1 mb-4 w-5/6 sm:w-full" >
                                <input type="text" name="email" id="email" bind:value={email} class="block w-full border border-gray-300 p-3  focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Business Email Address*" />
                                {#if showErrors && email.length === 0}
                                    <span class="text-red-400 text-xs">Email is required</span>
                                {/if}
                                {#if email.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)}
                                    <span class="text-red-400 text-xs">Please enter a valid email address.</span>
                                {/if}
                            </div>
                            <div class="flex-1 mb-4 w-5/6 sm:w-full" >
                                <input type="tel" name="number" id="number" bind:value={number} class="block w-full border border-gray-300 p-3  focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Business Phone*" />
                                {#if showErrors && number.length === 0}
                                    <span class="text-red-400 text-xs">Number is required</span>
                                {/if}
                                {#if number.length > 0 && !/^\+?[0-9]{10}$/.test(number)}
                                    <span class="text-red-400 text-xs">Please enter a valid number number.</span>
                                {/if}
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row md:space-x-4">
                            <div class="flex-1 mb-4 w-5/6 sm:w-full" >
                                <input type="text" name="company" id="company" bind:value={company} class="block w-full border border-gray-300 p-3  focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Company*" />
                                {#if showErrors && company.length === 0}
                                    <span class="text-red-400 text-xs">Company Name is required</span>
                                {/if}
                            </div>
                                <div class="flex-1 mb-4 w-5/6 sm:w-full" >
                                <input type="text" name="role" id="role" bind:value={role} class="block w-full border border-gray-300 p-3  focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Role*" />
                                {#if showErrors && role.length === 0}
                                    <span class="text-red-400 text-xs">Role is required</span>
                                {/if}
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row md:space-x-4">
                            <div class="flex-1 mb-4 w-5/6 sm:w-full" >
                                <select id="location" name="location" required
                                class="block w-full border border-gray-300 p-3 focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400"style="background-color: white;">
                                    <option value="" disabled selected>Select your location*</option>
                                        {#each locations as location}
                                    <option value={location}>{location}</option>
                                        {/each}
                                </select>
                            </div>
                            <div class="flex-1 mb-4 w-5/6" >
                            </div>                                    


                        </div>                                    
                        <div class="flex-1 mb-4 w-5/6 sm:w-full">
                            <textarea name="details" id="details" bind:value={details} class="w-full p-3 border border-gray-300  focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400 mb-4 h-32" placeholder="Additional Details*"></textarea>
                            {#if showErrors && details.length === 0}
                                <span class="text-red-400 text-xs">Additional Details is required</span>
                            {/if}
                        </div>
                        <div class="flex-1 mb-4 sm:mt-0">
                            <button type="submit" on:click={handleSubmit} class="px-5 py-2 bg-primary-500 text-white rounded-lg transition duration-300 hover:bg-primary-300 sm:w-auto">Send Message</button>
                        </div>
                </div>
        </form>
</section>