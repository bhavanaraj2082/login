<script>
	import { authedUser } from '$lib/stores/mainStores.js';
	import { enhance } from '$app/forms';
	import AllOrders from './AllOrders.svelte';
	import Pending from './Pending.svelte';
	import Shipments from './Shipments.svelte';

	export let data;
	let order = data?.order;
	let recordId = data?.order?._id;
	let products = data?.order?.products || [];
	let shipedProducts = data?.order?.shipdetails || [];
	let orderDetails = data?.order?.orderdetails;
	let orderStatus;

	$: orderStatus = data?.order?.status;
	const user = $authedUser.email;

	const productDetails = products.map((product) => ({
		id: product._id,
		productName: product.productName,
		// prodDesc: product.prodDesc,
		imgSrc: product.imageSrc
	}));

	const shippedDetails = shipedProducts
		.filter((shipment) => shipment.status === 'Shipped' || shipment.status === 'Delivered')
		.map((shipment) => {
			return shipment.shipDetails.map((detail) => {
				return {
					invoice: shipment.invoice,
					shippedDate: shipment.shippedDate,
					id: detail.id,
					unitPrice: detail.price,
					quantity: detail.quantity,
					status: shipment.status,
					deliveryDate:
						shipment.status === 'Delivered' ? shipment.deliveredDate : shipment.estDeliveryDate
				};
			});
		})
		.flat();

	const orderedproduct = orderDetails.map((order) => {
		const product = productDetails.find((product) => product.id === order.productId);
		return {
			...order,
			...(product && {
				productName: product.productName,
				// prodDesc: product.prodDesc,
				imgSrc: product.imgSrc
			})
		};
	});
	const shippedQuantities = shippedDetails.reduce((acc, item) => {
		if (!acc[item.id]) {
			acc[item.id] = 0;
		}
		acc[item.id] += item.quantity;
		return acc;
	}, {});

	const remainingProducts = orderedproduct
		.map((product) => {
			const shippedQty = shippedQuantities[product.productId] || 0;
			const remainingQty = product.orderQty - shippedQty;

			if (remainingQty > 0) {
				return {
					imgSrc: product.imgSrc,
					productName: product.productName,
					unitPrice: product.unitPrice,
					productId: product.productId,
					remainingQuantity: remainingQty
				};
			}
			return null;
		})
		.filter((item) => item !== null);

	function formatDate(dateString) {
		const date = new Date(dateString);
		const options = {
			weekday: 'long',
			day: 'numeric',
			month: 'short'
		};
		if (isNaN(date.getTime())) {
			return '--';
		}
		return date.toLocaleDateString('en-US', options);
	}

	let isAllActive = true;
	let isShippedActive = false;
	let isPendingActive = false;

	const cancelOrder = () => {
		return async ({ result, update }) => {
			await update();
			showCancelPopup = false;
			console.log('result : ', result);
		};
	};

	let showCancelPopup = false;

	const showCancelConfirmation = () => {
		showCancelPopup = true;
	};

	const hideCancelPopup = () => {
		showCancelPopup = false;
	};
</script>

