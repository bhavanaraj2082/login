<script>
    import { enhance } from '$app/forms';
    let errorMessage="";
    let username = '';
    let email = '';
    let language = '';
    let location = '';
    let password = '';
    let passwordConfirm = '';
    let errorStatus = '';
    let formSubmitted = false;
    let errors = {
        username: '',
        email: '',
        language: '',
        location: '',
        password: '',
        passwordConfirm: ''
    };

    const passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%_\\-*])[A-Za-z\\d!@#$%_\\-*]{8,}$";
    const emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$";
    const usernamePattern = "^[A-Za-z]+$";

    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Russian'];
    const locations = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'India', 'Brazil', 'Japan'];

    function resetForm() {
        username = '';
        email = '';
        language = '';
        location = '';
        password = '';
        passwordConfirm = '';
        // Reset errors
        errors = {
            username: '',
            email: '',
            language: '',
            location: '',
            password: '',
            passwordConfirm: ''
        };
    }

    function validateForm() {
        let isValid = true;

        // const usernameRegex = new RegExp(usernamePattern);
        if (!username) {
            errors.username = 'Leave empty to auto generate..';
            isValid = false;
        } else {
            errors.username = '';
        }

        const emailRegex = new RegExp(emailPattern);
        if (!email) {
            errors.email = 'Please enter a valid email address.';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            errors.email = 'Please enter a valid email address.';
            isValid = false;
        } else {
            errors.email = '';
        }

        if (!language) {
            errors.language = 'Please select a language.';
            isValid = false;
        } else {
            errors.language = '';
        }

        if (!location) {
            errors.location = 'Please select a location.';
            isValid = false;
        } else {
            errors.location = '';
        }

        const passwordRegex = new RegExp(passwordPattern);
        if (!password) {
            errors.password = 'Password is required.';
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            errors.password = 'Password must contain at least 8 characters, one number, and one special character.';
            isValid = false;
        } else {
            errors.password = '';
        }

        if (!passwordConfirm) {
            errors.passwordConfirm = 'Please confirm your password.';
            isValid = false;
        } else if (passwordConfirm !== password) {
            errors.passwordConfirm = 'Passwords do not match.';
            isValid = false;
        } else {
            errors.passwordConfirm = '';
        }

        return isValid; 
    }

    async function handleFormSubmission(data) {
        console.log('Data to be inserted:', data);
        // return Promise.resolve({ type: 'success', data: { message: '' } });
    }
</script>

<div class="flex flex-col md:flex-row justify-center items-start shadow-md my-12 rounded-lg max-w-5xl mx-auto border border-gray-200">
    <div class="image-container w-full md:w-1/2 flex items-center justify-center">
        <img src="/image.png" alt="Signup" class="w-full h-[200px] md:h-[835px] object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
    </div>

    <div class="content w-full md:w-2/3 p-4 md:p-6 flex flex-col justify-center bg-white rounded-tr-lg rounded-b-lg md:rounded-l-lg md:rounded-tl-none">
        <h2 class="text-2xl font-bold text-primary-500">Sign Up</h2>
        <p class="text-gray-500 mb-5">Already have an account? <a href='/login' class="underline text-primary-500">Login.</a></p>
        
        {#if errorStatus === "success"}
        <div class="border border-green-400 p-3 w-auto text-sm text-gray-600 font-medium rounded my-6"><i class="fa-solid fa-circle-check text-green-400 mr-1"></i>{errorMessage}</div>
    {/if}
    {#if errorStatus === "error"}
        <div class="border border-red-400 p-3 w-auto text-sm text-gray-600 font-medium rounded my-6">{errorMessage}</div>
    {/if}
        
        <form method="POST" action="?/register" 
        use:enhance={() => {
            return async ({ result }) => {
                console.log(result);
                if(validateForm()){
                    if (result.data.type === "success") {
                       await handleFormSubmission({
                            username,
                            email,
                            language,
                            location,
                            password,
                            passwordConfirm
                        });
                        errorStatus = result.data.type;
                        errorMessage =  result.data.message;
                        console.log(result.data.message);   
                        if(result.data.type === "success"){
                            errorStatus = result.data.type;
                            formSubmitted = true;  
                            resetForm();  
                        }                     
                    } else {
                    console.error(result.data.message);
                    errorStatus = result.data.type;
                    errorMessage =  result.data.message;
                    formSubmitted = false;
                    }
                } 
            };
        }}
        >
            <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
                <div class="flex-1 mb-2 md:mb-0">
                    <label for="username" class="block text-sm font-medium text-gray-600">Username</label>
                    <input type="text" id="username" name="username" bind:value={username} placeholder="Enter your username" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300" />
                    {#if errors.username}
                        <div class="text-red-500 text-xs mt-1">{errors.username}</div>
                    {/if}
                </div>
                <div class="flex-1 mb-2 md:mb-0">
                    <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
                    <input type="email" id="email" name="email" bind:value={email} placeholder="Enter your email" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300" />
                    {#if errors.email}
                        <div class="text-red-500 text-xs mt-1">{errors.email}</div>
                    {/if}
                </div>
            </div>

            <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
                <div class="flex-1 mb-2 md:mb-0">
                    <label for="language" class="block text-sm font-medium text-gray-600">Language</label>
                    <select id="language" name="language" bind:value={language} class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="" disabled selected>Select your language</option>
                        {#each languages as lang}
                            <option value={lang}>{lang}</option>
                        {/each}
                    </select>
                    {#if errors.language}
                        <div class="text-red-500 text-xs mt-1">{errors.language}</div>
                    {/if}
                </div>
                <div class="flex-1 mb-2 md:mb-0">
                    <label for="location" class="block text-sm font-medium text-gray-600">Location</label>
                    <select id="location" name="location" bind:value={location} class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="" disabled selected>Select your location</option>
                        {#each locations as loc}
                            <option value={loc}>{loc}</option>
                        {/each}
                    </select>
                    {#if errors.location}
                        <div class="text-red-500 text-xs mt-1">{errors.location}</div>
                    {/if}
                </div>
            </div>

            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
                <input type="password" id="password" name="password" bind:value={password} placeholder="Enter your password" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300" />
                {#if errors.password}
                    <div class="text-red-500 text-xs mt-1">{errors.password}</div>
                {/if}
                <div class="text-gray-400 text-sm">
                    <p>*Contain at least 8 Characters</p>
                    <p>*Cannot contain common or guessable text</p>
                    <p>*Contain at least one number</p>
                    <p>*Contain one of the following special characters !@#$%_-*</p>
                </div>
            </div>

            <div class="mb-4">
                <label for="passwordConfirm" class="block text-sm font-medium text-gray-600">Confirm Password</label>
                <input type="password" id="passwordConfirm" name="passwordConfirm" bind:value={passwordConfirm} placeholder="Confirm your password" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300" />
                {#if errors.passwordConfirm}
                    <div class="text-red-500 text-xs mt-1">{errors.passwordConfirm}</div>
                {/if}
            </div>

            <div class="mb-4">
                <div class="text-orange-500 font-semibold">TERMS AND CONDITION:</div>
                <p class="text-gray-500 text-sm">We will occasionally contact you with relevant updates about your account and our products and services. You may manage your account preferences in your account or unsubscribe at any time. We are committed to protecting the privacy of your personal data.</p>
            </div>

            <div class="mb-4">
                <label>
                    <input type="checkbox" required />
                    <!-- svelte-ignore a11y-missing-attribute -->
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

            <button type="submit" class="w-full bg-primary-400 text-white py-2 rounded-md hover:bg-primary-400 transition duration-200">Create Account</button>
        </form>
    </div>
</div>