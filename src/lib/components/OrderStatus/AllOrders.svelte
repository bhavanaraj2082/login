<script>
  import Icon from "@iconify/svelte";
  export let orderedproduct;
  export let orderStatus;
  // console.log("orderProduct====>", orderedproduct);
</script>

<div class="col-span-2 mt-2"> 
  <div class="mb-5">
    <div class="mb-3">
      <h1 class="text-base text-gray-600 font-semibold">All Products</h1>
    </div>
    {#each orderedproduct as product}
      <div class="border rounded-lg mb-5">
        <div
          class="border grid grid-cols-1 sm:grid-cols-4 gap-4 justify-between items-center px-4 py-2 rounded-md"
        >
          <div
            class="flex gap-3 items-center col-span-3 sm:col-span-2 mb-2 sm:mb-0"
          >
            <img src={product.imgSrc} alt="img" class="w-16 rounded-lg" />
            <div class="flex flex-col">
              <p class="text-gray-600 text-sm font-semibold">
                {product.productName || "--"}
              </p>
              <p class="font-medium text-sm text-gray-500">
                Qty : <span class="text-gray-700"
                  >{product.orderQty || "--"}</span
                >
              </p>
              <p class="font-medium text-sm text-gray-700">
                &#8377; <span>{product.unitPrice || "--"}</span>
              </p>
            </div>
          </div>

          <div
            class="flex flex-col justify-between items-start ml-3 sm:ml-0 sm:items-center"
          >
            <p class="font-medium text-sm text-gray-600">Ext.price</p>
            <p class="font-medium text-sm text-gray-700">
              &#8377; <span>{product.extendedPrice.toFixed(3) || "--"}</span>
            </p>
          </div>

          <div class="flex gap-2 justify-end items-center">
            {#if orderStatus == "pending" || orderStatus == "pending cancellation"}
              <div class="flex gap-2">
                <Icon
                  icon="mingcute:time-duration-line"
                  class="text-primary-500 text-xl"
                />
                <h3 class="font-semibold text-sm text-gray-500">In Progress</h3>
              </div>
            {:else if orderStatus == "shipped"}
              <div class="flex gap-2">
                <Icon
                  icon="iconoir:delivery-truck"
                  class="text-green-700 text-xl"
                />
                <h3 class="font-semibold text-sm text-gray-500">Shipped</h3>
              </div>
            {:else if orderStatus == "completed"}
              <div class="flex gap-2">
                <Icon
                  icon="hugeicons:package-delivered"
                  class="text-green-700 text-xl"
                />
                <h3 class="font-semibold text-sm text-gray-500">Delivered</h3>
              </div>
            {:else if orderStatus == "cancelled"}
              <div class="flex gap-2">
                <Icon
                  icon="pajamas:canceled-circle"
                  class="text-primary-500 text-xl"
                />
                <h3 class="font-semibold text-sm text-gray-500">Cancelled</h3>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
  {#if orderedproduct.length > 0}
    <button
      class="sticky bottom-0 left-3/4 z-10 rounded border shrink-0 p-1.5 bg-primary-100 hover:text-white hover:bg-primary-600"
      on:click={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <Icon icon="zondicons:cheveron-up" class="text-2xl" />
    </button>
  {/if}
</div>
