<script>
    import { enhance } from '$app/forms';
    import { toast } from 'svelte-sonner';

    let username = '';
    let email = '';
    let language = '';
    let location = '';
    let password = '';
    let passwordConfirm = '';
    let errors = {}

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%_\-*])[A-Za-z\d!@#$%_\-*]{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameRegex = /^[A-Za-z]+$/;

    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Russian'];
    const locations = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'India', 'Brazil', 'Japan'];

    function validateForm() {
        errors={}
        // const usernameRegex = new RegExp(usernamePattern);
        if (!username || !usernameRegex.test(username)) errors.username = 'Please enter a valid username';
        if (!email || !emailRegex.test(email)) errors.email = 'Please enter a valid email address.';
        if (!language) errors.language = 'Please select a language.';
        if (!location) errors.location = 'Please select a location.';
        if (!password) errors.password = 'Password is required.';
        if (!passwordRegex.test(password)) errors.password = 'Password must contain at least 8 characters, one number, and one special character.';
        if (!passwordConfirm) errors.passwordConfirm = 'Please confirm your password.';
        if (passwordConfirm !== password) errors.passwordConfirm = 'Passwords do not match.';
         console.log('form errors',errors);
        if(Object.keys(errors).length >0){
            return false
        }else{
            return true
        } 
    }

    async function handleFormSubmission({cancel}) {
        if(!validateForm()){
            cancel()
        }
        return async({result,update})=>{
            console.log("result",result);
            if(result.type === "success"){
                if(result.data.success){
                    await update()
					toast.success('',{description:result.data.message})
				}else{
					toast.error('',{description:result.data.message})
				}
            }
        }
        
    }
</script>
<div class="flex flex-col w-11/12 md:flex-row justify-center items-start shadow-md my-12 rounded-lg max-w-5xl bg-white mx-auto">
    <div class="image-container w-full md:w-1/2 flex items-center justify-center">
        <img src="/image.png" alt="Signup" class="w-full h-[200px] md:h-[835px] object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
    </div>

    <div class="content w-full md:w-2/3 p-4 md:p-6 flex flex-col justify-center rounded-tr-lg rounded-b-lg md:rounded-l-lg md:rounded-tl-none">
        <h2 class="text-2xl font-bold text-primary-500">Sign Up</h2>
        <p class="text-gray-500 mb-5">Already have an account? <a href='/login' class="underline text-primary-500">Login.</a></p>
        
        <form 
        method="POST" action="?/register"
         use:enhance={handleFormSubmission}>
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

            <div class="mb-4 flex gap-2">
                <input type="checkbox" name="termsAndConditions" required value={true} class="mt-0.5 text-primary-500 focus:ring-0" />
                <!-- svelte-ignore a11y-missing-attribute -->
                <div class=" text-sm">I have read and agreed to the 
                    <a class=" font-medium text-primary-500 hover:underline" href="/terms/site-and-terms"> Terms of Service </a> and 
                    <a class=" font-medium text-primary-500 hover:underline" href="/terms/privacy-notice">Privacy Policy</a>
                </div>
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