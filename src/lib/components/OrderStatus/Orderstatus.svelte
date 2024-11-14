<script>
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
  
    let email = "";
    let orderNumber = "";
    let error = {};
    let showErrorPopup = false;
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    const validateForm = () => {
      error = {};
      if (!email || !emailPattern.test(email)) {
        error.email = "*required and must be valid";
      }
      if (!orderNumber) {
        error.orderNumber = "*required order number";
      }
      return Object.keys(error).length === 0;
    };
  
    const handleSubmit = ({ cancel }) => {
      if (!validateForm()) {
        cancel();
      }
      return async ({ result }) => {
        if (result.type === "success" && result.data.success) {
          goto(`/order-status/${result.data?.order?.id}`);
        } else {
          showErrorPopup = true;
        }
      };
    };
  </script>
  
  <div class="flex items-center justify-center">
    <div class="container mx-auto p-6 max-w-screen-lg rounded-lg">
      <h2 class="text-2xl font-bold">Order Status</h2>
      <p class="text-lg md:text-base sm:text-sm mb-4">
        Please enter your order details below to check the status
      </p>
  
      <div class="bg-white px-6 py-3 rounded-md border border-gray-300 text-center">
        <form method="post" action="?/orderStatus" use:enhance={handleSubmit}>
          <div class="flex flex-col md:flex-row md:space-x-4 mb-4 p-4 rounded">
            <div class="flex-1 mb-4 md:mb-0">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 text-start"
              >
                Enter Email
                {#if error.email}
                  <span class="text-red-500 text-xs">{error.email}</span>
                {/if}
              </label>
              <input
                type="text"
                id="email"
                name="email"
                bind:value={email}
                class="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary-500"
              />
            </div>
            <div class="flex-1">
              <label
                for="orderNumber"
                class="block text-sm font-medium text-gray-700 text-start"
              >
                Enter Order Number
                {#if error.orderNumber}
                  <span class="text-red-500 text-xs">{error.orderNumber}</span>
                {/if}
              </label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                bind:value={orderNumber}
                class="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
  
          <div class="flex justify-start mb-3">
            <button
              type="submit"
              class="sm:w-1/2 w-full md:w-1/4 px-4 py-2 ml-4 bg-primary-400 hover:bg-primary-500 text-white rounded-md mt-5"
            >
              View Order Status
            </button>
          </div>
        </form>
      </div>
      {#if showErrorPopup}
        <div
          class="fixed inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-sm p-5 shadow-lg w-80">
            <h2 class="text-lg text-heading font-semibold">Error</h2>
            <p class="mt-2 text-sm text-description">
              The order was not located.
            </p>
            <p class="mt-1 text-sm text-description">
              Please check the details and try again.
            </p>
            <button
              on:click={() => (showErrorPopup = false)}
              class="mt-4 bg-primary-500 text-white rounded px-4 py-2 float-right"
            >
              Close
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
  