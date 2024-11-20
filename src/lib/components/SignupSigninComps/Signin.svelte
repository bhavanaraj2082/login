<script>
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';
    let showPassword = false;
    let errorMessage = '';
    let errorStatus = '';
    let successMessage = '';
    let formSubmitted = false;

    function redirectToProfile() {
    setTimeout(() => {
      goto('/profile'); 
    }, 10);
  }

    $: if (errorStatus === "success") {
    redirectToProfile();
  }

    function resetForm() {
        email = '';
        password = '';
        formSubmitted = false;
    }

        // // Set cookie using js-cookie
        // function setCookie(name, value, days) {
        // Cookies.set(name, value, { expires: days, sameSite: 'Lax' });
        // console.log(`Cookie set: ${name}=${value}; Expires in: ${days} days`);
        // }
</script>

<div class="flex flex-col md:flex-row max-w-3xl shadow-lg rounded-lg mx-auto h-screen md:h-auto my-14 border border-gray-200">
    <div class="md:hidden w-full h-1/2 mx-auto flex justify-center"> 
        <img src="/image-1.png" alt="Sign In" class="object-cover w-full h-full rounded" />
    </div>

    <div class="flex flex-col items-center w-full md:w-1/2 rounded-l md:rounded-l-lg p-8 bg-white">
        <div class="w-full mx-auto">
            <h1 class="text-2xl font-bold text-primary-500 mb-4">Sign In</h1>
            <p class="mb-4 text-gray-600">
                Do not have an account? <a href="/register" class="text-primary-500 hover:text-primary-600 underline">Create a new one</a>
            </p>
            
            {#if errorStatus === "success"}
            <div class="border border-green-400 p-3 w-auto text-sm text-gray-600 font-medium rounded my-6"><i class="fa-solid fa-circle-check text-green-400 mr-1"></i>{errorMessage}</div>
        {/if}
        {#if errorStatus === "error"}
            <div class="border border-red-400 p-3 w-auto text-sm text-gray-600 font-medium rounded my-6">{errorMessage}</div>
        {/if}
            <form action="?/login" method="POST" 
            use:enhance={() => {
                return async ({ result }) => {
                    console.log(result);
                    if(result.type === "success"){
                    console.log(result.data.type);
                    console.log(result.data.message);
                    errorStatus = result.data.type;
                    errorMessage = result.data.message;

                        if(result.data.type === "success"){
                            formSubmitted=true;
                            // console.log(result.data.message);
                            // setCookie("Username_or_Email", email, 7);
                            resetForm();
                         }
                    }
                };
            }}
            >
                <label for="email" class="mb-2 text-gray-600">Enter your email or username</label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    bind:value={email}
                    placeholder="username@example.com"
                    class="border border-gray-300 rounded p-2 mb-4 w-full"
                    required
                />

                <label for="password" class="mb-2 text-gray-600">Enter your password</label>
                <div class="relative mb-4">

                        <input
                        name="password"
                            type="password"
                            id="password"
                            bind:value={password}
                            placeholder="*******"
                            class="border border-gray-300 rounded p-2 w-full"
                            required
                        />

                </div>

                <p class="mb-4">
                    <a href="/reset-password" class="text-primary-400 hover:text-primary-500 underline">Forgot password?</a>
                </p>

                <button class="bg-primary-400 text-white rounded p-2 w-full text-center">
                    Login
                </button>
            </form>


        </div>
    </div>

    <div class="hidden md:flex md:w-1/2 flex-grow">
        <img src="/image-1.png" alt="Sign In" class="object-cover w-full h-full rounded-r-lg" /> 
    </div>
</div>