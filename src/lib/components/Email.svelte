<script>
	import Icon from '@iconify/svelte';
  let email = '';
  
  function handleSubmit() {
      console.log("Email submitted:", email);
  }
</script>

<div class="flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
  <h1 class="text-2xl  sm:text-4xl font-bold text-gray-800 text-center">Ready To Get Started</h1>
  <p class="text-md sm:text-lg text-gray-500 mt-2 text-center">To Join Our Community</p>
  
  <form on:submit|preventDefault={handleSubmit} class="mt-6 flex w-full max-w-lg">
    <div class="flex relative w-full">
      <input
          type="email"
          bind:value={email}
          placeholder="person@email.com"
          class="flex-grow px-4 py-2 border border-primary-500 rounded-md focus:outline-none text-gray-600"
          required
      />
      <button
          type="submit"
          class="p-1 m-1 bg-primary-400 absolute right-0 text-primary-50 font-bold rounded-md focus:outline-none"
      >
      <Icon icon="lsicon:right-filled" width="1.6em" height="1.6em"/>
      </button>
      </div>
  </form>
</div>
