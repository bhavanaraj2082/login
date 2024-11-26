<script>
  import Icon from '@iconify/svelte';
  import { fade } from 'svelte/transition';

  let email = '';
  let isSubmitting = false;
  let message = null;

  async function handleSubmit() {
    if (!email) {
      setMessage('error', 'Please enter an email address.');
      return;
    }
    isSubmitting = true;
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating a submit delay
    isSubmitting = false;
    setMessage('success', 'Subscription successful!');
    email = '';
  }

  function setMessage(type, text) {
    message = { type, text };
    setTimeout(() => (message = null), 5000);
  }
</script>

<div class="flex flex-col p-14 items-center justify-center bg-gray-50">
  <h1 class="text-2xl sm:text-4xl font-bold text-gray-800 text-center md:pt-20">Ready To Get Started</h1>
  <p class="text-md sm:text-lg text-gray-500 mt-2 text-center">To Join Our Community</p>
  <form on:submit|preventDefault={handleSubmit} class="mt-6 w-full max-w-lg mx-auto">
    <div class="relative flex w-full max-w-lg mx-auto">
      <input
        type="email"
        bind:value={email}
        placeholder="Enter your email"
        class="w-full px-4 sm:px-4 py-2  text-gray-600 border border-primary-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400"
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
    <p
      class:text-green-600={message.type === 'success'}
      class:text-red-600={message.type === 'error'}
      class="mt-4 text-sm text-center"
      role="alert"
      transition:fade>
      {message.text}
    </p>
  {/if}
</div>
