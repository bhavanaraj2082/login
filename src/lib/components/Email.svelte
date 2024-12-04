<script>
  import Icon from '@iconify/svelte';
  import { fade } from 'svelte/transition';
	import { enhance, applyAction } from '$app/forms';

	let email = '';
	let isSubmitting = false;
	let message='' ;
	let messageType=""
</script>

<div class="flex flex-col py-10 px-4 items-center justify-center bg-gray-50">
  <h1 class="text-2xl sm:text-4xl font-bold text-gray-800 text-center md:pt-20">Ready To Get Started</h1>
  <p class="text-md sm:text-lg text-gray-500 mt-2 text-center">To Join Our Community</p>
  <form 
  action="/?/subscribe"
  method="POST"
  use:enhance={() => {
      return async ({ result }) => {
          if (result.data.status === 200) {
              message = result.data.body.message;
              messageType = true;
          } else {
              message = result.data.body.message;
              messageType = false;    
          }
    await applyAction(result);
    setTimeout(() => {
          message = '';
          email = ''
      }, 4000)
      };
  }}
  class="mt-6 w-full mx-auto">
    <div class="relative flex w-full md:max-w-lg mx-auto">
      <input
        type="email"
        name="email"
        bind:value={email}
        placeholder="Enter your email"
        class="w-full px-4 sm:px-4 py-2 text-gray-600 border border-primary-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400"
        required
      />
      <button
        type="submit"
        class="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 bg-primary-400 hover:bg-primary-600 text-primary-50 font-bold rounded-r focus:outline-none w-12 h-8 flex items-center justify-center"
        disabled={isSubmitting}>
        {#if isSubmitting}
          <span class="text-xl">...</span>
        {:else}
          <Icon icon="lsicon:right-filled" width="1.6em" height="1.6em" />
        {/if}
      </button>
    </div>
  </form>
  {#if message}
  <div class="flex items-center justify-center mt-5">
  <div class={`border-2 rounded-lg ${messageType === true ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'} w-fit px-3 py-2 flex`}>
      {#if messageType === true}
        <Icon icon="mdi:check-circle" class="w-5 h-5 inline-block mr-1 text-green-600" />
        {:else}
        <Icon icon="mdi:close-circle" class="w-5 h-5 inline-block mr-1 text-red-600" />
      {/if}
      <div class="text-sm text-center" role="alert" transition:fade>
        {message}
      </div>
    </div>
  </div>
  {/if}
</div>
