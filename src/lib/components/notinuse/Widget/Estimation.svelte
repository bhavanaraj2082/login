<script>
  let price = null; 
  let showModal = false;

  function estimatePrice() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <div class="text-2xl font-bold text-red-800 mb-2">
    4. Estimate price & add to cart
  </div>

  <button 
    class="bg-blue-700 text-white font-semibold py-4 px-20 rounded-lg hover:bg-blue-600 transition"
    on:click={estimatePrice}
  >
    Estimate price
  </button>

  {#if price}
    <p class="mt-4 text-green-600 font-medium">{price}</p>
  {/if}

  {#if showModal}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto relative">
        <h2 class="text-xl font-bold mb-4">Please select your Lab ID if you have one</h2>
        <p class="text-gray-700 mb-4">
          Note that browsing is possible but pricing details and the ability to check out are restricted when no Lab ID is selected.
        </p>
        <button 
          class="bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          on:click={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  {/if}
</div>
