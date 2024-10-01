<script>
    import { createEventDispatcher } from 'svelte';
    
    export let buttonText = 'Login';
    
    let email = '';
    let password = '';
    
    const dispatch = createEventDispatcher();

    const submitLogin = (event) => {
        event.preventDefault(); 
        dispatch('submit', { email, password }); 
    };
</script>

<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

<div class="flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center bg-no-repeat" style="background-image: url('src/lib/data/LoginPage/4880206.jpg');">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

        <form on:submit={submitLogin}>
            <div class="mb-4">
                <input
                    type="email"
                    placeholder="Email / Username"
                    bind:value={email}
                    class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
                    required
                />
            </div>

            <div class="mb-4">
                <input
                    type="password"
                    placeholder="Password"
                    bind:value={password}
                    class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
                    required
                />
            </div>

            <button
                type="submit"
                class="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition duration-200"
            >
                {buttonText}
            </button>

            <div class="text-center mt-4">
                <a href="#" class="text-blue-600 hover:underline">Forgot Password</a>
            </div>

            <div class="text-center mt-4">
                <p>Don't have an account?</p>
                <a href="#" class="text-gray-600 border border-gray-600 rounded py-2 px-4 inline-block mt-2 hover:bg-gray-600 hover:text-white transition duration-200">
                    Register Now
                </a>
            </div>
        </form>
    </div>
</div>
