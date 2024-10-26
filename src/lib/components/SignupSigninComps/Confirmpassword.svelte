<script>
    import { enhance } from '$app/forms';
    let newPassword = "";
    let newConfirmPassword = "";
    export let token = ""; 
    // console.log(token);
    
    let errorStatus = "";
    let errorMessage = "";
    let passwordError = "";
    let passwordlengthError = "";

    function validatePasswords() {
        passwordError = "";  
        passwordlengthError = "";

        if (newPassword.length < 8) {  
            passwordlengthError = "Password must be at least 8 characters long.";
            return false;
        }
        if (newPassword !== newConfirmPassword) {  
            passwordError = "Passwords do not match. Please try again.";
            return false;
        }
        
        return true;  
    }


    
</script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" rel="stylesheet">
<div class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="flex justify-center space-x-10">
        <form method="POST" action="?/confirmpasswordreset"
        use:enhance={() => {
            return async ({ result }) => {
                if (!validatePasswords()) return;  // Validate before submit
                // If validation passes, process result
                console.log(result);
                errorStatus = result.data.type;
                errorMessage = result.data.message;
            };
        }}
        >
            <div class="bg-white p-8 shadow-lg rounded-lg w-[430px]">
                <h2 class="text-2xl font-bold text-center text-primary-500 mb-6">Reset password</h2>
                <div class="flex justify-center mb-6">
                    <div class="w-1/2 flex items-center">
                        <div class="h-5 w-7 py-2 bg-primary-500 text-white text-xs rounded-full flex justify-center items-center">1</div>

                        {#if errorStatus === "success"}
                        <div class="w-full h-1 bg-primary-500 mx-2"></div>
                        <div class="h-5 w-7 py-2 text-xs bg-primary-500 text-white rounded-full flex justify-center items-center">2</div>
                        {:else}
                        <div class="w-full h-1 bg-gray-300 mx-2"></div>
                        <div class="h-5 w-7 py-2 text-xs bg-gray-300 text-gray-500 rounded-full flex justify-center items-center">2</div>
                        {/if}
                    </div>
                </div>
                <h3 class="text-center text-gray-600 font-semibold mb-4">Step 2</h3>
                <input type="hidden" name="token" bind:value={token} />
                <div class="mb-4">
                    <p class="text-gray-500 text-sm text-left mb-3">Enter New Password</p>
                    <input 
                        class="border border-gray-300 p-2 w-full rounded" 
                        type="password" 
                        placeholder="********" 
                        name="newPassword"
                        bind:value={newPassword} 
                        required
                    />
                    {#if passwordlengthError}
                    <div class="text-red-500 text-xs mt-1">{passwordlengthError}</div>
                {/if}
                </div>

                <div class="mb-12">
                    <p class="text-gray-500 text-sm text-left mb-3">Confirm New Password</p>
                    <input 
                        class="border border-gray-300 p-2 w-full rounded " 
                        type="password" 
                        placeholder="********" 
                        name="newConfirmPassword"
                        bind:value={newConfirmPassword} 
                        required
                    />
                    {#if passwordError}
                    <div class="text-red-500 text-xs mt-1">{passwordError}</div>
                {/if}
                </div>
                
                {#if errorStatus === "success"}
                    <div class="border border-green-400 p-3 w-[365px] text-sm text-gray-600 font-medium rounded my-6"><i class="fa-solid fa-circle-check text-green-400 mr-1"></i>{errorMessage}</div>
                {/if}
                {#if errorStatus === "error"}
                    <div class="border border-red-400 p-3 w-[365px] text-sm text-gray-600 font-medium rounded my-6">{errorMessage}</div>
                {/if}
                <button type="submit"  class="w-full bg-primary-400 text-white py-3 rounded-lg hover:bg-primary-400 transition-colors mb-4">Reset</button>
                <button type="submit" class="w-full bg-primary-400 text-white py-3 rounded-lg hover:bg-primary-400 transition-colors mb-4"><a href="/signin">Login</a></button>
            </div>
        </form>
    </div>
</div>