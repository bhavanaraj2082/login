<script>
    import Icon from '@iconify/svelte';
    import { enhance } from '$app/forms';

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
  </script>
  
  <header class="flex gap-2.5 justify-left items-center px-4 ml-5 max-md:ml-2.5 max-md:justify-start mt-5">
    <Icon icon="tabler:home" class="w-7 h-8 text-primary-500" />

    <nav class="flex gap-2 justify-center items-center text-lg font-semibold">
      <a href="/" class="hover:text-primary-600 text-primary-400">Home</a>
      <Icon icon="ic:outline-greater-than" class="w-7 h-8 text-primary-500" />
      <a href="/chemikart-solutions" class="hover:text-primary-600 text-primary-500">Chemikart Solutions</a>
    </nav>
  </header>
  
    <section class="mt-16 px-5 max-md:mt-10">
        <p class="text-base leading-6 text-content mx-auto text-justify-center ml-10 mr-10 font-montserrat">
          We offer a full range of e-Commerce tools designed to enable greater spend control for your procurement staff, providing your researchers with ease of access to the products they've come to rely on.
        </p>
        <br />
        <p class="text-base leading-6 text-content mx-auto text-justify-center ml-10 mr-10 font-montserrat">
          We have three solutions available to help you save time and cost in procurement management. Read further for more details of each solution, or fill out our contact form and our team will reach out to you to answer any questions.
        </p>      
      
        <div class="mt-12 max-w-7xl mx-auto">
          <div class="flex gap-5 max-md:flex-col">
            <div class="w-3/5 max-md:w-full">
              <div class="space-y-12 max-md:space-y-10">
                <div class="flex items-start gap-4">
                  <Icon icon="game-icons:on-target" class="w-12 h-12 text-primary-500 flex-shrink-0" />
                  <div class="flex-auto">
                    <h2 class="text-heading font-semibold text-lg font-worksans">The One-to-One Solution: E-Procurement</h2>
                    <p class="text-content font-montserrat">e-Procurement provides seamless system-to-system connectivity of your existing spend management system.</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <Icon icon="mdi:family-tree" class="w-12 h-12 text-primary-500 flex-shrink-0" />
                  <div class="flex-auto">
                    <h2 class="text-heading font-semibold text-lg font-worksans">The Customized Solution: Pipeline®</h2>
                    <p class="text-content font-montserrat">This customized service balances your organization's business needs with the product requirements of your researchers.</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <Icon icon="fluent-mdl2:text-document-shared" class="w-12 h-12 text-primary-500 flex-shrink-0" />
                  <div class="flex-auto">
                    <h2 class="text-heading font-semibold text-lg font-worksans">The Simple Solution: Chemikart E-Shop</h2>
                    <p class="text-content font-montserrat">Your procurement staff can access our products simply, easily, and securely through chemikart.com.</p>
                  </div>
                </div>
              </div>
            </div>
      
            <aside class="w-2/5 max-md:w-full">
              <div class="flex flex-col items-start space-y-5 text-black">
                <Icon icon="game-icons:chemical-drop" class="w-20 h-24 text-primary-500" />
                <p class="text-content font-montserrat">Discover our latest website features and enhance your experience with Chemikart.</p>
                <p class="text-content font-montserrat">Find information regarding new features as well as tips and tricks with Get Site Smart.</p>
      
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
                <h3 class="text-heading font-semibold text-lg font-worksans mt-8">The One-to-One Solution: E-Procurement</h3>
                <p class="mt-4 text-base text-content font-montserrat">
                    Chemikart is your source for procurement optimization. If you are already using an electronic spend management solution, leverage your investment to generate even greater savings by automating Chemikart's purchases and link your current buying platform to us.
                </p>
                <p class="mt-4 text-base text-content font-montserrat">
                    We support all major e-Procurement providers and have a dedicated technical team available to work with your organization or platform provider and install customized, scalable, all-in-one procurement solutions. e-Procurement offers efficiencies across the purchasing cycle, enabling product selection through e-Catalogs, both punchout or hosted file, accepting e-Purchase orders, sending electronic invoices, order confirmations, and advanced shipping notices, and more.
                </p>

                <h4 class="mt-6 text-heading font-semibold text-lg font-worksans">Three Steps to Install e-Procurement</h4>
                <ol class="list-decimal list-inside mt-4 space-y-3 text-base text-content font-montserrat">
                    <li>Create a Project Plan: We will partner with you to gather requirements, provide detailed analysis, then implement a project plan with milestones.</li>
                    <li>Setup & Testing: We will work through setup and testing to ensure end-to-end processes are in place.</li>
                    <li>Launch and Go-Live Monitoring: After testing, we provide post-go-live monitoring to ensure the solution meets your expectations.</li>
                </ol>
            </div>
        </div>

        <div class="flex flex-col w-[35%] max-md:w-full max-md:mt-6">
            <h3 class="text-heading font-semibold text-lg font-worksans mt-8">Benefits to e-Procurement</h3>
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
            <h3 class="text-heading font-semibold text-lg font-worksans mt-8">The Customized Solution: Pipeline®</h3>
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
            <h4 class="text-heading font-semibold text-lg font-worksans mt-8">Benefits of PIPELINE®</h4>
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
            <h3 class="text-heading font-semibold text-lg font-worksans mt-8">The Simple Solution: Chemikart E-Shop</h3>
            <p class="mt-4 text-base text-content font-montserrat">
                Your online order is integrated with our fulfillment systems, allowing for rapid processing. You can request quotes, place orders, and track deliveries all in one place.
            </p>
            <p class="mt-4 text-base text-content font-montserrat">
                With Chemikart.com as the leading Web site in the industry, you can rest assured you're getting the most competitive service available.
            </p>
        </div>

        <div class="flex flex-col w-[35%] max-md:w-full max-md:mt-6">
            <h4 class="text-heading font-semibold text-lg font-worksans mt-8">Benefits of the Chemikart e-Shop:</h4>
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

