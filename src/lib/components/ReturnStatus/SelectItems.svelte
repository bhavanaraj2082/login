<script>
  import { fade, slide } from "svelte/transition";
  import { enhance, applyAction } from "$app/forms";

  export let data;
  let returndata= data?.returndata
  let filteredReturnStatus=data?.returnstatus
  export let items;

  let orderDetail = {
    invoiceNumber: returndata?.invoice || "N/A",
    orderid: returndata?.ordernumber || "N/A",
  };

  // let filteredReturnStatus = returnstatus.filter(
  //   (item) => String(item.records.invoice) === String(returndata)
  // );


  let selectAll = false;
  let entireOrderReason = "";
  let entireOrderResolution = "";
  let entireOrderInfo = "";
  let selectedItems = [];
  let returnedProductNumbers = new Set();
  let successMessage = "";
  let errorMessage = "";
  let totalShipped = [];
  let returnOrderId = generateReturnOrderId();

  function generateReturnOrderId() {
    return `${Math.floor(100000 + Math.random() * 900000)}`;
  }

  // filteredReturnStatus.forEach((item) => {
  //   item.returnItems.forEach((returnItem) => {
  //     returnedProductNumbers.add(returnItem.productNumber);
  //   });
  // });

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

  function handleItemSelect(index, isChecked, value, field) {
    const newTotalShipped = [...totalShipped];
    const currentItem = { ...newTotalShipped[index] };

    if (field) {
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

    if (currentItem.selected) {
      const newItem = {
        productNumber: currentItem.productNumber,
        productName: currentItem.productName,
        orderQty: currentItem.orderQty,
        returnqty: currentItem.returnqty,
        reason: currentItem.reason,
        resolution: currentItem.resolution,
        additionalInfo: currentItem.additionalInfo,
        price: currentItem.price
      };

      const existingIndex = selectedItems.findIndex(
        item => item.productNumber === currentItem.productNumber
      );

      if (existingIndex >= 0) {
        selectedItems[existingIndex] = newItem;
      } else {
        selectedItems = [...selectedItems, newItem];
      }
    } else {
      selectedItems = selectedItems.filter(
        item => item.productNumber !== currentItem.productNumber
      );
    }
  }

  function updateItemField(index, field, value) {
    const newTotalShipped = [...totalShipped];
    const currentItem = { ...newTotalShipped[index] };
    
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
        showDetails: false,  // Don't show individual details when selecting all
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

    selectedItems = selectedItems.map(item => ({
      ...item,
      reason: entireOrderReason,
      resolution: entireOrderResolution,
      additionalInfo: entireOrderInfo
    }));
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

  const handleSubmit = ({ cancel }) => {
    if (!selectedItems.length) {
      errorMessage = "Please select at least one return component";
      cancel();
      setTimeout(() => (errorMessage = ""), 3000);
      return;
    }

    const hasInvalidItems = selectedItems.some(
      item => !item.reason || !item.resolution || !item.returnqty
    );

    if (hasInvalidItems) {
      errorMessage = "Please fill in all required fields for selected items";
      cancel();
      setTimeout(() => (errorMessage = ""), 3000);
      return;
    }

    return async ({ result }) => {
      if (result.status === 200) {
        successMessage = "Successfully added to Returns";
        errorMessage = "";
        setTimeout(() => {
          successMessage = "";
          location.reload();
        }, 3000);
      } else {
        successMessage = "";
        errorMessage = "Error adding to Returns";
        setTimeout(() => (errorMessage = ""), 3000);
      }
      await applyAction(result);
    };
  }; 
  let cancelSuccessMessage = "";
  let cancelErrorMessage = "";
</script>

<div class="w-full md:w-11/12 rounded mx-auto my-3 max-w-7xl">
  <form
    class="rounded p-6 bg-white"
    method="POST"
    action="?/returns"
    use:enhance={handleSubmit}>
    <input type="hidden" name="orderNumber" value={orderDetail.orderid} />
    <input type="hidden" name="invoiceNumber" value={orderDetail.invoiceNumber} />
    <input type="hidden" name="returnOrderId" value={returnOrderId} />
    
    {#each selectedItems as item, index}
      <input type="hidden" name={`selectedItems[${index}].productNumber`} value={item.productNumber} />
      <input type="hidden" name={`selectedItems[${index}].productName`} value={item.productName} />
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
        />
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
                        class="mr-2"
                      />
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
              <span class="font-semibold">{item.productName}</span><br />
              <span class="text-xs">{item.productNumber}</span>
            </td>
            <td class="p-2">{item.orderQty}</td>
            <td class="p-2">
              <input
                type="number"
                min="1"
                max={item.orderQty}
                value={item.returnqty}
                on:input={(e) => handleItemSelect(index, true, e.target.value, 'returnqty')}
                class="w-20 p-2 border rounded-md"
                disabled={!item.selected && !selectAll}
              />
            </td>
            <td class="p-2">
              {#if !selectAll && item.selected}
                <select
                  bind:value={item.reason}
                  on:change={(e) => handleItemSelect(index, true, e.target.value, 'reason')}
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
                          on:change={(e) => handleItemSelect(index, true, e.target.value, 'resolution')}
                          class="mr-2"
                        />
                        <label for="">{option}</label>
                      </div>
                    {/each}
                  </div>
                  <textarea
                    value={item.additionalInfo}
                    on:input={(e) => handleItemSelect(index, true, e.target.value, 'additionalInfo')}
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
                  on:click={() => {
                    const index = totalShipped.findIndex(
                      i => i.productNumber === item.productNumber
                    );
                    if (index >= 0) {
                      handleItemSelect(index, false);
                    }
                  }}>
                  Remove
                </button>
              </li>
            {/each}
          </ul>  
          <div class="mt-4 p-3 bg-white rounded border">
            <h4 class="font-medium mb-2">Return Request Summary</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><span class="font-medium">Order Number:</span> {orderDetail.orderid}</p>
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

        {#if successMessage}
        <div class="bg-green-100 text-green-700 p-3 rounded mb-4" transition:fade>
          {successMessage}
        </div>
      {/if}
      
      {#if errorMessage}
        <div class="bg-red-100 text-red-700 p-3 rounded mb-4" transition:fade>
          {errorMessage}
        </div>
      {/if}
      
        <button
          type="submit"
          disabled={selectedItems.length === 0}
          class="px-6 py-2 bg-primary-500 text-white font-semibold rounded hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200">
          Submit Return Request ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'})
        </button>
      </div>
    </div>
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
        <div class="border-t-8 border-t-gray-200 pt-4">
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

            <!-- Items Table -->
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

            <!-- Status Table -->
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

          <!-- Cancel Form -->
          <form method="POST" action="?/cancelreturn" use:enhance={({ handleCancelReturn }) => {
            if (!filteredReturnStatus.length) {
              cancelErrorMessage = "Please select the return component";
              setTimeout(() => { cancelErrorMessage = ""; }, 3000);
              handleCancelReturn();
            }
            return async ({ result }) => {
              if (result.type === "success") {
                cancelSuccessMessage = "Successfully deleted from Returns";
                cancelErrorMessage = "";
                setTimeout(() => { cancelSuccessMessage = ""; location.reload(); }, 2000);
              } else {
                cancelSuccessMessage = "";
                cancelErrorMessage = "Error deleting return";
                setTimeout(() => { cancelErrorMessage = ""; }, 3000);
              }
              await applyAction(result);
            };
          }}>
            <input type="hidden" name="id" value={item._id} />
            <button type="submit" class="py-2 px-4 border-1 rounded my-4 mx-6 border-primary-500 hover:text-white hover:bg-primary-500">Cancel</button>
          </form>
        </div>
      {/each}

      <!-- Success/Error Messages -->
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