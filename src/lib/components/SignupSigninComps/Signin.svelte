<script>
    import { enhance,applyAction } from '$app/forms';
    import { toast } from 'svelte-sonner';

    let email = '';
    let password = '';

    let errors= {}

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validateForm = ()=>{
        errors = {}
        if (!email || !emailRegex.test(email)) errors.email = 'Please enter a valid email address.';
        if (!password) errors.password = 'Please enter a valid password';

        if(Object.keys(errors).length >0){
            return false
        }else{
            return true
        } 
    }


    const handleFormSubmit = ({cancel})=>{
        if(!validateForm()){
            cancel()
        }
        return async ({result,update})=>{
            console.log(result);
           if(result.type === "redirect"){
                await update()
                await applyAction(result)
           }
            if(result.type === "success"){
                if(result.data.success){
					toast.success('',{description:result.data.message})
				}else{
					toast.error('',{description:result.data.message})
				}
            }
        }
    }

</script>

<div class="flex flex-col md:flex-row max-w-3xl shadow-lg rounded-lg mx-auto h-auto md:h-auto my-14">
    <div class="md:hidden w-full h-1/2 mx-auto flex justify-center"> 
        <img src="/image.jpg" alt="Sign In" class="object-cover h-full rounded" />
    </div>

    <div class="flex flex-col items-center w-full md:w-1/2 rounded-l md:rounded-l-lg p-8 bg-white">
        <div class="w-full mx-auto">
            <h1 class="text-2xl font-bold text-primary-500 mb-4">Sign In</h1>
            <p class="mb-4 text-gray-600">
                Do not have an account? <a href="/signup" class="text-primary-500 hover:text-primary-600 underline">Create a new one</a>
            </p>
            
            <form  method="POST" action="?/login"
            use:enhance={handleFormSubmit}>
                <label for="email" class="mb-2 text-gray-600">Enter your email</label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    bind:value={email}
                    placeholder="username@example.com"
                    class="border border-gray-300 rounded p-2 w-full"
                />
                {#if errors.email}
                <div class="text-red-500 text-xs mt-1 mb-3">{errors.email}</div>
                {/if}
                <label for="password" class="mb-2 text-gray-600">Enter your password</label>
                 <input
                    name="password"
                    type="password"
                    id="password"
                    bind:value={password}
                    placeholder="*******"
                    class="border border-gray-300 rounded p-2 w-full"
                />
                {#if errors.password}
                 <div class="text-red-500 text-xs mt-1">{errors.password}</div>
                {/if}
                <p class="mb-4">
                    <a href="/reset-password" class="text-primary-400 hover:text-primary-500 underline">Forgot password?</a>
                </p>

                <button type="submit" class="bg-primary-400 text-white rounded p-2 w-full text-center">
                    Login
                </button>
            </form>


        </div>
    </div>

    <div class="hidden md:flex md:w-1/2 flex-grow">
        <img src="/image.jpg" alt="Sign In" class="object-cover w-full h-full rounded-r-lg" /> 
    </div>
    
</div>