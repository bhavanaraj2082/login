<script>
  import { fade, slide } from "svelte/transition";
  import { enhance, applyAction } from "$app/forms";
  
  export let data;

  let orderDetail = {
    invoiceNumber: data.returndata.records.Invoice || "N/A",
    orderid: data.returndata.records.ordernumber || "N/A",
  };

  let items = data.returndata.records.expand.shipdetails || [];
  let returnstatus = data.returnstatus.records;
  let returndata = data.returndata.records.Invoice;

  let returnOrderId = generateReturnOrderId();
  let selectAll = false;
  let entireOrderReason = "";
  let entireOrderResolution = "";
  let entireOrderInfo = "";
  let selectedItems = [];
  let returnedproductNumber = new Set();
  let successMessage = "";
  let errorMessage = "";

  let filteredReturnStatus = returnstatus.filter(
    (item) => String(item.invoiceNumber) === String(returndata)
  );

  filteredReturnStatus.forEach((item) => {
    item.returnItems.forEach((returnItem) => {
      returnedproductNumber.add(returnItem.productNumber);
    });
  });

  function generateReturnOrderId() {
    return `${Math.floor(100000 + Math.random() * 900000)}`;
  }

  function getTotalShippedQuantity(items) {
    const totalQuantities = {};
    items
      .flatMap((item) => item.shipDetails)
      .forEach((shipDetail) => {
        const key = shipDetail.id;
        if (totalQuantities[key]) {
          totalQuantities[key].quantity += shipDetail.quantity;
        } else {
          totalQuantities[key] = {
            id: shipDetail.id,
            productName: shipDetail.productName,
            productNumber: shipDetail.productNumber, 
            price: shipDetail.price,
            quantity: shipDetail.quantity,
            selected: false,
            returnqty: "",
            reason: "",
            resolution: "",
            additionalInfo: "",
          };
        }
      });
    return Object.values(totalQuantities);
  }

  let totalShipped = getTotalShippedQuantity(items);

function handleItemSelect(index, isChecked) {
  totalShipped[index].selected = isChecked;

  if (isChecked) {
    selectedItems = [
      ...selectedItems,
      {
        productNumber: totalShipped[index].productNumber,
        productName: totalShipped[index].productName,
        quantity: totalShipped[index].quantity,
        returnqty:
          totalShipped[index].returnqty || totalShipped[index].quantity,
        reason: totalShipped[index].reason || "", 
        resolution: totalShipped[index].resolution || "",
        additionalInfo: totalShipped[index].additionalInfo || "",
      },
    ];
  } else {
    selectedItems = selectedItems.filter(
      (item) => item.productNumber !== totalShipped[index].productNumber
    );
  }
  filteredItems = totalShipped.map((item) => {
    if (item.selected) {
      return {
        productNumber: item.productNumber,
        productName: item.productName,
        quantity: item.quantity,
        returnqty: item.returnqty || item.quantity,
        reason: item.reason || "",
        resolution: item.resolution || "",
        additionalInfo: item.additionalInfo || "",
      };
    } else {
      console.log("returnqty",returnqty);
      return { returnqty: "" };
    }
  });
}

  function handleSelectAll(isChecked) {
    selectAll = isChecked;

    if (isChecked) {
      selectedItems = totalShipped
        .filter((item) => !returnedproductNumber.has(item.productNumber))
        .map((item) => ({
          productNumber: item.productNumber,
          productName: item.productName,
          quantity: item.quantity,
          returnqty: item.quantity,
          reason: entireOrderReason,
          resolution: entireOrderResolution,
          additionalInfo: entireOrderInfo,
        }));
      totalShipped = totalShipped.map((item) => ({
        ...item,
        selected: !returnedproductNumber.has(item.productNumber),
      }));
    } else {
      selectedItems = [];
      totalShipped = totalShipped.map((item) => ({
        ...item,
        selected: false,
        reason: "",
        resolution: "",
        additionalInfo: "",
      }));
      entireOrderReason = "";
      entireOrderResolution = "";
      entireOrderInfo = "";
    }
  }
 
  $: if (
    selectAll &&
    (entireOrderReason || entireOrderResolution || entireOrderInfo)
  ) {
    selectedItems = selectedItems.map((item) => ({
      ...item,
      reason: entireOrderReason,
      resolution: entireOrderResolution,
      additionalInfo: entireOrderInfo,
    }));
  }

  $: allItemsSelected = totalShipped.every(
    (item) => returnedproductNumber.has(item.productNumber) || item.selected
  );
  $: selectAllDisabled = allItemsSelected;


  const entireOrderReasons = [
    { value: "", label: "Select order issue or return reason", disabled: true },
    {
      value: "Package and products are damaged",
      label: "Package and products are damaged",
    },
    { value: "No longer need products", label: "No longer need products" },
    { value: "Wrong items received", label: "Wrong items received" },
  ];

  const individualReasons = [
    { value: "", label: "Select order issue or return reason", disabled: true },
    { value: "Product is damaged", label: "Product is damaged" },
    { value: "Wrong item received", label: "Wrong item received" },
    { value: "Ordered wrong product", label: "Ordered wrong product" },
    { value: "Quality issues", label: "Quality issues" },
  ];

  const resolutionOptions = [
    "Refund to your original payment method",
    "Ship remaining quantity",
  ];

  const handleCancelReturn = ({ cancel }) => {
    return async ({ result }) => {
      console.log(result);
    };
  };

  let cancelSuccessMessage = "";
  let cancelErrorMessage = "";
