<script>
  export let returndata;

  function formatAddress(address) {
    if (!address) return "N/A"; 
    const {
      addressLine1,
      addressLine2,
      city,
      state,
      zip
    } = address;;
    return `${addressLine1 || "N/A"}${addressLine2 ? `, ${addressLine2}` : ""}, ${city || "N/A"}, ${state || "N/A"} ${zip || "N/A"}`;
  }

  let orderDetail = {
    profileName: returndata?.dashuserprofileid?.firstName || "N/A",
    invoiceNumber: returndata?.invoice || "N/A",
    orderid: returndata?.ordernumber || "N/A",
    invoiceDate: new Date(returndata?.createdAt).toLocaleDateString() || "N/A",
    orderDate: new Date(returndata?.createdAt).toLocaleDateString() || "N/A",
    address: formatAddress(returndata?.dashuserprofileid?.shippingAddress),
    products: returndata?.orderdetails || [],
    status: returndata?.status || "N/A"
  };
</script>

<div class="relative w-full md:w-11/12 mx-auto max-w-7xl">
  <div class="top-0 left-0">
    <h1 class="text-2xl font-bold mb-6 text-left">Invoice Details</h1>
  </div>
  <div class="bg-white p-4 rounded mt-4">
    <div class="flex pl-2 flex-col">
      <h1 class="text-lg font-medium">Hey, {orderDetail.profileName}</h1>
      <p class="pt-2">Your order details</p>
    </div>
    <div class="grid pt-4 md:grid-cols-2 gap-4 grid-cols-1">
      <div>
        <p class="p-2"><strong>Invoice Number:</strong> {orderDetail.invoiceNumber}</p>
        <p class="p-2"><strong>Invoice Date:</strong> {orderDetail.invoiceDate}</p>
      </div>
      <div>
        <p class="p-2"><strong>Order Date:</strong> {orderDetail.orderDate}</p>
        <p class="p-2"><strong>Purchase Order Number:</strong> {orderDetail.orderid}</p>
        <p class="p-2"><strong>Delivery Address:</strong> {orderDetail.address}</p>
      </div>
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-medium">Ordered Products</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {#each orderDetail.products as product}
          <div class="bg-primary-50 border-primary-400 p-4 rounded">
            <p><strong>Product Name:</strong> {product.productName}</p>
            <p><strong>Product Number:</strong> {product.productNumber}</p>
            <p><strong>Quantity Ordered:</strong> {product.orderQty}</p>
            <p><strong>Unit Price:</strong> ${product.unitPrice.toFixed(2)}</p>
            <p><strong>Extended Price:</strong> ${product.extendedPrice.toFixed(2)}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
