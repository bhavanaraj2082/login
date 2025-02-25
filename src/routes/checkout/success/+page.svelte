<script>
	import { goto } from '$app/navigation';
    import { fly, fade } from 'svelte/transition';
    import Icon from '@iconify/svelte';
</script>

<section class="bg-gray-50 flex items-center justify-center p-6">
    <div class="bg-white shadow-xl rounded-md max-w-2xl w-full p-6 md:p-8" in:fade={{ duration: 400 }}>
      <div class="flex flex-col justify-center items-center space-y-6">
        <div class="flex justify-center w-full">
          <Icon icon="mdi:success-circle-outline" class="text-5xl mb-2 text-green-500" />
        </div>
        <h1 class="text-2xl md:text-3xl text-center font-semibold text-gray-800">Thank you for your order!</h1>
        <p class="text-gray-600 mt-2 text-center font-medium md:text-sm text-xs">Your order has been placed successfully.</p>
        <p class="text-gray-600 mb-6 text-center md:text-sm text-xs">You can manage and track the status of your order on the order page.</p>
        <div class="my-6 p-4 bg-gray-100 flex justify-center text-center rounded w-full">
          <p class="text-gray-700 text-xs md:text-base">
            <strong class="text-red-500">Note:</strong> Our team will contact you as soon as possible for further updates.
          </p>
        </div>
        <button 
          class="bg-primary-500 hover:bg-primary-600 text-white font-medium rounded px-4 py-2 mt-4 max-w-sm transition ease-in-out duration-300" 
          on:click={() => goto(`/order-status`)}
          in:fly={{ y: 10, duration: 600 }}>
          View Order Status
        </button>
      </div>
    </div>  
    </section>
    
    <style>
	      section {
      animation: fade-in 0.8s ease-out;
    }

    /* Smooth fade-in effect /
    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    / Hover effect for the button */
    button:hover {
      transform: translateY(-3px);
    }

    button:active {
      transform: translateY(0);
    }
  </style>