<div class="bg-white">
	<div class="max-w-7xl mx-auto">
		<div class="mx-4 sm:mx-6 lg:mx-20">
			<div class="flex flex-col sm:flex-row justify-between items-center pt-4">
				<h2 class="font-semibold text-lg my-2 text-gray-600 text-center sm:text-left">
					Items Order and Order Details
				</h2>
				{#if user}
					{#if orderStatus == 'pending'}
						<div>
							<button
								on:click={showCancelConfirmation}
								class="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1"
							>
								Cancel Order
							</button>
						</div>
					{/if}
					{#if orderStatus == 'pending cancellation'}
						<div class="my-2">
							<p class="text-red-500 text-sm md:text-lg font-semibold">
								Order Cancel Request Submited!
							</p>
						</div>
					{/if}
				{/if}
			</div>

			{#if showCancelPopup}
				<div class="fixed inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center z-50">
					<div class="bg-white rounded-sm p-5 shadow-lg w-80">
						<h2 class="text-lg text-heading font-semibold">Cancel Order</h2>
						<p class="mt-2 text-sm text-description">Are you sure you want to cancel this order?</p>
						<div class="flex justify-end mt-4">
							<button
								on:click={hideCancelPopup}
								class="mr-2 bg-gray-300 text-white rounded px-4 py-2"
							>
								Close
							</button>
							<div>
								<form method="POST" action="?/cancelOrder" use:enhance={cancelOrder}>
									<input type="hidden" name="recordId" value={recordId} />
									<input type="hidden" name="status" value="pending cancellation" />
									<button type="submit" class="bg-red-500 text-white rounded px-4 py-2">
										Yes, cancel
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<div
				class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 bg-gray-100 border border-gray-200 rounded-lg pl-6 py-3 sm:p-6"
			>
				<div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
					<div class="text-sm font-semibold text-gray-500">Order ID:</div>
					<p class="text-sm font-medium text-heading">
						{order.ordernumber || '--'}
					</p>
				</div>

				<div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
					<div class="text-sm font-medium text-gray-500">Items:</div>
					<p class="text-sm font-semibold text-heading">
						{order.products.length || '--'}
					</p>
				</div>

				<div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
					<div class="text-sm font-semibold text-gray-500">Total:</div>
					<p class="text-sm font-medium text-heading">
						&#8377; {order.totalprice.toFixed(3) || '--'}
					</p>
				</div>

				<div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
					<h1 class="text-sm font-semibold text-gray-500">Date:</h1>
					<p class="text-sm font-medium text-heading">
						{formatDate(order.createdAt)}
					</p>
				</div>

				<div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
					<h1 class="text-sm font-semibold text-gray-500">Status:</h1>
					<p class="text-sm font-medium text-heading capitalize">
						{orderStatus || '--'}
					</p>
				</div>
			</div>
			<div class="flex flex-col sm:flex-row gap-3 mt-6">
				<button
					class="px-6 py-2 border-1 font-semibold rounded-lg"
					class:bg-gray-200={isAllActive}
					on:click={() => {
						isAllActive = true;
						isShippedActive = false;
						isPendingActive = false;
					}}
				>
					All
				</button>
				<button
					class="px-3 py-2 border-1 font-semibold rounded-lg"
					class:bg-gray-200={isShippedActive}
					on:click={() => {
						isShippedActive = true;
						isAllActive = false;
						isPendingActive = false;
					}}
				>
					<p>
						Shipments
						<span class="ml-2 rounded-3xl px-2 bg-gray-100 text-primary-400">
							{shipedProducts.length}
						</span>
					</p>
				</button>
				<button
					class="px-3 py-2 border-1 font-semibold rounded-lg"
					class:bg-gray-200={isPendingActive}
					on:click={() => {
						isPendingActive = true;
						isAllActive = false;
						isShippedActive = false;
					}}
				>
					<p>Pending</p>
				</button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
				{#if isAllActive}
					<AllOrders {orderedproduct} {orderStatus} />
				{:else if isShippedActive}
					<Shipments {data} />
				{:else}
					<Pending {remainingProducts} />
				{/if}

				<div>
					<div class="mt-3">
						<h2 class="text-sm font-semibold mb-2 text-gray-600">Order Summary</h2>
						<div class="mb-4 px-4 py-4 rounded-lg border-1 border-gray-200 flex flex-col gap-1">
							<div class="flex justify-between">
								<p class="text-gray-500 text-sm font-medium">Subtotal:</p>
								<p class="text-heading text-sm font-semibold">
									&#8377; {order.subtotalprice.toFixed(3) || '0.00'}
								</p>
							</div>
							<div class="flex justify-between mb-2">
								<p class="text-gray-500 text-sm font-medium">Shipping Charge:</p>
								<p class="text-heading text-sm font-semibold">
									&#8377; {order.shippingprice.toFixed(3) || '0.00'}
								</p>
							</div>
							<hr />
							<div class="flex justify-between mt-2">
								<p class="text-gray-500 text-sm font-medium">Total:</p>
								<p class="text-heading text-sm font-semibold">
									&#8377; {order.totalprice.toFixed(3) || '0.00'}
								</p>
							</div>
						</div>

						<div class="mb-6">
							<h1 class="font-semibold mb-2 text-sm text-gray-600">Delivary Address</h1>
							<div class=" rounded-lg py-3 px-3 border-1 text-gray-500">
								<p class="font-medium text-sm text-gray-500">
									{order.deliveryaddress || '--'}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
