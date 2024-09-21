<script>
  let showLoginForm = true; 
  function toggleForms() {
    showLoginForm = !showLoginForm; 
  }
  function getButtonClass(isActive) {
    return isActive ? 'bg-white' : 'bg-gray-100';
  }
  let password = '';
  let passwordError = '';
  function validatePassword() {
    const valid = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
    passwordError = valid ? '' : 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
  }
</script>
<div class="bg-gray-100">
  <div class="min-h-screen flex flex-col items-center justify-center">
    <div class="w-full max-w-4xl p-6 mr-10">
      <div class="flex justify-between mb-0">
        <button class={`text-xl font-bold px-12 py-6 duration-200 focus:outline-none ${getButtonClass(showLoginForm)}`} 
        on:click={() => { showLoginForm = true; }}>Login to your account</button>
        <button class={`text-xl font-bold px-12 py-6 duration-200 focus:outline-none ${getButtonClass(!showLoginForm)}`} 
        on:click={() => { showLoginForm = false; }}>Create an account</button>
      </div>
      <div class="w-full max-w-4xl bg-white p-6 shadow-lg">
        {#if showLoginForm}
        <div id="login-form" class="form-box"> 
          <form method="post" action="?/createLogin">
            <div class="mb-4">
              <label for="email" class="block text-sm font-semibold mb-1.5 mt-5">Email</label>
              <input type="email" id="email" class="w-full p-2 border border-gray-300 rounded-md" required name="email" />
            </div>
            <div class="mb-4">
              <label for="password" class="block text-sm font-semibold mb-1.5 mt-5">Password</label>
              <input type="password" id="password" class="w-full p-2 border border-gray-300 rounded-md" required name="password" />
            </div>
            <div class="text-blue-500 text-sm mb-5 font-bold">
              <a href="/forgot-password">Forgotten password?</a>
            </div>
            <button type="submit" class="w-full p-2 bg-blue-500 text-white font-normal rounded-md">Login</button>
            <div class="text-sm font-normal text-center mt-5">
              <span class="text-[#666]">Don't have an account?</span>
              <span>
                <button class="text-blue-500 text-sm mb-5 font-bold" on:click={toggleForms}>Create an account</button>
              </span>
            </div>
          </form>
        </div>
        {:else}
        <div id="register-form" class="form-box"> 
          <h2 class="text-xl font-bold">Your Details</h2>
          <form method="post" action="?/createAccount">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label for="title" class="block text-sm font-normal mb-1.5 mt-5">Title</label>
                <select id="title" class="w-full p-2 border border-gray-300 rounded-md" required name="title">
                  <option value="" selected disabled hidden></option>
                  {#each ['Dr','Miss','Mr','Mrs','Ms','Mx','Prof'] as c}
                    <option value={c}>{c}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label for="fname" class="block text-sm font-normal mb-1.5 mt-5">First Name *</label>
                <input type="text" id="first-name" class="w-full p-2 border border-gray-300 rounded-md" required name="fname" />
              </div>
              <div class="col-span-2 md:col-span-1">
                <label for="lname" class="block text-sm font-normal mb-1.5 mt-5">Last Name *</label>
                <input type="text" id="last-name" class="w-full p-2 border border-gray-300 rounded-md" required name="lname" />
              </div>
            </div>
            <div>
              <label for="email" class="block text-sm font-normal mb-1.5 mt-5">Email *</label>
              <input type="email" id="email" class="w-full p-2 border border-gray-300 rounded-md" required name="email" />
            </div>
            <div class="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="titles" class="block text-sm font-normal mb-1.5 mt-5 ">Phone Number *</label>
                <select id="titles" class="w-full p-2 border border-gray-300 rounded-md" required name="titles">
                  <option value="" selected disabled hidden></option>
                  {#each ['+1 (United States)', '+1 (Canada)', '+91 (India)', '+44 (United Kingdom)', '+61 (Australia)',
                  '+49 (Germany)', '+33 (France)', '+86 (China)', '+27 (South Africa)', 
                  '+39 (Italy)'] as c}
                    <option value={c}>{c}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label for="phone" class="block text-sm font-normal mb-1.5 mt-5">&nbsp;</label>
                <input type="number" id="phone" class="w-full p-2 border border-gray-300 rounded-md" required name="phone" />
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="countryregistration" class="block text-sm font-normal mb-1.5 mt-5">Country of Registration *</label>
                <select id="countryregistration" class="w-full p-2 border border-gray-300 rounded-md"  required name="countryregistration">
                  <option value="" selected disabled hidden>Please select</option>
                  {#each ['United States', 'Canada', 'India', 'United Kingdom', 'Australia', 'Germany', 'France','China', 
                  'South Africa', 'Italy'] as c}
                    <option value={c}>{c}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label for="state" class="block text-sm font-normal mb-1.5 mt-5">State</label>
                <input type="text" id="state" class="w-full p-2 border border-gray-300 rounded-md" required name="state"/>
              </div>
            </div>
            <div>
              <label for="organisation" class="block text-sm font-normal mb-1.5 mt-5">Organisation Name *</label>
              <input type="text" id="organisation" class="w-full p-2 border border-gray-300 rounded-md" required name="organisation"/>
            </div>
            <div>
              <label for="jobtitle" class="block text-sm font-normal mb-1.5 mt-5">Job Title</label>
              <input type="text" id="jobtitle" class="w-full p-2 border border-gray-300 rounded-md" required name="jobtitle" />
            </div>
            <div>
              <label for="primaryfield" class="block text-sm font-normal mb-1.5 mt-5">Primary Field of Interest *</label>
              <select id="primaryfield" class="w-full p-2 border border-gray-300 rounded-md" required name="primaryfield">
                <option value="" selected disabled hidden >Please select</option>
                {#each ['Agbio - Plant Biotechnology Research', 'Cannabis Manufacturing', 'Cannabis Reference Materials', 
                'Cell Biology and Microorganism Materials', 'Diagnostics Research', 
                'Drug Discovery and Development', 'Environment Reference Materials', 'Food & Beverage Reference Materials', 
                'Forensic Reference Materials', 'Metal Reference Materials', 
                'Petroleum and Oils Reference Materials', 'Pharmaceutical Manufacturing', 'Pharmaceutical Reference Materials', 
                'Proficiency Testing', 'Research Chemicals and Analytical Standards'] as c}
                  <option value={c}>{c}</option>
                {/each}
              </select>
            </div>
            <div>
              <label for="role" class="block text-sm font-normal mb-1.5 mt-5">What Best Describes Your Role? *</label>
              <select id="role" class="w-full p-2 border border-gray-300 rounded-md" required name="role">
                <option value="" selected disabled hidden>Please select</option>
                {#each ['I am a researcher working in academia', 'I am a researcher working in industry', 'I manage a laboratory',
                'I work for an authorised TRC/LGC distributor', 'I work in a laboratory',
                'I work in procurement/finance', 'I work in quality control', 'Other'] as c}
                  <option value={c}>{c}</option>
                {/each}
              </select>
            </div>
            <div>
              <label for="password" class="block text-sm font-normal mb-1.5 mt-5">Create a Password * (at least 8 characters, with uppercase, lowercase, numbers, and special characters)</label>
              <input type="password" id="password" class="w-full p-2 border border-gray-300 rounded-md" 
                bind:value={password} 
                on:input={validatePassword} 
                required />
              {#if passwordError}
                <p class="text-red-600 text-sm">{passwordError}</p>
              {/if}
            </div>
            <div>
              <label for="confirmpassword" class="block text-sm font-normal mb-1.5 mt-5">Confirm Your Password *</label>
              <input type="password" id="confirmpassword" class="w-full p-2 border border-gray-300 rounded-md" 
              required name="confirmpassword" />
            </div>
            <p class="text-sm mb-4 mt-5">
              Your new password will need to:
              <br /> <br />
              • be at least 8 characters long
              <br /><br />
              • contain a mixture of upper and lower case characters
              <br /><br />
              • contain at least one number
              <br /><br />
              • contain at least one of the following special characters !@#_-.%$*+|
            </p>
            <div class="mb-4">
              <input type="checkbox" id="terms" required />
              <label for="terms" class="text-sm font-normal">By creating an account you agree to our Terms and Conditions</label>
            </div>
            <p class="text-lg mb-4">
              We will occasionally contact you with relevant updates about your account and our products and services. 
              You may manage your contact preferences
              in your account or unsubscribe at any time. We are committed to protecting the privacy of your personal data. 
              Please see our <a href="##" class="text-blue-600">Privacy Policy</a> for further details.
            </p>
            <button type="submit" class="w-full p-3 bg-blue-500 text-white font-bold rounded-md">Submit →</button>
          </form>
        </div>
        {/if}
      </div>
    </div>
  </div>
</div>
