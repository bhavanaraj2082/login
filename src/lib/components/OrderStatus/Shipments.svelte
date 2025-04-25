<script>
  export let data;
  import Icon from "@iconify/svelte";
  import {PUBLIC_IMAGE_URL} from "$env/static/public"
  export let currencyType;
  let products = data?.order?.products || [];
  let shipments = data?.order?.shipdetails || [];

  const productDetails = products.map((product) => ({
    id: product._id,
    productName: product.productName,
    image : product.image
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
          image : product.image
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
  console.log("shipmenettt ---->",shipmentdetails);

  function priceShowing(price, currency) {
    if (price === undefined || price === null || price === 0) {
        return '--';
    }
    const formattedPrice = Number(price.toFixed(2));
    if (currency === "inr") {
      let showingPrice = formattedPrice.toLocaleString("en-IN");
        return `₹ ${showingPrice}`;
    }
    if (currency === "usd") {
        return `$ ${formattedPrice}`;
    }
    return formattedPrice; 
}
</script>

<div class="col-span-2 mt-2">
  {#if !shipmentdetails.length > 0}
    <div class="flex items-center justify-center mt-8 p-8 rounded-md shadow bg-white">
      <span class="bg-primary-50 rounded-full items-center">
        <Icon icon="mdi:box-alert-outline" class="text-primary-500 md:text-xl text-sm m-2 "/>
      </span>
      <p class="md:text-content font-light ml-1 text-xs">No products have been shipped yet.</p>
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
        <div class="rounded-lg mb-5 bg-white">
          <div
            class="grid grid-cols-1 sm:grid-cols-4 gap-4 justify-between items-center px-4 py-2 rounded-md shadow"
          >
            <div class="flex gap-3 col-span-3 sm:col-span-2">
              <div>
                  <!-- svelte-ignore a11y-missing-attribute -->
            <img  
            src="{PUBLIC_IMAGE_URL}/{item?.image}"
            onerror="this.src='{PUBLIC_IMAGE_URL}/default.jpg'" 
            class="w-16 rounded-lg" />
              </div>
              <div class="flex flex-col justify-center">
                <a href="/products/details/{item.productNumber}">
                <p class="text-gray-600 text-sm font-semibold">
                  {item.productName || "--"}
                </p>
                </a>
                <p class="font-medium text-sm text-gray-500">
                  Qty : <span class="text-gray-700">{item.quantity || "-"}</span
                  >
                </p>
              </div>
            </div>

            <div>
              <p class="font-medium text-sm text-gray-600">unit price</p>
              <p class="font-medium text-sm text-gray-700">
                {priceShowing(item.price, currencyType)}
              </p>
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
                {:else if shipment.status === "Dispatched from Bengaluru"}
                  <div class="flex gap-2">
                    <Icon
                      icon="iconoir:delivery-truck"
                      class="text-green-500 text-xl"
                    />
                    <h3 class="font-semibold text-sm text-gray-500">Shipped</h3>
                  </div>
                {:else if ( shipment.status === "Order Loaded") || (shipment.status === "Picked up from warehouse")}
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
