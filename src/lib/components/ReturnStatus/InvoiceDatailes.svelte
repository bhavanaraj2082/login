<script>
    export let data;
  //  console.log("your data",data)
    let orderDetail = {
      profileName: data.returndata.records.expand.dashuserprofileid.firstName || "N/A",
      invoiceNumber: data.returndata.records.Invoice || "N/A",
      orderid: data.returndata.records.ordernumber || "N/A",
      invoiceDate: new Date(data.returndata.records.created).toLocaleDateString(),
      orderDate: new Date(data.returndata.records.created).toLocaleDateString(),
      address: data.returndata.records.deliveryaddress || "N/A"
    };
    // console.log("OrderDetail",orderDetail)
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
  </div>
</div>
