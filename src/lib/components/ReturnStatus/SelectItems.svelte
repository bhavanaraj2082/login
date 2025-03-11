<script>
  import { slide } from "svelte/transition";
  import { enhance, applyAction } from "$app/forms";
  import { toast, Toaster } from 'svelte-sonner';

  export let data;
  export let items;

  let returndata = data?.returndata;
  let filteredReturnStatus = data?.returnstatus;

  let orderDetail = {
    invoiceNumber: returndata?.invoice || "N/A",
    orderNumber: returndata?.orderid || "N/A",
  };

  let userId = returndata?.userId || '';
  let selectAll = false;
  let entireOrderReason = "";
  let entireOrderResolution = "";
  let entireOrderInfo = "";
  let selectedItems = [];
  let returnedProductNumbers = new Set();
  let totalShipped = [];
  let returnOrderId = generateReturnOrderId();

  $: {
    if (filteredReturnStatus && filteredReturnStatus.length > 0) {
      returnedProductNumbers = new Set();
      filteredReturnStatus.forEach(status => {
        if (Array.isArray(status.returnItems)) {
          status.returnItems.forEach(item => {
            returnedProductNumbers.add(item.productNumber);
          });
        } else if (status.returnItems && status.returnItems.selectedItems) {
          status.returnItems.selectedItems.forEach(item => {
            returnedProductNumbers.add(item.productNumber);
          });
        }
      });
    }
  }

  $: allProductsReturned = totalShipped.length > 0 && 
     totalShipped.every(item => returnedProductNumbers.has(item.productNumber));

  function truncateText(text, maxLength = 25) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  function showSuccessToast(message) {
    toast.success(message);
  }
  
  function showErrorToast(message) {
    toast.error(message);
  }

  function generateReturnOrderId() {
    return `${Math.floor(100000 + Math.random() * 900000)}`;
  }

  function getTotalShippedQuantity(items) {
    const totalQuantities = {};
    items
      .flatMap((item) => item.shipDetails || [])
      .forEach((shipDetail) => {
        const key = shipDetail.id;
        if (totalQuantities[key]) {
          totalQuantities[key].orderQty += shipDetail.orderQty;
        } else {
          totalQuantities[key] = {
            id: shipDetail.id,
            productName: shipDetail.productName,
            productNumber: shipDetail.productNumber,
            manufacturerName: shipDetail.manufacturerName,
            price: shipDetail.price,
            orderQty: shipDetail.orderQty,
            selected: false,
            returnqty: "",
            reason: "",
            resolution: "",
            additionalInfo: "",
            showDetails: false
          };
        }
      });
    return Object.values(totalQuantities);
  }

  function validateReturnQuantity(value, max) {
    const quantity = parseInt(value, 10);
    if (isNaN(quantity) || quantity < 1) {
      showErrorToast("Return quantity must be at least 1");
      return 1;
    }
    if (quantity > max) {
      showErrorToast(`Return quantity cannot exceed ${max}`);
      return max;
    }
    return quantity;
  }

  function handleItemSelect(index, isChecked, value, field) {
    const newTotalShipped = [...totalShipped];
    const currentItem = { ...newTotalShipped[index] };

    if (field) {
      if (field === 'returnqty') {
        value = validateReturnQuantity(value, currentItem.orderQty);
      }
      currentItem[field] = value;
      currentItem.selected = true;  
    } else {
      currentItem.selected = isChecked;
      if (isChecked) {
        currentItem.returnqty = currentItem.returnqty || currentItem.orderQty;
      } else {
        currentItem.returnqty = "";
        currentItem.reason = "";
        currentItem.resolution = "";
        currentItem.additionalInfo = "";
      }
    }

    newTotalShipped[index] = currentItem;
    totalShipped = newTotalShipped;

    updateSelectedItems();
  }

  function updateItemField(index, field, value) {
    const newTotalShipped = [...totalShipped];
    const currentItem = { ...newTotalShipped[index] };
    
    if (field === 'returnqty') {
      value = validateReturnQuantity(value, currentItem.orderQty);
    }
    
    currentItem[field] = value;
    
    if (field === 'reason' && value) {
      currentItem.showDetails = true; 
    }
    
    newTotalShipped[index] = currentItem;
    totalShipped = newTotalShipped;
    
    updateSelectedItems();
  }

  function updateSelectedItems() {
    selectedItems = totalShipped
      .filter(item => item.selected)
      .map(item => ({
        productNumber: item.productNumber,
        productName: item.productName,
        manufacturerName: item.manufacturerName,
        orderQty: item.orderQty,
        returnqty: item.returnqty,
        reason: item.reason,
        resolution: item.resolution,
        additionalInfo: item.additionalInfo,
        price: item.price
      }));
  }

  function handleSelectAll(isChecked) {
    selectAll = isChecked;
    
    const newTotalShipped = totalShipped.map(item => {
      if (returnedProductNumbers.has(item.productNumber)) {
        return item;
      }
      return {
        ...item,
        selected: isChecked,
        showDetails: false, 
        returnqty: isChecked ? item.orderQty : "",
        reason: isChecked ? entireOrderReason : "",
        resolution: isChecked ? entireOrderResolution : "",
        additionalInfo: isChecked ? entireOrderInfo : ""
      };
    });

    totalShipped = newTotalShipped;
    updateSelectedItems();
  }

  $: {
    if (items && items.length) {
      totalShipped = getTotalShippedQuantity(items);
    } else if (returndata?.orderdetails) {
      totalShipped = returndata.orderdetails.map((detail) => ({
        id: detail.id || null,
        productName: detail.productName || "N/A",
        productNumber: detail.productNumber || "N/A",
        manufacturerName: detail.manufacturerName || "N/A",
        price: detail.price || 0,
        orderQty: detail.orderQty || 0,
        selected: false,
        returnqty: "",
        reason: "",
        resolution: "",
        additionalInfo: "",
      }));
    }
  }

  $: if (selectAll && (entireOrderReason || entireOrderResolution || entireOrderInfo)) {
    totalShipped = totalShipped.map(item => {
      if (item.selected) {
        return {
          ...item,
          reason: entireOrderReason,
          resolution: entireOrderResolution,
          additionalInfo: entireOrderInfo
        };
      }
      return item;
    });

    updateSelectedItems();
  }

  $: allItemsSelected = totalShipped.every(
    (item) => returnedProductNumbers.has(item.productNumber) || item.selected
  );

  const entireOrderReasons = [
    { value: "", label: "Select order issue or return reason", disabled: true },
    { value: "Package and products are damaged", label: "Package and products are damaged" },
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

  function validateForm() {
    if (!selectedItems.length) {
      showErrorToast("Please select at least one item to return");
      return false;
    }

    const hasInvalidItems = selectedItems.some(item => {
      if (!item.reason) {
        showErrorToast(`Please select a return reason for ${item.productName}`);
        return true;
      }
      if (!item.resolution) {
        showErrorToast(`Please select a resolution for ${item.productName}`);
        return true;
      }
      if (!item.returnqty || parseInt(item.returnqty) < 1) {
        showErrorToast(`Please enter a valid return quantity for ${item.productName}`);
        return true;
      }
      return false;
    });

    return !hasInvalidItems;
  }

  const handleSubmit = ({ cancel }) => {
    if (!validateForm()) {
      cancel();
      return;
    }

    return async ({ result }) => {
      if (result.status === 200) {
        showSuccessToast("Successfully added to Returns");
        setTimeout(() => {
          location.reload();
        }, 2000);
      } else {
        showErrorToast("Error adding to Returns");
      }
      await applyAction(result);
    };
  };
  
  function handleRemoveItem(productNumber) {
    const index = totalShipped.findIndex(item => item.productNumber === productNumber);
    if (index >= 0) {
      handleItemSelect(index, false);
      updateSelectedItems();
    }
  }
</script>

<Toaster />

<div class="w-full md:w-11/12 rounded mx-auto overflow-x-auto  my-3 max-w-7xl">
  <form
    class="rounded p-6 bg-white shadow"
    method="POST"
    action="?/returns"
    use:enhance={handleSubmit}>
    <input type="hidden" name="orderNumber" value={orderDetail.orderNumber} />
    <input type="hidden" name="invoiceNumber" value={orderDetail.invoiceNumber} />
    <input type="hidden" name="returnOrderId" value={returnOrderId} />
    <input type="hidden" name="userId" value={userId}/>  
    {#each selectedItems as item, index}
      <input type="hidden" name={`selectedItems[${index}].productNumber`} value={item.productNumber} />
      <input type="hidden" name={`selectedItems[${index}].productName`} value={item.productName} />
      <input type="hidden" name={`selectedItems[${index}].manufacturerName`} value={item.manufacturerName} />
      <input type="hidden" name={`selectedItems[${index}].orderQty`} value={item.orderQty} />
      <input type="hidden" name={`selectedItems[${index}].returnqty`} value={item.returnqty} />
      <input type="hidden" name={`selectedItems[${index}].reason`} value={item.reason} />
      <input type="hidden" name={`selectedItems[${index}].resolution`} value={item.resolution} />
      <input type="hidden" name={`selectedItems[${index}].additionalInfo`} value={item.additionalInfo} />
    {/each}
    <div class="mb-6 py-2">
      <div class="flex items-center space-x-4">
        <input
          type="checkbox"
          bind:checked={selectAll}
          on:change={(e) => handleSelectAll(e.target.checked)}
          class="w-4 h-4"
          name="selectall"
          disabled={allProductsReturned}
        />
        <label for="selectall" class="font-medium">Select Entire Order</label>
        {#if allProductsReturned}
          <span class="text-2s text-red-600 ml-2">* All products in this order already have return requests</span>
        {/if}
      </div>
      {#if selectAll}
        <div class="ml-8 space-y-4" transition:slide>
          <div class="relative">
            <select
              name="reason"
              bind:value={entireOrderReason}
              class="w-full max-w-md p-2 border rounded">
              {#each entireOrderReasons as reason}
                <option value={reason.value} disabled={reason.disabled}>{reason.label}</option>
              {/each}
            </select> 
            {#if entireOrderReason}
              <div class="space-y-4" transition:slide>
                <h3 class="font-medium pt-4">How would you like this issue resolved?</h3>
                <div class="space-y-2">
                  {#each resolutionOptions as option}
                    <div class="flex items-center">
                      <input
                        type="radio"
                        name="entireOrderResolution"
                        value={option}
                        bind:group={entireOrderResolution}
                        class="mr-2"/>
                      <label for="">{option}</label>
                    </div>
                  {/each}
                </div>
                <textarea
                  bind:value={entireOrderInfo}
                  name="description"
                  placeholder="Additional Information"
                  required
                  class="w-full p-2 border rounded"
                  rows="4"/>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
    <div class="overflow-x-auto">
      <table class="w-full table-auto">
        <thead class="bg-white">
          <tr class="border-y hover:bg-gray-50">
            <th class="p-2 text-left">Select</th>
            <th class="p-2 text-left">Product Name</th>
            <th class="p-2 text-left">Quantity Shipped</th>
            <th class="p-2 text-left">Return Quantity</th>
            <th class="p-2 text-left">Return Reason</th>
          </tr>
        </thead>
        <tbody>
          {#each totalShipped as item, index}
            <tr class="border-b hover:bg-gray-50">
              <td class="p-4">
                {#if !selectAll && !returnedProductNumbers.has(item.productNumber)}
                  <input
                    type="checkbox"
                    checked={item.selected}
                    on:change={(e) => handleItemSelect(index, e.target.checked)}
                    class="w-4 h-4"
                  />
                {/if}
              </td>
              <td class="p-2">
                <span class="font-medium text-description">{truncateText(item.productName)}</span><br />
                <span class="text-xs">{item.manufacturerName}</span>
              </td>
              <td class="p-2">{item.orderQty}</td>
              <td class="p-2">
                <input
                  type="number"
                  min="1"
                  max={item.orderQty}
                  value={item.returnqty}
                  on:input={(e) => updateItemField(index, 'returnqty', e.target.value)}
                  class="w-20 p-2 border rounded-md"
                  disabled={!item.selected && !selectAll}
                />
              </td>
              <td class="p-2">
                {#if !selectAll && item.selected}
                  <select
                    bind:value={item.reason}
                    on:change={(e) => updateItemField(index, 'reason', e.target.value)}
                    class="w-full p-2 rounded"
                    transition:slide>
                    {#each individualReasons as option}
                      <option value={option.value} disabled={option.disabled}>{option.label}</option>
                    {/each}
                  </select>
                {/if}
              </td>
            </tr>
            {#if !selectAll && item.selected && item.reason}
              <tr transition:slide>
                <td colspan="5" class="p-4 bg-gray-50">
                  <div class="space-y-4">
                    <h3 class="font-medium">How would you like this issue resolved?</h3>
                    <div class="space-y-2">
                      {#each resolutionOptions as option}
                        <div class="flex items-center">
                          <input
                            type="radio"
                            value={option}
                            bind:group={item.resolution}
                            on:change={(e) => updateItemField(index, 'resolution', e.target.value)}
                            class="mr-2"
                          />
                          <label for="">{option}</label>
                        </div>
                      {/each}
                    </div>
                    <textarea
                      value={item.additionalInfo}
                      on:input={(e) => updateItemField(index, 'additionalInfo', e.target.value)}
                      placeholder="Additional Information"
                      class="w-full p-2 border rounded"
                      rows="4"
                    />
                  </div>
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>

    <div class="mt-6 space-y-4">
      {#if selectedItems.length > 0}
        <div class="bg-gray-50 p-4 rounded">
          <h3 class="font-medium mb-2">Return Summary</h3>
          <ul class="space-y-2">
            {#each selectedItems as item}
              <li class="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                <div class="flex-1">
                  <span class="font-medium">{item.productName}</span>
                  <div class="text-sm text-gray-600">
                    <span>Returning {item.returnqty} of {item.orderQty} units</span>
                    {#if item.reason}
                      <span class="mx-2">•</span>
                      <span>Reason: {item.reason}</span>
                    {/if}
                    {#if item.resolution}
                      <span class="mx-2">•</span>
                      <span>Resolution: {item.resolution}</span>
                    {/if}
                    {#if item.additionalInfo}
                      <span class="mx-2">•</span>
                      <span>Additional Info: {item.additionalInfo}</span>
                    {/if}
                  </div>
                </div>
                <button
                  type="button"
                  class="ml-2 text-red-600 hover:text-red-800"
                  on:click={() => handleRemoveItem(item.productNumber)}>
                  Remove
                </button>
              </li>
            {/each}
          </ul>  
          <div class="mt-4 p-3 bg-white rounded border">
            <h4 class="font-medium mb-2">Return Request Summary</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><span class="font-medium">Order Number:</span> {orderDetail.orderNumber}</p>
                <p><span class="font-medium">Invoice Number:</span> {orderDetail.invoiceNumber}</p>
                <p><span class="font-medium">Return Order ID:</span> {returnOrderId}</p>
              </div>
              <div>
                <p><span class="font-medium">Total Items Selected:</span> {selectedItems.length}</p>
                <p><span class="font-medium">Total Units to Return:</span> {selectedItems.reduce((sum, item) => sum + Number(item.returnqty), 0)}</p>
              </div>
            </div>
          </div>
        </div>
      {/if}     
      <div class="flex justify-between items-center">
        <button
          type="button"
          class="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-50 transition-colors duration-200"
          on:click={() => {
            selectAll = false;
            handleSelectAll(false);
            selectedItems = [];
            totalShipped = totalShipped.map(item => ({
              ...item,
              selected: false,
              returnqty: "",
              reason: "",
              resolution: "",
              additionalInfo: ""
            }));
          }}>
          Clear All
        </button>
        <button
          type="submit"
          disabled={selectedItems.length === 0}
          class="px-6 py-2 bg-primary-500 text-white font-semibold rounded hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200">
          <!-- Submit Return Request ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}) -->
          Submit Return Request
        </button>
      </div>
    </div>
  </form>
  {#if filteredReturnStatus && filteredReturnStatus.length > 0}
    <section class="w-full mx-auto max-w-7xl shadow bg-white rounded my-6">
      <div class="mt-6 space-y-6">
        <div class="p-4 p">
          <h1 class="text-2xl font-bold text-heading">
            Return Order Status
          </h1>
          <h3 class="text-xl font-semibold text-heading mt-4">
            Items to Return
          </h3>
        </div>
        {#each filteredReturnStatus as item}
          <div class="border-t-8 border-t-gray-200 pt-4 overflow-x-auto">
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
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Description</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Return Issue</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Product Name</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Quantity</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Reason</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Return Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {#if Array.isArray(item.returnItems)}
                    {#each item.returnItems as returnItem}
                      <tr class="border-b">
                        <td class="px-4 py-2 text-sm text-description">{returnItem.description}</td>
                        <td class="px-4 py-2 text-sm text-description">{returnItem.issue}</td>
                        <td class="px-4 py-2 text-sm text-description">
                          <span class="font-semibold">{returnItem.productName}</span><br>
                          <span class="text-xs">{returnItem.productNumber}</span>
                        </td>
                        <td class="px-4 py-2 text-sm text-description">{returnItem.quantity}</td>
                        <td class="px-4 py-2 text-sm text-description">{returnItem.reason}</td>
                        <td class="px-4 py-2 text-sm text-description">{returnItem.returnqty}</td>
                      </tr>
                    {/each}
                  {:else if item.returnItems.selectedItems}
                    {#each item.returnItems.selectedItems as returnItem}
                      <tr class="border-b">
                        <td class="px-4 py-2 text-sm text-description">{returnItem.additionalInfo || "N/A"}</td>
                        <td class="px-4 py-2 text-sm text-description">{returnItem.resolution}</td>
                        <td class="px-4 py-2 text-sm text-description">
                          <span class="font-semibold">{returnItem.productName}</span><br>
                          <span class="text-xs">{returnItem.productNumber}</span>
                        </td>
                        <td class="px-4 py-2 text-sm text-description">{returnItem.orderQty}</td>
                        <td class="px-4 py-2 text-sm text-description">{returnItem.reason}</td>
                        <td class="px-4 py-2 text-sm text-description">{returnItem.returnqty}</td>
                      </tr>
                    {/each}
                  {/if}
                </tbody>
              </table>
              <h4 class="text-xl font-semibold text-heading mt-6">Status Information</h4>
              <table class="min-w-full table-auto mt-4">
                <thead>
                  <tr class="bg-gray-50 border-b">
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Estimation Date</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Picked Date</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold text-heading">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="px-4 py-2 text-sm text-description">{item.status.estimation || "In Progress"}</td>
                    <td class="px-4 py-2 text-sm text-description">{item.status.picked || "In Progress"}</td>
                    <td class="px-4 py-2 text-sm text-description">{item.status.status || "In Progress"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <form method="POST" action="?/cancelreturn" use:enhance={({ cancel }) => {
              return async ({ result }) => {
                if (result.type === "success") {
                  showSuccessToast("Successfully deleted from Returns");
                  setTimeout(() => { location.reload(); }, 2000);
                } else {
                  showErrorToast("Error deleting return");
                }
                await applyAction(result);
              };
            }}>
              <input type="hidden" name="id" value={item._id} />
              <button type="submit" class="py-2 px-4 border-1 rounded my-4 mx-6 border-primary-500 hover:text-white hover:bg-primary-500">Cancel</button>
            </form>
          </div>
        {/each}
      </div>
    </section>
  {:else}
    <p class="text-center text-xs font-semibold mt-6 p-2 rounded border border-primary-200 text-red-600 shadow">
      You have not raised any query for returning order.
    </p>
  {/if}
</div>