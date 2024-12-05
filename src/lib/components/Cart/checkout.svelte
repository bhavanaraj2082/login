<script>
	import { sendMessage } from '$lib/utils.js';
	import { enhance } from '$app/forms';
	import { authedUser } from '$lib/stores/mainStores.js';
	import Icon from '@iconify/svelte';
	import { onMount, createEventDispatcher } from 'svelte';
	import { cartState } from '$lib/stores/cartStores.js';
	import { shippingAddress, billingAddress } from '$lib/stores/mainStores.js';

	export let data;
	const userData = data.profileData;
	let shipping = userData.shippingAddress;
	let billing = userData.billingAddress;

	function createAddressString(address) {
		if (!address) return '';
		return Object.values(address)
			.filter((field) => field && field.trim() !== '')
			.join(', ')
			.replace(/\s+/g, ' ')
			.trim();
	}

	let shippingAddressString = shipping ? createAddressString(shipping) : '';
	let billingAddressString = billing ? createAddressString(billing) : '';

	$: shippingAddress.set(shippingAddressString);
	$: billingAddress.set(billingAddressString);

	const dispatch = createEventDispatcher();

	// let authedUser = {
	//     email: "",
	// };

	let loading = true;
	$: cartItems = $cartState;
	let subtotal = 0;
	let tax = 0;
	let total = 0;
	let totalPrice = 0;
	let order = '';

	$: if (!$cartState.length) {
		subtotal = 0;
		totalPrice = 0;
		tax = 0;
		total = 0;
		subtotal = 0;
	}

	const calculateTotals = () => {
		subtotal = cartItems.reduce(
			(sum, item) => sum + parseFloat(item.priceSize.price) * parseInt(item.quantity),
			0
		);
		tax = subtotal * 0;
		total = subtotal + tax;

		// let ordernumber = Math.floor(Math.random() * 900000) + 100000;
		let products = [];
		let orderdetails = cartItems.map((item) => {
			const { id, name, partNumber, quantity, priceSize, stock } = item;
			const parsedPrice = parseFloat(priceSize.price);
			const parsedQty = parseInt(quantity);
			const parsedStock = parseInt(stock);

			products.push(id);
			totalPrice = parsedQty * parsedPrice;
			let backOrder = parsedQty > stock ? parsedQty - parsedStock : 0;
			let readyToShip = parsedQty < stock ? parsedQty : stock;
			return {
				productId: id,
				productName: name,
				productNumber: partNumber,
				orderQty: parsedQty,
				unitPrice: parsedPrice,
				backOrder,
				extendedPrice: totalPrice,
				readyToShip,
				supplierId: '',
				availableStock: parsedStock
			};
		});
		order = {
			// ordernumber,
			invoice: 0,
			totalprice: total,
			subtotalprice: subtotal,
			shippingprice: tax,
			products,
			orderdetails,
			status: 'pending'
			// dashuserprofileid: $authedUser.userId,
		};
	};

	onMount(() => {
		calculateTotals();
		loading = false;
	});

	const handlePayment = () => {
		console.log('clicked');
		dispatch('orderData', order);
	};
</script>

