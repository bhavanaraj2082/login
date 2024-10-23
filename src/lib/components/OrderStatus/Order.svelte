<script>
  export let error = '';
  export let data = null;
</script>

<div class="min-h-screen flex flex-col justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
  <h2 class="text-3xl font-bold mb-4 text-left">Order Status</h2>
  <p class="text-left text-gray-600 mb-8">Please enter your order details below to check the status</p>

  {#if error}
    <div class="text-red-500 text-sm mb-6 text-center">{error}</div>
  {/if}

  {#if data}
    <div class="text-center text-green-500 text-lg mb-6">Status: {data.status}</div>
  {/if}

  <form method="post" action="?/checkOrderStatus" class="max-w-4xl mx-auto w-full space-y-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div>
        <label class="block text-gray-700 text-lg font-medium">*Order Number</label>
        <input type="text" name="orderNumber" placeholder="Order Number"
               class="mt-2 block w-full px-6 py-2 border rounded-lg text-lg focus:ring focus:outline-none" 
               required />
      </div>
      <div>
        <label class="block text-gray-700 text-lg font-medium">*Shipped to Postal Code</label>
        <input type="text" name="postalCode" placeholder="Postal Code"
               class="mt-2 block w-full px-6 py-2 border rounded-lg text-lg focus:ring focus:outline-none" 
               required />
      </div>
    </div>

    <div class="flex justify-left">
      <button type="submit" class="px-12 py-4 bg-primary-400 text-white text-lg rounded-lg hover:bg-primary-400 transition">
        View Order Status
      </button>
    </div>
  </form>
</div>