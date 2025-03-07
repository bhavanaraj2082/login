<script>
  export let data;
  import Icon from "@iconify/svelte";
  let products = data?.order?.products || [];
  let shipments = data?.order?.shipdetails || [];

  const productDetails = products.map((product) => ({
    id: product._id,
    productName: product.productName,
    imageSrc: product.imageSrc,
  }));

  const shipmentdetails = shipments.map((shipment, index) => ({
    shipmentNumber: `Shipment ${index + 1}`,
    status: shipment.status,
    estDate: shipment.estDeliveryDate,
    shipmentId: shipment.shipmentId,
    shippedDate: shipment.shippedDate,
    shipMethod: shipment.shipMethod,
    deliveryDate: shipment.deliveredDate,
    shipDetails: shipment.shipDetails.map((detail) => {
      const product = productDetails.find((p) => p.id === detail.id);
      if (product) {
        return {
          ...detail,
          productName: product.productName,
          imgSrc: product.imageSrc,
        };
      }
      return detail;
    }),
  }));

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      day: "numeric",
      month: "short",
    };
    if (isNaN(date.getTime())) {
      return "--";
    }
    return date.toLocaleDateString("en-US", options);
  }
  // console.log("shipmenet ---->",shipmentdetails);
</script>

<div class="col-span-2 mt-2">
  {#if !shipmentdetails.length > 0}
    <div class="flex justify-center mt-8">
      <p class="text-content font-light">No products have been shipped yet.</p>
    </div>
  {/if}
  {#each shipmentdetails as shipment, index}
    <div class="mb-5">
      <div class="mb-3">
        <h1 class="text-base text-gray-600 font-semibold">
          Shipment {index + 1}
        </h1>
      </div>
      {#each shipment.shipDetails as item}
        <div class="border rounded-lg mb-5 bg-white">
          <div
            class="border flex justify-between items-center px-4 py-2 bg-white rounded-md"
          >
            <div class="flex gap-3">
              <div>
                <img src={item.imgSrc} alt="img" class="w-16 rounded-lg" />
              </div>
              <div class="flex flex-col">
                <p class="text-gray-600 text-sm font-semibold">
                  {item.productName || "--"}
                </p>
                <p class="font-medium text-sm text-gray-500">
                  Qty : <span class="text-gray-700">{item.quantity || "-"}</span
                  >
                </p>
                <p class="font-medium text-sm text-gray-700">
                  &#8377; <span>{item.price || "--"}</span>
                </p>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex gap-2 justify-end">
                {#if shipment.status === "Delivered"}
                  <div class="flex gap-2 text">
                    <Icon
                      icon="hugeicons:package-delivered"
                      class="text-green-700 text-xl"
                    />

                    <h3 class="font-semibold text-sm text-gray-500">
                      Delivered
                    </h3>
                  </div>
                {:else if shipment.status === "Shipped"}
                  <div class="flex gap-2">
                    <Icon
                      icon="iconoir:delivery-truck"
                      class="text-green-500 text-xl"
                    />
                    <h3 class="font-semibold text-sm text-gray-500">Shipped</h3>
                  </div>
                {:else if shipment.status === "Pending"}
                  <div class="flex gap-2">
                    <Icon
                      icon="mingcute:time-duration-line"
                      class="text-primary-500 text-xl"
                    />
                    <h3 class="font-semibold text-sm text-gray-500">Pending</h3>
                  </div>
                {:else if shipment.status === "Cancelled"}
                  <div class="flex gap-2">
                    <Icon
                      icon="pajamas:canceled-circle"
                      class="text-primary-500 text-xl"
                    />
                    <h3 class="font-semibold text-sm text-gray-500">
                      Cancelled
                    </h3>
                  </div>
                {/if}
              </div>
              {#if shipment.status === "Delivered"}
                <p class="font-medium text-sm text-gray-500 text-right">
                  <span class="font-semibold text-sm text-gray-600"
                    >{formatDate(shipment.deliveryDate)}</span
                  >
                </p>
              {:else if shipment.status === "Shipped"}
                <p class="font-medium text-sm text-gray-500 text-right">
                  Arrived by : <span class="font-semibold text-sm text-gray-600"
                    >{formatDate(shipment.estDate)}</span
                  >
                </p>
              {:else if shipment.status === "Pending"}
                <p class="font-medium text-sm text-gray-500 text-right">
                  Arrived by : <span class="font-semibold text-sm text-gray-600"
                    >{formatDate(shipment.estDate)}</span
                  >
                </p>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/each}
  {#if shipmentdetails.length > 0}
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
