<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { authedUser } from '$lib/stores/mainStores.js';
	import Icon from '@iconify/svelte';
	import { onMount, createEventDispatcher } from 'svelte';
	import { cartState, updateCartState } from '$lib/stores/cartStores.js';
	import jsPDF from 'jspdf';
	import { toast } from 'svelte-sonner';
	import 'jspdf-autotable';
	import { page } from '$app/stores';
	const dispatch = createEventDispatcher();

	// let authedUser={
	// 	email:""
	// }

	let timestamp;
	let loading = true;
	$: console.log($cartState);

	$: cartItems = $cartState;
	let subtotal = 0;
	let tax = 0;
	let total = 0;
	let totalPrice = 0;
	let order = '';

	let showModal = false;

	const toggleModal = () => {
		showModal = !showModal;
	};

	$: if (!$cartState.length) {
		subtotal = 0;
		totalPrice = 0;
		tax = 0;
		total = 0;
		subtotal = 0;
	}

	const generatePDFDocument = () => {
		const total = $cartState.reduce(
			(sum, item) => sum + parseFloat(item.priceSize.price) * item.quantity,
			0
		);
		const doc = new jsPDF();

		doc.setFontSize(18);
		doc.text('Chemikart Cart Summary', 14, 20);

		doc.setFont('helvetica');

		const tableColumns = ['Products', 'Price', 'Quantity', 'Total'];
		const tableData = $cartState.map((item) => [
			`${item.partNumber}\n${item.name}\n${item.priceSize.size}`,
			`${parseFloat(item.priceSize.price)}`, // Use the ₹ symbol here
			`${item.quantity}`,
			`${parseFloat(item.priceSize.price) * item.quantity}` // Use the ₹ symbol for total as well
		]);

		tableData.push(['Total Price', '', '', `${total}`]);

		doc.autoTable({
			head: [tableColumns],
			body: tableData,
			startY: 30,
			margin: { top: 10 },
			styles: {
				fontSize: 12,
				cellPadding: 5,
				halign: 'left',
				lineWidth: 0
			},
			headStyles: {
				fillColor: [255, 229, 204],
				textColor: [0, 0, 0],
				fontSize: 12,
				cellPadding: 5
			},
			theme: 'striped',
			tableLineWidth: 0,
			tableLineColor: [255, 255, 255],
			rowStyles: (rowIndex) => ({
				fillColor: rowIndex % 2 === 0 ? [245, 245, 245] : [255, 255, 255]
			})
		});

		return doc;
	};

	const downloadPDF = () => {
		const doc = generatePDFDocument();
		doc.save('cart-summary.pdf');
	};

	const printPDF = () => {
		const doc = generatePDFDocument();
		doc.autoPrint();
		window.open(doc.output('bloburl'), '_blank');
	};

	const functionDispatch = () => {
		let expireTime = 12 * 60 * 60 * 1000;
		if (!$cartState.length) {
			console.log('cart empty');
			return;
		}
		if (browser) {
			timestamp = browser ? JSON.parse(localStorage.getItem('cartTimeStamp')) : null;

			if (timestamp === null) {
				timestamp = Date.now();
				localStorage.setItem('cartTimeStamp', timestamp);
			}
			if (Date.now() > timestamp + expireTime) {
				console.log('items has expired');
				dispatch('onCart', { isExpired: true });
			} else {
				dispatch('onCart', { isExpired: false });
				console.log('item is still valid');
			}
		}
	};

	const calculateTotals = () => {
		subtotal = cartItems.reduce(
			(sum, item) => sum + parseFloat(item.priceSize.price) * parseInt(item.quantity),
			0
		);
		tax = subtotal * 0;
		total = subtotal + tax;

		let ordernumber = Math.floor(Math.random() * 900000) + 100000;
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
			ordernumber,
			invoice: 0,
			totalprice: total,
			subtotalprice: subtotal,
			shippingprice: tax,
			products,
			orderdetails,
			status: 'pending',
			dashuserprofileid: $authedUser.userId
		};
	};

	const incrementQuantity = (size, id) => {
		const index = cartItems.findIndex((item) => item.priceSize.size === size && item.id === id);
		if (index !== -1) {
			cartItems[index].quantity += 1;
			cartItems = [...cartItems];
			updateCartState(cartItems);
			calculateTotals();
		}
	};

	const decrementQuantity = (size, id) => {
		const index = cartItems.findIndex((item) => item.priceSize.size === size && item.id === id);
		if (index !== -1 && cartItems[index].quantity > 1) {
			cartItems[index].quantity -= 1;
			cartItems = [...cartItems];
			updateCartState(cartItems);
			calculateTotals();
		}
	};

	const removeItem = (size, id) => {
		cartItems = cartItems.filter((item) => !(item.id === id && item.priceSize.size === size));
		console.log('remove item', cartItems);
		updateCartState(cartItems);
		calculateTotals();
	};

	const emptyCart = () => {
		cartItems = [];
		subtotal = 0;
		totalPrice = 0;
		tax = 0;
		total = 0;
		subtotal = 0;
		updateCartState(cartItems);
	};

	function setRedirectUrl() {
		const currentUrl = $page.url.href;
		document.cookie = `redirectUrl=${encodeURIComponent(currentUrl)}; path=/;`;
	}

	onMount(() => {
		calculateTotals();
		functionDispatch();
		loading = false;
	});