<div class="mx-auto w-full md:flex md:w-11/12 gap-6">
	<div class="md:w-8/12">
		<div class=" flex flex-col xl:flex-row justify-between gap-6">
			{#if loading}
				<div
					class="w-full h-72 flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white p-4 rounded shadow-md"
				>
					<p class=" font-medium text-lg md:text-xl xl:text-2xl">Loading...</p>
				</div>
			{:else if !$cartState.length || $cartState === null}
				<div
					class="w-full h-72 flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white p-4 rounded shadow-md"
				>
					<Icon icon="typcn:shopping-cart" class="text-5xl text-primary-500 md:text-8xl" />
					<p class=" font-bold text-lg md:text-xl xl:text-2xl">Cart is Empty</p>
				</div>
			{:else}
				<div class="w-full bg-white p-4 rounded-lg shadow-md h-fit mx-auto">
					<h2 class="text-xl mb-3 font-bold">
						Cart Items <span class="text-red-500">({cartItems.length})</span>
					</h2>

					<div class="hidden lg:flex text-gray-500 font-semibold mb-2">
						<p class=" w-6/12">Product</p>
						<p class=" w-2/12">Price</p>
						<p class=" w-2/12">Quantity</p>
						<p class=" w-2/12">Total</p>
					</div>

					<ul class="">
						{#each cartItems as item}
							<li class="flex flex-col lg:flex-row lg:items-center py-3 lg:py-5 border-b-1">
								<!-- Product Image and Details -->
								<h3 class=" lg:hidden mt-3 font-medium text-sm">Product</h3>
								<div class="flex items-center w-full md:w-6/12">
									<img src={item.image} alt={item.name} class="w-16 h-16 object-cover rounded-md" />
									<div class="ml-2">
										<p class="text-sm text-red-500 font-semibold">
											{item.partNumber}
										</p>
										<p class=" text-gray-800">{item.name}</p>
										<p class=" text-gray-800 text-sm font-semibold">
											{item.priceSize.size}
										</p>
									</div>
								</div>

								<!-- Price -->
								<h3 class=" lg:hidden mt-3 font-medium text-sm">Price</h3>
								<p class="text-md w-full md:w-2/12 font-semibold text-content">
									{item.priceSize.price}
								</p>

								<!-- Quantity Control -->
								<h3 class=" lg:hidden mt-3 font-medium text-sm">Quantity</h3>
								<div class="flex items-center w-60 md:w-2/12">
									<p class="w-fit mx-3 text-md font-medium outline-none text-center">
										{item.quantity}
									</p>
								</div>

								<!-- Total Price & Delete Icon -->
								<h3 class=" lg:hidden mt-3 text-sm">Total</h3>
								<div class=" w-full lg:w-2/12 flex justify-between items-center">
									<p class="text-md font-semibold">
										₹{(parseFloat(item.priceSize.price) * item.quantity).toFixed(2)}
									</p>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
		<div class="pt-6 pb-4 px-6 gap-3 bg-white mt-10 shadow-md rounded">
			<h3 class="text-xl font-bold text-gray-600">Address Selection</h3>
			<div class="flex gap-6">
				<div class=" w-full md:w-6/12">
					<label for="billing-address" class="block font-bold text-base my-2 text-gray-600"
						>Billing Address</label
					>
					<textarea
						id="billing-address"
						class="w-full mb-4 p-2 h-20 rounded border-gray-200 border"
						placeholder="Enter your billing address here..."
						bind:value={$billingAddress}
					/>
				</div>
				<div class="w-full md:w-6/12">
					<label for="shipping-address" class="block font-bold text-base my-2 text-gray-600"
						>Shipping Address</label
					>
					<textarea
						id="shipping-address"
						class="w-full p-2 h-20 rounded border-gray-200 border"
						placeholder="Enter your shipping address here..."
						bind:value={$shippingAddress}
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="md:w-4/12">
		<div class="mt-2 bg-white mx-auto p-4 rounded-lg shadow-md">
			<div>
				<h2 class="text-xl font-bold mb-4">Your Order</h2>
				<div class="space-y-2">
					<div class="flex justify-between text-lg">
						<p>Subtotal</p>
						<p>₹{subtotal.toFixed(2)}</p>
					</div>
					<div class="flex justify-between text-lg">
						<p>Tax</p>
						<p>₹{tax.toFixed(2)}</p>
					</div>
					<div class="flex justify-between text-lg font-bold">
						<p>Total</p>
						<p>₹{total.toFixed(2)}</p>
					</div>
				</div>
			</div>
			{#if $cartState.length}
				<div class=" mt-4 grid grid-cols-2 gap-2">
					{#if $authedUser.email}
						<form method="POST" class=" col-span-2">
							<input type="text" hidden />
							<button
								type="button"
								on:click={handlePayment}
								class="mt-4 w-full bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600"
							>
								Proceed to Payment
							</button>
						</form>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
