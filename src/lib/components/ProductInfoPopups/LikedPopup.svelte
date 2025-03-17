<script>
  import Icon from "@iconify/svelte";
  export let data;
  export let toggleLikedPopup;
</script>

{#each data.records as product}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity"
    on:click={toggleLikedPopup}
  >
    <div
      class="bg-white rounded-lg shadow-xl p-5 max-w-sm w-full relative"
      on:click|stopPropagation
    >
      <button
        on:click={toggleLikedPopup}
        class="absolute top-3 right-3 hover:bg-red-100 text-white rounded font-bold transition-colors duration-300"
        aria-label="Close"
      >
        <Icon
          icon="mdi:close"
          class="text-2xl font-bold text-red-600 border rounded hover:p-px"
        />
      </button>

      <h2 class="text-xl font-bold text-gray-900 text-center mb-6">
        Please SignIn or Register to Continue
      </h2>

      <div class="mx-16">
        <button
          class="w-full bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-500 text-sm text-white font-medium py-2.5 px-2 rounded-lg shadow-sm mb-4"
        >
          <a href="/signin" class="block">SignIn</a>
        </button>

        <p class="text-center text-sm text-gray-500 mb-2">
          Don’t have an account?
        </p>
        <button
          class="w-full border border-primary-400 hover:bg-primary-500 hover:text-white text-primary-500 text-sm font-medium py-2 px-2 rounded-lg shadow-sm mb-6"
        >
          <a href="/signup" class="block">Register</a>
        </button>
      </div>
    </div>
  </div>
{/each}