</script>

<div class="mx-auto bg-gray-50">
	<!-- Main Cart Section -->
	<div class=" flex flex-col xl:flex-row justify-between gap-6">
		{#if loading}
			<div
				class="w-full h-72 flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white p-4 rounded shadow-md"
			>
				<p class=" font-medium text-lg md:text-xl xl:text-2xl">Loading...</p>
			</div>
			<!-- Left Side: Cart Items -->
		{:else if !$cartState.length || $cartState === null}
			<div
				class="w-full h-72 flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white p-4 rounded shadow-md"
			>
				<Icon icon="typcn:shopping-cart" class="text-5xl text-primary-500 md:text-8xl" />
				<p class=" font-bold text-lg md:text-xl xl:text-2xl">Cart is Empty</p>
			</div>
		{:else}
			<div class="w-full lg:w-4/4 xl:w-3/4 bg-white px-6 py-4 rounded-lg shadow-md h-fit">
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
									<p class="text-sm text-red-500 font-semibold">{item.partNumber}</p>
									<p class=" text-gray-800">{item.name}</p>
									<p class=" text-gray-800 text-sm font-semibold">{item.priceSize.size}</p>
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
								<div class="flex items-center border-1 rounded">
									<button
										on:click={() => decrementQuantity(item.priceSize.size, item.id)}
										class=" border-r-1 p-2.5 text-primary-500"
										><Icon icon="rivet-icons:minus" class="text-sm" /></button
									>
									<p class="w-fit mx-3 text-sm font-medium outline-none text-center">
										{item.quantity}
									</p>
									<button
										on:click={() => incrementQuantity(item.priceSize.size, item.id)}
										class=" border-l-1 p-2.5 text-primary-500"
										><Icon icon="rivet-icons:plus" class="text-sm" /></button
									>
								</div>
							</div>

							<!-- Total Price & Delete Icon -->
							<h3 class=" lg:hidden mt-3 text-sm">Total</h3>
							<div class=" w-full lg:w-2/12 flex justify-between items-center">
								<p class="text-md font-semibold">
									₹{(parseFloat(item.priceSize.price) * item.quantity).toFixed(2)}
								</p>
								<button
									type="button"
									on:click={() => removeItem(item.priceSize.size, item.id)}
									class=" text-lg text-primary-600"
								>
									<Icon icon="fluent-mdl2:delete" class=" text-2xl" />
								</button>
							</div>
						</li>
					{/each}
				</ul>
				<button
					type="button"
					on:click={emptyCart}
					class="mt-4 text-sm w-32 sm:w-36 md:w-40 lg:w-48 py-2 rounded text-white bg-primary-500 hover:bg-primary-600 font-semibold"
					>Clear Cart</button
				>
			</div>
		{/if}

		<!-- Right Side: Order Summary -->
		<div class="w-full lg:w-2/4 xl:w-1/4 self-end xl:self-start bg-white p-4 rounded-lg shadow-md">
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
				<div class="mt-4 grid grid-cols-2 gap-2">
					{#if $authedUser.email}
						<a
							href="/checkout"
							class="mt-4 w-full text-center bg-primary-500 text-white py-2 rounded-lg font-semibold col-span-2 hover:bg-primary-600"
						>
							Checkout</a
						>
					{:else}
						<button
							type="button"
							on:click={toggleModal}
							class="flex col-span-2 items-center justify-center gap-2 bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 py-2 rounded font-semibold"
						>
							Checkout
						</button>
					{/if}

					<!-- Download Button -->
					<button
						type="button"
						on:click={downloadPDF}
						class="flex items-center justify-center gap-2 bg-white text-primary-500 border border-primary-500 py-2 rounded font-semibold hover:bg-primary-100"
					>
						Download
					</button>

					<!-- Print Button -->
					<button
						type="button"
						on:click={printPDF}
						class="flex items-center justify-center gap-2 bg-white text-primary-500 border border-primary-500 py-2 rounded font-semibold hover:bg-primary-100"
					>
						Print
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
{#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
		<div class="bg-white p-6 rounded-lg w-1/3">
			<p class="text-xl font-bold mb-2">Please Log In</p>
			<p class="text-sm mb-4">You need to log in to continue. Click the button below to log in.</p>
			<div class="flex gap-4 justify-between">
				<button
					class=" text-gray-500 border bottom-2 py-2 px-4 rounded hover:bg-gray-300"
					on:click={toggleModal}
				>
					Cancel
				</button>
				<a href="/login" on:click={setRedirectUrl} class="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-700">
					Login
				</a>
			</div>
		</div>
	</div>
{/if}
