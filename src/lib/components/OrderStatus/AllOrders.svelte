<script>
  import Icon from "@iconify/svelte";
  import * as XLSX from 'xlsx';
  export let orderedproduct;
  // export let orderStatus;
  import { PUBLIC_IMAGE_URL } from "$env/static/public";
  export let currencyType;
  export let data;

  console.log("daaaaaaaaa",data);

  function priceShowing(price, currency) {
    if (price === undefined || price === null || price === 0) {
      return "--";
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
  function downloadExcel() {
    if (orderedproduct && orderedproduct.length > 0) {
      const excelData = orderedproduct.map(product => ({
        'Product Name': product.productName || '--',
        'Manufacturer Name': product.manufacturerName || '--',
        'Order Qty': product.orderQty || '--',
        'Backorder' : product.backOrder || "--",
        'Unit Price': formatPriceForExcel(product.unitPrice),
        'Extended Price': formatPriceForExcel(product.extendedPrice)
      }));

      let subtotal = data.order?.subtotalprice || 0;

      let orderId = data.order?.orderid || "";
      
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

      const totalRowIdx = excelData.length + 2;

      XLSX.utils.sheet_add_aoa(worksheet, 
        [['', '', '', '', 'Subtotal:', formatPriceForExcel(subtotal)]], 
        {origin: `A${totalRowIdx}`}
      );
      
      if (!worksheet['!rows']) worksheet['!rows'] = [];
      worksheet['!rows'][totalRowIdx] = { hidden: false, hpx: 16, level: 0, outlineLevel: 0 };

      const columnWidths = [
        { wch: 40 }, 
        { wch: 20 }, 
        { wch: 10 }, 
        { wch: 10 }, 
        { wch: 15 }, 
        { wch: 15 }  
      ];
      worksheet['!cols'] = columnWidths;

      XLSX.writeFile(workbook, `orderNo${orderId}.xlsx`);
    }
  }

  function formatPriceForExcel(price) {
    if (price === undefined || price === null || price === 0) {
      return '--';
    }
    return Number(price.toFixed(2));
  }
</script>

<div class="col-span-2 mt-2">
  <div class="mb-5">
    <div class="mb-3 flex justify-between pr-4">
      <h1 class="text-base text-gray-600 font-semibold">All Products</h1>
      <button 
        on:click={downloadExcel}
        class="bg-primary-500 px-4 py-1 rounded flex justify-center group hover:bg-primary-400 items-center gap-2 text-sm text-white"
      >
        Download Excel
        <Icon icon="basil:download-solid" width="18" height="18" />
      </button>
    </div>
    {#each orderedproduct as product}
      <div class="rounded-lg mb-5 bg-white">
        <div
          class="grid grid-cols-1 sm:grid-cols-4 gap-4 justify-between items-center px-4 py-2 rounded-md shadow"
        >
          <div
            class="flex gap-3 items-center col-span-3 sm:col-span-2 mb-2 sm:mb-0"
          >
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
              src="{PUBLIC_IMAGE_URL}/{product?.image}"
              onerror="this.src='{PUBLIC_IMAGE_URL}/default.jpg'"
              class="w-16 rounded-lg"
            />
            <div class="flex flex-col">
              <a href="/products/details/{product.productNumber}">
                <p
                  class="text-primary-400 hover:underline text-sm font-semibold"
                >
                  {product.productNumber}
                </p>
                <p
                  class="text-gray-700 hover:underline hover:text-primary-400 text-sm font-semibold"
                >
                  {product.productName || "--"}
                </p>
              </a>
              <div class="flex gap-4">
                <p class="font-medium text-sm text-gray-500">
                  Qty : <span class="text-gray-700"
                    >{product.orderQty || "--"}</span
                  >
                </p>
                {#if product.backOrder > 0}
                <p class="font-medium text-sm text-gray-500">
                  Backorder :<span class="text-gray-700"
                    >{product.backOrder || "--"}</span
                  >
                </p>
                {/if}
              </div>
            </div>
          </div>

          <div
            class="flex flex-col justify-between items-start ml-3 sm:ml-0 sm:items-center"
          >
            <p class="font-medium text-sm text-gray-600">unit price</p>
            <p class="font-medium text-sm text-gray-700">
              {priceShowing(product.unitPrice, currencyType)}
            </p>
          </div>

          <div
            class="flex flex-col justify-between items-start ml-3 sm:ml-0 sm:items-center"
          >
            <p class="font-medium text-sm text-gray-600">Ext.price</p>
            <p class="font-medium text-sm text-gray-700">
              {priceShowing(product.extendedPrice, currencyType)}
            </p>
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