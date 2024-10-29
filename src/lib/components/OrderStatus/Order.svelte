<script>
  import { enhance } from '$app/forms';
  let order_number = '';  
  let status = '';
  let errormssg = '';
  let postalcode = '';
  let showErrors = false;
  function showMessage(s) {
    status = s;
  }
</script>
<div class="flex items-center justify-center min-h-screen">
  <div class="container mx-auto p-6 max-w-screen-lg rounded-lg">
    <h2 class="text-2xl font-bold">Order Status</h2>
    <p class="text-lg md:text-base sm:text-sm mb-4">
      Please enter your order details below to check the status
    </p>
    <div class="bg-white p-6 rounded-md border border-gray-300 text-center">
      <form method="post" action="?/orderStatus" use:enhance={() => {
        return async({ result }) => {
            showErrors = order_number.length === 0 || postalcode.length === 0;
            if (showErrors) {
              return;
            }
            console.log(result);
            if (result.data) {
                const order_status = result.data.order_status;
                showMessage(order_status);
            } else if (result) {
                console.log(result);
                errormssg = result.data.props.error;
                showMessage(errormssg);
            }
        };
      }}>
        <div class="flex flex-col md:flex-row md:space-x-4 mb-4">
          <div class="flex-1">     
            <label for="order_number" class="block text-sm font-medium text-gray-700 text-start">*Order Number</label>
            <input type="text" id="order_number" name="order_number" bind:value={order_number}  class="mt-1 p-2 border border-gray-300 rounded-sm w-full focus:outline-none focus:border-primary-500" />
            {#if showErrors && order_number.length === 0}
              <div class="flex text-start">
                <span class="text-red-400 text-xs">Order Number is required</span>
              </div>
            {/if}
          </div>
          <div class="flex-1">  
            <label for="postalcode" class="block text-sm font-medium text-gray-700 text-start sm:mt-0 mt-10">*Shipped to Postal Code</label>
            <input type="text" id="postalcode" name="postalcode" bind:value={postalcode}  class="mt-1 p-2 border border-gray-300 rounded-sm w-full focus:outline-none focus:border-primary-500" />
            {#if showErrors && postalcode.length === 0}
              <div class="flex text-start">
                <span class="text-red-400 text-xs">Postal Code is required</span>
              </div>
            {/if}
          </div>
        </div>
        <div class="flex justify-start">
          <button type="submit" class="sm:w-1/2 w-full md:w-1/4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md mt-7">View Order Status</button>
        </div>
        <div class="text-primary-500 font-semibold text-base mt-4">{status}</div>
      </form>
    </div>
  </div>
</div>