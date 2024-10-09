<script>
    let email = '';
    
    function handleSubmit() {
      
      console.log("Email submitted:", email);
    }
  </script>
  
  <div class="flex flex-col items-center justify-center min-h-screen bg-white">
    <h1 class="text-4xl font-bold text-gray-800">Ready To Get Started</h1>
    <p class="text-lg text-gray-500 mt-2">To Join Our Community</p>
    
    <form on:submit|preventDefault={handleSubmit} class="mt-6 flex w-full max-w-md">
      <input
        type="email"
        bind:value={email}
        placeholder="person@email.com"
        class="flex-grow px-4 py-2 border-2 border-red-300 rounded-l-full focus:outline-none focus:ring focus:border-red-400 text-gray-600"
        required
      />
      <button
        type="submit"
        class="px-6 py-2 bg-red-400 text-white font-bold rounded-r-full focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        &gt;
      </button>
    </form>
  </div>
  
  
  