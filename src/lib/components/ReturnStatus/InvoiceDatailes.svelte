<script>
  import Icon from '@iconify/svelte';
  export let returndata;
  // console.log('FE returnsdata', returndata);
  let viewMode = 'table'; 
  
  function toggleView(mode) {
    viewMode = mode;
  }
  
  const itemsPerPage = 6;
  let currentPage = 1;

  const currencySymbols = {
    'INR': '₹',
    'USD': '$',
  };

  function getCurrencySymbol(currencyCode) {
    return currencySymbols[currencyCode] || currencyCode;
  }
  
  function truncateText(text, maxLength = 25) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  
  $: totalPages = Math.ceil((orderDetail.products?.length || 0) / itemsPerPage);
  $: paginatedProducts = orderDetail.products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
    }
  }
  
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }
  
  function formatAddress(address) {
    if (!address) return "--";
    
    if (typeof address === 'string') {
      const parts = address.split(',').map(part => part.trim());
      
      if (parts.length >= 6) {
        const [name1, name2, city, state, country, postalcode] = parts;
        return `${name1} ${name2}<br />
                ${city}, ${state}<br />
                ${country}, ${postalcode}`;
      }
      
      return parts.join('<br />');
    }
    
    const fullName = `${address?.address || ""} ${address?.address2 || ""}`.trim();
    const cityState = `${address?.city || "N/A"}, ${address?.state || "N/A"}`;
    const countryPostal = `${address?.country || "N/A"}, ${address?.postalcode || "N/A"}`;
    
    return `${fullName}<br />
            ${cityState}<br />
            ${countryPostal}`;
  }

  const currencySymbol = getCurrencySymbol(returndata?.currency || 'INR');
  
  let orderDetail = {
    profileName: returndata?.profileId?.firstName || "N/A",
    invoiceNumber: returndata?.invoice || "N/A",
    orderid: returndata?.orderid || "N/A",
    invoiceDate: new Date(returndata?.createdAt).toLocaleDateString() || "N/A",
    orderDate: new Date(returndata?.createdAt).toLocaleDateString() || "N/A",
    address: formatAddress(returndata?.shippingaddress),
    products: returndata?.orderdetails || [],
    status: returndata?.status || "N/A"
  };

  function statusStyles(status) {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'pending cancellation':
        return 'bg-red-100 text-red-600 border border-red-100';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'received':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

function statusIcon(status) {
  switch (status) {
    case 'pending':
      return 'ri:time-line';
    case 'canceled':
      return 'ri:close-circle-line';
    case 'pending cancellation':
      return 'fluent:calendar-cancel-20-regular';
    case 'shipped':
      return 'la:shipping-fast';
    case 'received':
      return 'ri:checkbox-circle-line';
    default:
      return 'ri:question-line';
  }
}
</script>

<div class="relative w-full mb-1 md:w-11/12 mx-auto max-w-7xl">
  <div class="flex items-center justify-between mb-6 mx-2">
    <h1 class="text-2xl font-bold text-gray-800">Invoice Details</h1>
    <div class="text-sm text-gray-500">Status: 
      <span class={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${statusStyles(orderDetail?.status)}`}>
        <Icon icon={statusIcon(orderDetail.status)} width="16" height="16" />
        {orderDetail?.status.charAt(0).toUpperCase() + orderDetail?.status.slice(1)}
      </span>
    </div>
  </div>
  <div class="bg-white p-4 rounded mt-4 shadow">
    <div class="flex pl-2 flex-col">
      <h1 class="text-lg font-medium">Hey, {orderDetail?.profileName}</h1>
      <p class="pt-2">Your order details</p>
    </div>
    <div class="grid pt-4 md:grid-cols-2 gap-4 grid-cols-1">
      <div>
        <p class="p-2"><strong>Invoice Number:</strong> {orderDetail?.invoiceNumber}</p>
        <p class="p-2"><strong>Invoice Date:</strong> {orderDetail?.invoiceDate}</p>
      </div>
      <div>
        <p class="p-2"><strong>Order Date:</strong> {orderDetail?.orderDate}</p>
        <p class="p-2"><strong>Purchase Order Number:</strong> {orderDetail?.orderid}</p>
        <p class="p-2"><strong>Delivery Address:</strong> {@html orderDetail?.address}</p>
      </div>
    </div>
    <div class="mt-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-medium">Ordered Products</h2>
        <div class="flex space-x-2">
          <button 
            class={`px-1.5 py-1.5 rounded flex items-center ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
            on:click={() => toggleView('grid')}>
            <Icon icon="ic:round-grid-view" width="16" height="16" class="font-bold" />
          </button>
          <button 
            class={`px-1.5 py-1.5 rounded flex items-center ${viewMode === 'table' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
            on:click={() => toggleView('table')}>
            <Icon icon="material-symbols-light:menu" width="16" height="16" class="font-bold" />
          </button>
        </div>
      </div>
      {#if viewMode === 'grid'}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {#each paginatedProducts as product}
          <div class="bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow">
            <div class="mb-2">
              <p class="text-xs font-medium"><strong class="mr-1 p-1">Product Name:</strong> 
                <span title={product.productName}>{truncateText(product?.productName, 50)}</span>
              </p>
            </div>
            <p class="text-xs"><strong class="mr-1 p-1">Manufacturer:</strong> {truncateText(product?.manufacturerName, 20)}</p>
            <p class="text-xs"><strong class="mr-1 p-1">Quantity:</strong> {product?.orderQty}</p>
            <p class="text-xs"><strong class="mr-1 p-1">Unit Price:</strong> {currencySymbol} {product?.unitPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
            <p class="text-xs"><strong class="mr-1 p-1">Extended Price:</strong> {currencySymbol} {product?.extendedPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
            {#if product.backOrder > 0}
              <p class="text-xs text-amber-600"><strong class="mr-1 p-1">Back Order:</strong> {product?.backOrder || 0 }</p>
            {/if}
            <p class="text-xs mt-2">
              <span class={product.readyToShip ? "text-green-600 font-medium px-2 py-1 text-xs rounded-full bg-green-100" : "px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-600 font-medium"}>
                {product.readyToShip ? "Ready to Ship" : "Not Ready to Ship"}
              </span>
            </p>
          </div>
          {/each}
        </div>
      {:else}
        <div class="overflow-x-auto scroll mt-4">
          <table class="min-w-full divide-y divide-gray-200 whitespace-nowrap">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Extended Price</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each paginatedProducts as product}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-xs">
                  <div title={product?.productName} class="max-w-xs">
                    {truncateText(product?.productName, 25)}
                  </div>
                </td>
                <td class="px-6 py-4 text-xs">{truncateText(product?.manufacturerName, 20)}</td>
                <td class="px-6 py-4 text-xs text-center">
                  {product?.orderQty}
                  {#if product.backOrder > 0}
                    <span class="text-amber-600 text-2s ml-1">({product.backOrder} back ordered)</span>
                  {/if}
                </td>
                <td class="px-6 py-4 text-xs text-center">{currencySymbol} {product.unitPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                <td class="px-6 py-4 text-xs text-center">{currencySymbol} {product.extendedPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                <td class="px-6 py-4 text-xs flex justify-center">
                  <span class={product.readyToShip ? "px-2 py-1 text-xs rounded-full bg-green-100 text-green-800" : "px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800"}>
                    {product.readyToShip ? "Ready to Ship" : "Not Ready"}
                  </span>
                </td>
              </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
      {#if totalPages > 1}
        <div class="flex items-center sm:justify-between justify-center mt-4">
          <div class="text-sm text-gray-700 sm:block hidden">
            Showing <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to 
            <span class="font-medium">{Math.min(currentPage * itemsPerPage, orderDetail.products.length)}</span> of 
            <span class="font-medium">{orderDetail.products.length}</span> products
          </div>
          <div class="flex space-x-2">
            <button 
              on:click={prevPage} 
              disabled={currentPage === 1}
              class={`px-1.5 py-1 rounded-md active:scale-95 ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed' : 'bg-primary-600 text-white border border-gray-300 hover:bg-primary-700'}`}>
            <Icon icon="charm:chevron-left" class="w-4 h-4" />
            </button>
            <span class="px-2 py-1 text-sm">Page {currentPage} of {totalPages}</span>
            <button 
              on:click={nextPage} 
              disabled={currentPage === totalPages}
              class={`px-1.5 py-1 rounded-md active:scale-95 ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed' : 'bg-primary-600 text-white border border-gray-300 hover:bg-primary-700'}`}>
            <Icon icon="charm:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>