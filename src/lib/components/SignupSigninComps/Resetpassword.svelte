<script>
    import { enhance } from '$app/forms';
    let email = "";
    let emailError = "";
    let errorStatus = "";
    let errorMessage = "";

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function handleSubmit() {
        if (!email || !validateEmail(email)) {
            emailError = "Please enter a valid email address.";
            return;
        } else {
            emailError = "";
        }
    }

</script>


<div class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="flex justify-center space-x-10">
        <!-- Step 1: Forgot Password Form -->
        <form method="POST" action="?/resetpassword"
        use:enhance={() => {
            return async ({ result }) => {
                console.log(result);
                if(result.type === "success"){
                console.log(result.data.type);
                console.log(result.data.message);
                errorStatus = result.data.type;
                errorMessage = result.data.message;
                    if(result.data.type === "success"){
                        // formSubmitted=true;
                        // console.log(result.data.message);
                        // resetForm();
                     }
                }
            };
        }}
        >
            <div class="bg-white p-8 shadow-lg rounded-lg max-w-lg">
                <h2 class="text-2xl font-bold text-center text-primary-500 mb-6">Reset Password</h2>
                <div class="flex justify-center mb-6">
                    <div class="w-1/2 flex items-center">
                        <div class="h-5 w-7 py-2 bg-primary-500 text-white text-xs rounded-full flex justify-center items-center">1</div>

                        {#if errorStatus === "success"}
                        <div class="w-full h-1 bg-primary-500"></div>
                        <div class="h-5 w-7 py-2 text-xs bg-primary-500 text-white rounded-full flex justify-center items-center">2</div>
                        {:else}
                        <div class="w-full h-1 bg-gray-300"></div>
                        <div class="h-5 w-7 py-2 text-xs bg-gray-300 text-gray-500 rounded-full flex justify-center items-center">2</div>
                        {/if}
                    </div>
                </div>
                <h3 class="text-center text-gray-600 font-semibold mb-4">Step 1</h3>
                <p class="text-gray-500 text-sm text-left mb-4 font-semibold">Forgot Password?</p>
                <p class="text-gray-500 text-sm text-left mb-3">Enter your email to receive a link to reset your password</p>
                <div class="mb-14">
                    <input class="border border-gray-300 p-3 w-full text-sm rounded mb-2" name="email" type="email" placeholder="example@gmail.com" bind:value={email} required>
                    {#if emailError}
                    <p class="text-red-500 text-sm mb-4">{emailError}</p>
                    {/if}
                    {#if errorStatus === "success"}
                    <div class="border border-green-400 p-3 w-[365px] text-sm text-gray-600 font-medium rounded my-6">{errorMessage}</div>
                {/if}
                {#if errorStatus === "error"}
                    <div class="border border-red-400 p-3 w-[365px] text-sm text-gray-600 font-medium rounded my-6">{errorMessage}</div>
                {/if}
                </div>
                <button on:click={handleSubmit} class="w-full bg-primary-400 text-white py-3 rounded-lg hover:bg-primary-400 transition-colors">Submit</button>
            </div>
        </form>
    </div>
</div>