</script>

<div class="w-full md:w-11/12 rounded mx-auto my-3 max-w-7xl">
  <form class="rounded p-6 bg-white"
    method="POST"
    action="?/returns"
    use:enhance={({cancel}) => {
      if (!selectedItems.length) {
        errorMessage = "Please select at least one return component";
        cancel()
        setTimeout(() => {
          errorMessage = "";
        }, 3000);
      }
      return async ({ result }) => {
        if (result.status === 200) {
          successMessage = "Successfully added to Returns";
          errorMessage = "";
          location.reload();
          setTimeout(() => {
            successMessage = "";
        }, 3000);
        } else {
          successMessage = "";
          errorMessage = "Error adding to Returns";
          setTimeout(() => {
            errorMessage = "";
        }, 3000);
        }
        await applyAction(result);
      };
    }}>
    <input type="hidden" name="orderNumber" value={orderDetail.orderid}/>
    <input type="hidden" name="invoiceNumber" value={orderDetail.invoiceNumber}/>
    <input type="hidden" name="returnOrderid" value={returnOrderId} />
    {#each selectedItems as item, index}
      <input type="hidden" name={`selectedItems[${index}][productNumber]`} value={item.productNumber}/>
      <input type="hidden" name={`selectedItems[${index}][productName]`} value={item.productName}/>
      <input type="hidden" name={`selectedItems[${index}][quantity]`} value={item.quantity}/>
      <input type="hidden" name={`selectedItems[${index}][reason]`} value={item.reason}/>
      <input type="hidden" name={`selectedItems[${index}][resolution]`} value={item.resolution}/>
      <input type="hidden" name={`selectedItems[${index}][additionalInfo]`} value={item.additionalInfo}/>
    {/each}

    <div class="mb-6 py-2">
      <div class="flex items-center space-x-4">
        <input type="checkbox" bind:checked={selectAll} on:change={(e) => handleSelectAll(e.target.checked)} class="w-4 h-4" name="selectall" disabled={selectAllDisabled}/>
        <label for="selectall" class="font-medium">Select Entire Order</label>
      </div>

      {#if selectAll}
        <div class="ml-8 space-y-4" transition:slide>
          <div class="relative">
            <select
              name="reason"
              bind:value={entireOrderReason}
              class="w-full max-w-md p-2 border rounded">
              {#each entireOrderReasons as reason}
                <option value={`${reason.value}`} disabled={reason.disabled}>{reason.label}</option>
              {/each}
            </select>
            {#if entireOrderReason}
              <div class="space-y-4" transition:slide>
                <h3 class="font-medium pt-4">
                  How would you like this issue resolved?
                </h3>
                <div class="space-y-2">
                  {#each resolutionOptions as option}
                    <div class="flex items-center">
                      <input
                        type="radio"
                        name="entireOrderResolution"
                        value={`${option}`}
                        bind:group={entireOrderResolution}
                        class="mr-2"
                      />
                      <label for="entireOrderResolution">{option}</label>
                    </div>
                  {/each}
                </div>
                <textarea
                  bind:value={entireOrderInfo}
                  name="description"
                  placeholder="Additional Information"
                  required
                  class="w-full p-2 border rounded"
                  rows="4"></textarea>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <table class="w-full table-auto">
      <thead class="bg-white mx-auto min-w-full table-auto overflow-hidden">
        <tr class="border-y hover:bg-gray-50 transition-colors duration-150">
          <th class="p-2 text-left">Select</th>
          <th class="p-2 text-left">Product Name</th>
          <th class="p-2 text-left">Quantity Shipped</th>
          <th class="p-2 text-left">Return Quantity</th>
          <th class="p-2 text-left">Return Reason</th>
        </tr>
      </thead>
      <tbody>
        {#each totalShipped as item, index}
          <tr class="border-b hover:bg-gray-50 transition-colors duration-150">
            <td class="p-4">
              {#if !selectAll && !returnedproductNumber.has(item.productNumber)}
                <input
                  type="checkbox"
                  bind:checked={item.selected}
                  on:change={(e) => handleItemSelect(index, e.target.checked)}
                  class="w-4 h-4"
                />
              {/if}
            </td>
            <td class="p-2">
              <span class="font-semibold">
                {item.productName}
              </span><br>
              <span class="text-xs">
                {item.productNumber}
              </span>
            </td>
            <td class="p-2">{item.quantity}</td>
            <td class="p-2">
              <input
                type="number"
                name={`selectedItems[${index}][returnqty]`}
                min="0"
                max={item.quantity}
                bind:value={item.returnqty}
                class="w-20 p-2 border rounded-md"
              />
            </td>
            <td class="p-2">
              {#if !selectAll && item.selected && !returnedproductNumber.has(item.productNumber)}
                <select
                  name={`selectedItems[${index}][reason]`}
                  bind:value={item.reason}
                  class="w-full p-2 rounded">
                  {#each individualReasons as Option}
                    <option value={Option.value}>{Option.label}</option>
                  {/each}
                </select>
              {/if}
            </td>
          </tr>
          {#if !selectAll && item.selected && item.reason}
            <tr transition:slide>
              <td colspan="6" class="p-4 bg-gray-50">
                <div class="space-y-4">
                  <h3 class="font-medium">
                    How would you like this issue resolved?
                  </h3>
                  <div class="space-y-2">
                    {#each resolutionOptions as option}
                      <div class="flex items-center">
                        <input
                          type="radio"
                          name={`selectedItems[${index}][resolution]`}
                          value={`${option}`}
                          bind:group={item.resolution}
                          class="mr-2"
                        />
                        <label for="resolution">{option}</label>
                      </div>
                    {/each}
                  </div>
                  <textarea
                    name={`selectedItems[${index}][additionalInfo]`}
                    bind:value={item.additionalInfo}
                    placeholder="Additional Information"
                    class="w-full p-2 border rounded"
                    rows="4"></textarea>
                </div>
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
    {#if successMessage}
      <div class="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
        {successMessage}
      </div>
    {/if}
    {#if errorMessage}
      <div class="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
        {errorMessage}
      </div>
    {/if}
    <button type="submit" class="px-6 py-2 bg-primary-500 text-white font-semibold rounded my-4 hover:bg-primary-700 focus:outline-non focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">Submit Return Request</button>
  </form>
  {#if filteredReturnStatus && filteredReturnStatus.length > 0}
    <section class="w-full mx-auto border-t max-w-7xl bg-white rounded my-6">
      <div class="mt-6 space-y-6">
        <div class="pl-4">
          <h1 class="text-2xl font-bold text-heading">
            Return Order Status
          </h1>
          <h3 class="text-xl font-semibold text-heading mt-4">
            Items to Return
          </h3>
        </div>
        {#each filteredReturnStatus as item}
          <div class="border-t-8 border-t-gray-200 0 pt-4">
            <div class="overflow-x-auto bg-white p-6 rounded-t-lg shadow-sm">
              <table class="min-w-full table-auto border-separate border-spacing-0">
                <thead>
                  <tr class="bg-gray-50 border-b">
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Return Order ID</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Invoice Number</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Order Number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b">
                    <td class="px-4 py-2 text-sm text-description">{item.returnOrderid}</td>
                    <td class="px-4 py-2 text-sm text-description">{item.invoiceNumber}</td>
                    <td class="px-4 py-2 text-sm text-description">{item.orderNumber}</td>
                  </tr>
                </tbody>
              </table>
              <h4 class="text-xl font-semibold text-heading mt-6">Items</h4>
              <table class="min-w-full table-auto mt-4">
                <thead>
                  <tr class="bg-gray-50 border-b">
                    <th
                      class="px-4 py-2 text-left text-sm font-semibold text-heading">Description</th>
                    <th
                      class="px-4 py-2 text-left text-sm font-semibold text-heading">Return Issue</th>
                    <th
                      class="px-4 py-2 text-left text-sm font-semibold text-heading">Product Name</th>
                    <th
                      class="px-4 py-2 text-left text-sm font-semibold text-heading">Quantity</th>
                    <th
                      class="px-4 py-2 text-left text-sm font-semibold text-heading">Reason</th>
                    <th
                      class="px-4 py-2 text-left text-sm font-semibold text-heading">Return Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {#each item.returnItems as items}
                    <tr class="border-b">
                      <td class="px-4 py-2 text-sm text-description">{items.description}</td>
                      <td class="px-4 py-2 text-sm text-description">{items.issue}</td>
                      <td class="px-4 py-2 text-sm text-description">
                        <span class="font-semibold">
                          {items.productName}
                        </span><br>
                        <span class="text-xs">
                          {items.productNumber}
                        </span>
                      </td>
                      <td class="px-4 py-2 text-sm text-description">{items.quantity}</td>
                      <td class="px-4 py-2 text-sm text-description">{items.reason}</td>
                      <td class="px-4 py-2 text-sm text-description">{items.returnqty}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
              <h4 class="text-xl font-semibold text-heading mt-6">
                Status Information
              </h4>
              <table class="min-w-full table-auto mt-4">
                <thead>
                  <tr class="bg-gray-50 border-b">
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Estimation Date</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Picked Date</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="">
                    <td class="px-4 py-2 text-sm text-description">{item.status.estimation || "In Progress"}</td>
                    <td class="px-4 py-2 text-sm text-description">{item.status.picked || "In Progress"}</td>
                    <td class="px-4 py-2 text-sm text-description">{item.status.status || "In Progress"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <form
              method="POST"
              action="?/cancelreturn"
              use:enhance={({ handleCancelReturn }) => {
                if (!filteredReturnStatus.length) {
                  cancelErrorMessage = "Please select the return component";
                  setTimeout(() => {
                    cancelErrorMessage = "";
                  }, 3000);
                  handleCancelReturn();
                }
                return async ({ result }) => {
                  if (result.type === "success") {
                    cancelSuccessMessage = "Successfully deleted from Returns";
                    cancelErrorMessage = "";
                    setTimeout(() => {
                      cancelSuccessMessage = "";
                      location.reload();
                    }, 2000);
                  } else {
                    cancelSuccessMessage = "";
                    cancelErrorMessage = "Error deleting return";
                    setTimeout(() => {
                      cancelErrorMessage = "";
                    }, 3000);
                  }
                  await applyAction(result);
                };
              }}>
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                class="py-2 px-4 border-1 rounded my-4 mx-6 border-primary-500 hover:text-white hover:bg-primary-500">
                Cancel
              </button>
            </form>
          </div>
          {/each}
          {#if cancelSuccessMessage} 
            <div class="mt-4 p-4 bg-green-100 text-green-800 rounded">
              {cancelSuccessMessage}
            </div>
          {/if}
          {#if cancelErrorMessage}
            <div class="mt-4 p-4 bg-red-100 text-red-800 rounded">
              {cancelErrorMessage}
            </div>
          {/if}
      </div>
    </section>
  {:else}
    <p class="text-center text-xs font-semibold mt-6 p-2 rounded border border-primary-200 text-red-600 shadow">
      You have not raised any query for returning order.
    </p>
  {/if}
</div>