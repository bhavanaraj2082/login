<script>
    import Icon from "@iconify/svelte";
    export let remainingProducts;
    // console.log("remainingProducts",remainingProducts);
  </script>
<div class="col-span-2 mt-6">
  {#if !remainingProducts.length > 0}
  <div class="flex justify-center mt-5">
    <p class="text-content font-light">No pending products available.</p>
  </div>
  {/if}
    <div class="mb-5">  
      {#each remainingProducts as product}
      <div class="mb-3">
        <h1 class="text-base text-gray-600 font-semibold"> Pending Products</h1>
      </div>
        <div class="border rounded-lg mb-5">
          <div class="border flex justify-between items-center px-4 py-2 rounded-md">
            <div class="flex gap-3 items-center w-[35%]">
              <img
                src={product.imgSrc}
                alt="img"
                class="w-16 rounded-lg"
              />
              <div class="flex flex-col">
                <p class="text-gray-600 text-sm font-semibold">
                  {product.productName || '--'}
                </p>
                <p class="font-medium text-sm text-gray-500">
                  Qty : <span class="text-gray-700">{product.remainingQuantity || '--'
                }</span>
                </p>
                <p class="font-medium text-sm text-gray-700">
                  &#8377; <span>{product.unitPrice || '--'}</span>
                </p>
              </div>
            </div>
            <div class="flex gap-2 justify-end ">
                <div class="flex gap-2">
                  <div></div>
                  <Icon
                    icon="mingcute:time-duration-line"
                    class="text-primary-500 text-xl"
                  />
                  <h3 class="font-semibold text-sm text-gray-500">Pending</h3>
                </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
  