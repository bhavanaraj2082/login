<script>
  import Icon from "@iconify/svelte";
  export let orderedproduct;
  export let remainingProducts;
  // console.log("Allorderedproduct", orderedproduct);
  // console.log("RemainingProducts", remainingProducts);

  function isProductInRemainingProducts(productId) {
    return remainingProducts.some((product) => product.productId === productId);
  }
</script>

<div class="col-span-2 mt-2">
  <div class="mb-5">
    <div class="mb-3">
      <h1 class="text-base text-gray-600 font-semibold">All Products</h1>
    </div>
    {#each orderedproduct as product}
      <div class="border rounded-lg mb-5">
        <div
          class="border flex justify-between items-center px-4 py-2 rounded-t-md"
        >
          <div class="flex gap-3 items-center ">
            <img src={product.imgSrc} alt="img" class="w-16 rounded-lg" />
            <div class="flex flex-col">
              <p class="text-gray-600 text-sm font-semibold">
                {product.productName}
              </p>
              <p class="font-medium text-sm text-gray-500">
                Qty : <span class="text-gray-700">{product.orderQty}</span>
              </p>
              <p class="font-medium text-sm text-gray-700">
                &#8377; <span>{product.unitPrice}</span>
              </p>
            </div>
          </div>

          <div class="flex flex-col justify-between items-center">
            <p class="font-medium text-sm text-gray-600">Ext.price</p>
            <p class="font-medium text-sm text-gray-700">
              &#8377; <span>{product.totalPrice}</span>
            </p>
          </div>

          <div class="flex gap-2 justify-end">
            {#if isProductInRemainingProducts(product.productId)}
              <div class="flex gap-2">
                <Icon
                  icon="mingcute:time-duration-line"
                  class="text-primary-500 text-xl"
                />
                <h3 class="font-semibold text-sm text-gray-500">In Progress</h3>
              </div>
            {:else}
              <div class="flex gap-2 text">
                <Icon
                  icon="hugeicons:package-delivered"
                  class="text-green-700 text-xl"
                />
                <h3 class="font-semibold text-sm text-gray-500">Delivered</h3>
              </div>
            {/if}
          </div>
        </div>
        {#if isProductInRemainingProducts(product.productId)}
          <div
            class="hover:bg-gray-50 py-1 rounded-b-md flex justify-center items-center"
          >
            <p class="text-base text-primary-400 font-medium">Cancel</p>
          </div>
        {:else}
          <div
            class="hover:bg-gray-50 py-1 rounded-b-md flex justify-center items-center"
          >
            <p class="text-base text-green-500 font-medium">Return</p>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