<section class="flex flex-col items-start px-4 sm:px-8 md:px-12 py-6 mt-16 max-w-full bg-gray-100 w-full max-md:px-2 max-md:mt-10">
  <h2 class="text-heading font-semibold text-lg font-worksans">Contact Our Team</h2>

  <form class="w-full mt-12 max-w-3xl" use:enhance={()=>{
    return async ({result})=>{
      console.log("result",result)
    }}} action="?/upload" method="POST">
      <fieldset class="mb-8">
          <legend class="mt-8 ml-2.5 text-lg leading-relaxed font-semibold text-heading font-worksans max-md:ml-1.5 text-4s">Select all that apply</legend>

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

      <div class="flex flex-col mt-8 w-full max-w-full">
          <div class="flex flex-wrap gap-6 mb-6">
              <div class="w-full md:w-[48%]">
                  <label for="firstName" class="sr-only">First Name</label>
                  <input type="text" id="firstName" name="firstName" placeholder="First Name*" required
                      class="w-full py-3 px-4 rounded border border-solid border-gray-300 text-lg font-montserrat text-content text-4s" /> 
              </div>
              <div class="w-full md:w-[48%]">
                  <label for="lastName" class="sr-only">Last Name</label>
                  <input type="text" id="lastName" name="lastName" placeholder="Last Name*" required
                      class="w-full py-3 px-4 rounded border border-solid border-gray-300 text-lg font-montserrat text-content text-4s" /> 
              </div>
          </div>

          <div class="flex flex-wrap gap-6 mb-6">
              <div class="w-full md:w-[48%]">
                  <label for="email" class="sr-only">Business Email Address</label>
                  <input type="email" id="email" name="email" placeholder="Business Email Address*" required
                      class="w-full py-3 px-4 rounded border border-solid border-gray-300 text-lg font-montserrat text-content text-4s" /> 
              </div>
              <div class="w-full md:w-[48%]">
                  <label for="phone" class="sr-only">Business Phone</label>
                  <input type="tel" id="phone" name="phone" placeholder="Business Phone"
                      class="w-full py-3 px-4 rounded border border-solid border-gray-300 text-lg font-montserrat text-content text-4s" /> 
              </div>
          </div>

          <div class="flex flex-wrap gap-6 mb-6">
              <div class="w-full md:w-[48%]">
                  <label for="company" class="sr-only">Company</label>
                  <input type="text" id="company" name="company" placeholder="Company*" required
                      class="w-full py-3 px-4 rounded border border-solid border-gray-300 text-lg font-montserrat text-content text-4s" /> 
              </div>
              <div class="w-full md:w-[48%]">
                  <label for="role" class="sr-only">Role</label>
                  <input type="text" id="role" name="role" placeholder="Role"
                      class="w-full py-3 px-4 rounded border border-solid border-gray-300 text-lg font-montserrat text-content text-4s" /> 
              </div>
          </div>

          <div class="relative w-full md:w-[48%] mb-6">
              <label for="location" class="sr-only">Location</label>
              <select id="location" name="location" required
                  class="w-full py-3 pl-4 pr-10 rounded border border-solid border-gray-300 appearance-none bg-white text-lg font-montserrat text-content text-4s">
                  <option value="" disabled selected>Select your location*</option>
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
              </select>
              <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
              </span>
          </div>

          <div class="w-full mb-6">
              <label for="details" class="sr-only">Additional details</label>
              <textarea id="details" name="details" placeholder="Additional details"
                  class="w-full h-32 py-3 px-4 rounded border border-solid border-gray-300 resize-none text-lg font-montserrat text-content text-4s"></textarea>
          </div>

          <button type="submit" class="px-6 py-4 text-base font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-lg self-start">
              Submit
          </button>
      </div>
  </form>
</section>