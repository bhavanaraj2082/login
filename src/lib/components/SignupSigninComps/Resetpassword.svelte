<script>
	import { goto } from '$app/navigation';
	import { authedUser } from '$lib/stores/mainStores.js';
    import { enhance,applyAction } from '$app/forms';
    export let data
    
    let email = "";
    let password = "";
    let passwordConfirm = "";
    let emailError = "";
    $: stepTwo = data.success === null  ? null : data.message ;
    let responseMsg = null;
    let errors = {}

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%_\-*])[A-Za-z\d!@#$%_\-*]{8,}$/;

    const validatePassword = ()=>{
        errors = {}
        if (!password) errors.password = 'Password is required.';
        if (!passwordRegex.test(password)) errors.password = 'Password must contain at least 8 characters, one number, and one special character.';
        if (!passwordConfirm) errors.passwordConfirm = 'Please confirm your password.';
        if (passwordConfirm !== password) errors.passwordConfirm = 'Passwords do not match.';
        if(Object.keys(errors).length >0){
            return false
        }else{
            return true
        } 
    }


    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function handleSubmit({cancel,action}) {
        const url = new URL(action)
        const actionName = url.search.replace("?/","")
        if(actionName === "updatePassword"){
           if(!validatePassword()){
            console.log('object');
              cancel()
            }
        }else{
            if (!email || !validateEmail(email)) {
                emailError = "Please enter a valid email address.";
                cancel()
            } else {
                emailError = "";
            }
        }
         
        return async ({ result }) => {
            console.log(result);
            if(result.type === "success"){
                if(result.data.success) responseMsg = result.data
            }
            if(result.type === "redirect"){
                await applyAction(result)
            }
        };
    }

</script>


<div class="bg-white min-h-screen mx-auto flex items-center justify-center">
    <div class="flex w-11/12 sm:w-2/3 md:w-2/4 lg:h-2/5 justify-center space-x-10">
        <!-- Step 1: Forgot Password Form -->
            <div class="bg-white p-8 shadow-lg rounded-lg border border-gray-200 space-y-3">
                <h2 class=" text-lg md:text-2xl font-bold text-center">Reset Password</h2>
                <div class="flex justify-center">
                    <div class="w-2/5 flex items-center">
                        <div class="h-7 w-7 px-3 bg-primary-400 text-white text-xs rounded-full flex justify-center items-center">1</div>
                            {#if stepTwo !== null}
                                <div class="w-full h-1 bg-primary-400"></div>
                                <div class="h-7 w-7 px-3 text-xs bg-primary-400 text-white font-medium rounded-full flex justify-center items-center">2</div>
                            {:else}
                                <div class="w-full h-1 bg-gray-200"></div>
                                <div class="h-7 w-7 px-3 text-xs bg-gray-200 text-black font-medium rounded-full flex justify-center items-center">2</div>
                            {/if}
                        </div>
                </div>
                    <h3 class="text-center text-gray-600 font-semibold">Step {stepTwo===null ? 1 : 2}</h3>
                    {#if stepTwo === null}
                        {#if responseMsg === null}
                            <p class="text-gray-500 text-sm text-left font-semibold">Forgot Password?</p>
                            <p class="text-gray-500 text-sm text-left">Enter your email to receive a link to reset your password</p>
                            <form method="POST" action="?/resetpassword" use:enhance={handleSubmit}>
                                <input type="hidden" name="userId" value={$authedUser.userId}>
                                <input class="border-1 border-gray-200 p-2 w-full text-sm rounded mb-2 focus:ring-0 focus:border-primary-400" name="email" type="text" placeholder="example@gmail.com" bind:value={email}>
                                <p class=" text-xs md:text-sm text-red-500">{emailError}</p>
                                <button type="submit" class="w-full bg-primary-400 text-white py-2 mt-2 font-medium rounded hover:bg-primary-400 transition-colors">Submit</button>
                            </form>
                        {:else}
                            <p class="text-sm md:text-4s font-medium {responseMsg.success ? " text-green-500" : " text-red-500"}">{responseMsg.message}</p>
                        {/if}
                    {:else}
                        {#if data?.success === true}
                            <form method="POST" action="?/updatePassword" use:enhance={handleSubmit} class=" w-72 md:w-96">
                                <p class=" text-center text-sm font-medium my-1 text-green-500">{data?.message || ""}</p>
                               <input type="hidden" name="userId" value={$authedUser.userId}>
                               <label for="password" class=" text-xs font-medium md:text-sm">New Password</label>
                               <input type="text" bind:value={password} class="border-1 border-gray-200 p-2 w-full text-sm rounded mb-2 focus:ring-0 focus:border-primary-400">
                               <p class=" text-xs md:text-sm text-red-500">{errors?.password || ""}</p>
                               <label for="password" class=" text-xs font-medium md:text-sm">Confirm Password</label>
                               <input type="text" name="newPassword" bind:value={passwordConfirm} class="border-1 border-gray-200 p-2 w-full text-sm rounded mb-2 focus:ring-0 focus:border-primary-400">
                               <p class=" text-xs md:text-sm text-red-500">{errors?.passwordConfirm || ""}</p>
                               <button type="submit" class="w-full bg-primary-400 text-white py-2 mt-2 font-medium rounded hover:bg-primary-400 transition-colors">Submit</button>
                            </form>
                        {:else}
                            <div class="w-72 md:w-96 flex items-center justify-center">
                                <div>
                                    <p class=" text-center text-sm font-medium my-1 text-red-500">{data?.message || ""}</p>
                                    <button type="button" on:click={()=>goto('/reset-password')} class="w-full bg-primary-400 text-white py-2 mt-2 font-medium rounded hover:bg-primary-400 transition-colors">OK</button>
                                </div>
                            </div>
                        {/if}
                       
                    {/if}
            </div>
    </div>
</div>