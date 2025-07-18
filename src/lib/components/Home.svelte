<script>
  import { goto } from '$app/navigation';
  
  function navigateToSignIn() {
    goto('/signin');
  }
  
  function navigateToSignUp() {
    goto('/signup');
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
  <div class="max-w-4xl mx-auto text-center">
    
    <!-- Hero Section -->
    <div class="mb-12">
      <!-- Logo/Brand -->
      <div class="mb-8">
        <div class="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-4">
          Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">YourApp</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Join thousands of users who trust us with their digital experience. Start your journey today.
        </p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
      
      <!-- Sign In Button -->
      <button 
        on:click={navigateToSignIn}
        class="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl w-full sm:w-auto min-w-[200px]"
      >
        <div class="flex items-center justify-center space-x-3">
          <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
          <span>Sign In</span>
        </div>
        <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      <!-- Sign Up Button -->
      <button 
        on:click={navigateToSignUp}
        class="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl text-white font-semibold text-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl w-full sm:w-auto min-w-[200px]"
      >
        <div class="flex items-center justify-center space-x-3">
          <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
          <span>Create Account</span>
        </div>
      </button>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
        <div class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h3 class="text-white font-semibold text-lg mb-2">Secure & Safe</h3>
        <p class="text-gray-300 text-sm">Your data is protected with enterprise-grade security</p>
      </div>

      <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
        <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h3 class="text-white font-semibold text-lg mb-2">Lightning Fast</h3>
        <p class="text-gray-300 text-sm">Optimized for speed and performance</p>
      </div>

      <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
        <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <h3 class="text-white font-semibold text-lg mb-2">User Friendly</h3>
        <p class="text-gray-300 text-sm">Intuitive design that just works</p>
      </div>
    </div>

    <!-- Footer Text -->
    <div class="text-center">
      <p class="text-gray-400 text-sm">
        Already have an account? Click <span class="text-cyan-400 font-semibold cursor-pointer hover:text-cyan-300" on:click={navigateToSignIn}>Sign In</span> to get started
      </p>
    </div>
  </div>
</div>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  

</style>