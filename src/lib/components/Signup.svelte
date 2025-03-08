<script>
    let name = '';
    let email = '';
    let language = '';
    let location = '';
    let password = '';
    let confirmPassword = '';
    let passwordError = '';

    const passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%_\\-*])[A-Za-z\\d!@#$%_\\-*]{8,}$";
    const emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"; 

    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Russian'];
    const locations = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'India', 'Brazil', 'Japan'];

    async function handleSubmit(event) {
        event.preventDefault();

        if (!name || !email || !language || !location || !password || password !== confirmPassword) {
            alert('Please fill in all required fields and ensure passwords match.');
            return;
        }

        const registerData = { name, email, language, location, password };

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Account created successfully!');
                window.location.href = '/';
            } else {
                alert(data.error || data.message || 'Error creating account.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating the account.');
        }
    }

    function validatePassword() {
        const regex = new RegExp(passwordPattern);
        passwordError = regex.test(password) ? '' : '';
    }

    $: validatePassword();
</script>

<div class="flex flex-col md:flex-row justify-center items-start p-4 md:p-8 rounded-lg max-w-5xl mx-auto">
    <div class="image-container w-full md:w-1/2 flex items-center justify-center"> 
        <img src="/Signup/image.png" alt="Signup" 
             class="w-full h-[200px] md:h-[795px] object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
    </div>
    <div class="content w-full md:w-2/3 p-4 md:p-6 flex flex-col justify-center bg-white rounded-tr-lg rounded-b-lg md:rounded-l-lg md:rounded-tl-none"> 
        <h2 class="text-2xl font-bold text-orange-500">Sign Up</h2>
        <!-- <p class="text-gray-500 mb-5">Already have an account? <a href='/login' class="underline text-orange-500">Login.</a></p> -->
        <p class="text-gray-500 mb-5">Already have an account? <a href='/signin' class="underline text-orange-500">SignIn.</a></p>
    
        <form on:submit={handleSubmit}>
            <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
                <div class="flex-1 mb-2 md:mb-0">
                    <label for="name" class="block text-sm font-medium text-gray-600">Name</label>
                    <input type="text" id="name" bind:value={name} required class="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div class="flex-1 mb-2 md:mb-0">
                    <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
                    <input type="email" id="email" bind:value={email} required class="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                           pattern={emailPattern} title="Please enter a valid email address." />
                    {#if !new RegExp(emailPattern).test(email) && email}
                        <div class="text-red-500 text-xs mt-1">Please enter a valid email address.</div>
                    {/if}
                </div>
            </div>
            <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
                <div class="flex-1 mb-2 md:mb-0">
                    <label for="language" class="block text-sm font-medium text-gray-600">Language</label>
                    <select id="language" bind:value={language} required class="mt-1 block text-gray-500 w-full p-2 border border-gray-300 rounded-md">
                        <option value="" disabled>Select your language</option>
                        {#each languages as lang}
                            <option value={lang}>{lang}</option>
                        {/each}
                    </select>
                </div>
                <div class="flex-1 mb-2 md:mb-0">
                    <label for="location" class="block text-sm font-medium text-gray-600">Location</label>
                    <select id="location" bind:value={location} required class="mt-1 block w-full p-2 text-gray-500 border border-gray-300 rounded-md">
                        <option value="" disabled>Select your location</option>
                        {#each locations as loc}
                            <option value={loc}>{loc}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-600">Create Password</label>
                <input id="password" bind:value={password} required class="mt-1 block w-full p-2 border border-gray-300 rounded-md" type="password" on:blur={validatePassword} />
                {#if passwordError}
                    <div class="text-red-500 text-xs mt-1">{passwordError}</div>
                {/if}
                <div class="text-gray-400 text-sm">
                    <p>*Contain at least 8 Characters</p>
                    <p>*Cannot contain common or guessable text</p>
                    <p>*Contain at least one number</p>
                    <p>*Contain one of the following special characters !@#$%_-*</p>
                </div>
            </div>

            <div class="mb-6">
                <label for="confirm-password" class="block text-sm font-medium text-gray-600">Confirm Password</label>
                <input id="confirm-password" bind:value={confirmPassword} required class="mt-1 block w-full p-2 border border-gray-300 rounded-md" type="password" />
            </div>

            <div class="mb-4">
                <div class="text-orange-500 font-semibold">TERMS AND CONDITION:</div>
                <p class="text-gray-500 text-sm">We will occasionally contact you with relevant updates about your account and our products and services. You may manage your account preferences in your account or unsubscribe at any time. We are committed to protecting the privacy of your personal data.</p>
            </div>

            <div class="mb-4">
                <label>
                    <input type="checkbox" required />
                    <a class="text-orange-500">I have read and agreed to the Terms of Service and Privacy Policy</a>
                </label>
            </div>
            <div class="mb-4 hidden md:block text-gray-500">
                <div class="flex flex-col md:flex-row items-start">
                    <div class="font-semibold underline text-lg">Note:</div>
                    <div class="text-sm mt-1 md:mt-0 md:ml-2">
                        <p class="whitespace-normal max-w-full">
                            You can withdraw our consent at any time by clicking the unsubscribe link contained in every email or by sending an email to 
                            <a href="mailto:privacy@chemikartgroup.com" class="text-orange-500 underline">privacy@chemikartgroup.com</a>. 
                            Detailed information is available in our 
                            <a href="/privacy" class="text-orange-500 underline">Privacy Statement</a>.
                        </p>
                    </div>
                </div>
            </div>

            <div class="mb-4 md:hidden text-sm text-gray-500">
                <p class="whitespace-normal max-w-full">
                    Need to change your mind? Just hit unsubscribe in any email or email us at 
                    <a href="mailto:privacy@chemikartgroup.com" class="text-orange-500 underline">privacy@chemikartgroup.com</a>.
                </p>
            </div>

            <button type="submit" class="w-full bg-orange-500 text-white py-2 rounded-md text-xl hover:bg-orange-800">Create Account</button>
        </form>
    </div>
</div>
