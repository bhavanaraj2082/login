<script>
	import Icon from '@iconify/svelte';
	import { authedUser } from '$lib/stores/mainStores.js';
	import { createEventDispatcher } from 'svelte';
	import * as XLSX from 'xlsx';

	export let data;
	let email = '';
	let products = data?.data || [];
	let filteredProducts = [];
	let selectedProduct = null;
	let jsonData = [];
	let searchQuery = '';
	let rows = [
		{ sku: '', size: '', quantity: 1, error: '', filteredProducts: [] },
		{ sku: '', size: '', quantity: 1, error: '', filteredProducts: [] },
		{ sku: '', size: '', quantity: 1, error: '', filteredProducts: [] }
	];
	let productError = '';
	let showCartMessage = false;
	let dropArea;
	let toggle = false;
	let showSavedCarts = false;
	let showRecentOrders = false;
	let showLists = false;
	let showquotes = false;
	let showDetailsModal = false;
	let invalidProducts = [];
	let fileError = '';

	function handleProductFilter(sku, index) {
		rows[index].filteredProducts = [];
		searchQuery = sku.trim();

		if (searchQuery === '') {
			rows[index].error = '';
			return;
		}

		const searchQueryNumber = Number(searchQuery);

		const matchedProducts = products.filter((product) =>
			product.productNumber.toString().includes(searchQueryNumber.toString())
		);

		rows[index].filteredProducts = matchedProducts;

		if (matchedProducts.length === 0) {
			rows[index].error = 'Invalid product number';
		} else {
			rows[index].error = '';
		}
	}

	function selectProduct(product, index) {
		rows[index].sku = `${product.productNumber}-${product.priceSize?.[0]?.size || ''}`;
		rows[index].size = product.priceSize?.[0]?.size || '';
		rows[index].filteredProducts = [];
		selectedProduct = product;
	}

	function clearSearch(index) {
		rows[index].sku = '';
		rows[index].filteredProducts = [];
		rows[index].error = '';
	}

	function incrementQuantity(index) {
		if (rows[index].quantity < 9999) {
			rows[index].quantity += 1;
		}
	}
	let userLoggedIn = false;

	function decrementQuantity(index) {
		if (rows[index].quantity > 1) {
			rows[index].quantity -= 1;
		}
	}
	$: {
		const user = $authedUser;
		userLoggedIn = user && user.email;
		email = user?.email || '';
	}

	function formatDate(date) {
		const options = { year: 'numeric', month: 'short', day: 'numeric' };
		return date.toLocaleDateString('en-IN', options);
	}

	function addToCart(rows, products) {
		let validRows = rows.filter((row) => row.sku.trim() !== '');

		let addCart = validRows
			.map((row) => {
				let sku = row.sku.trim();
				if (!sku) {
					return null;
				}

				let product = products.find(
					(product) => String(product.productNumber).trim() === sku.split('-')[0]
				);

				if (product) {
					return {
						productNumber: product.productNumber,
						productName: product.productName,
						priceSize: product.priceSize,
						quantity: row.quantity > 0 ? row.quantity : 1
					};
				} else {
					return null;
				}
			})
			.filter((item) => item !== null);

		if (addCart.length === 0) {
			return;
		}

		try {
			let currentCart = JSON.parse(localStorage.getItem('cartProducts')) || [];

			addCart.forEach((newItem) => {
				let existingItem = currentCart.find((item) => item.productNumber === newItem.productNumber);

				if (existingItem) {
					existingItem.quantity += newItem.quantity;
				} else {
					currentCart.push(newItem);
				}
			});

			localStorage.setItem('cartProducts', JSON.stringify(currentCart));
			cartProducts = currentCart;
		} catch (err) {
			console.error('Error saving to localStorage:', err);
		}

		showCartMessage = true;
		setTimeout(() => (showCartMessage = false), 3000);
	}
	function fetchRecentOrders() {
		if (userLoggedIn) {
			recentOrders = JSON.parse(localStorage.getItem('recentOrders')) || [];
		}
	}

	import { onMount } from 'svelte';
	onMount(() => {
		if (userLoggedIn) {
			fetchRecentOrders();
			cartProducts();
		}
	});
	function showDetails() {
		showDetailsModal = true;
	}

	function clearSelectedProduct(index) {
		rows[index].sku = '';
		rows[index].size = '';
		rows[index].filteredProducts = [];
		rows[index].error = '';

		selectedProduct = null;
	}
	function handleDrop(event) {
		event.preventDefault();
		const files = event.dataTransfer.files;
		if (files.length > 0) {
			handleFileUpload(files[0]);
		}
	}
	function handleDragOver(event) {
		event.preventDefault();
	}
	function handleFileInputChange(event) {
		const files = event.target.files;
		if (files.length > 0) {
			handleFileUpload(files[0]);
		}
	}

	function addRows() {
		let newRows = rows.slice(0, 5).map((row) => ({
			quantity: row.quantity,
			error: row.error
		}));
		rows = [...rows, ...newRows];
	}

	function cartProducts() {
		if (userLoggedIn) {
			cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
		}
	}
	async function handleFileUpload(selectedfile) {
		const file = selectedfile;
		fileError = '';
		cart = [];
		invalidProducts = [];

		if (file) {
			const reader = new FileReader();
			reader.onload = async (e) => {
				const data = new Uint8Array(e.target.result);
				const workbook = XLSX.read(data, { type: 'array' });
				const worksheet = workbook.Sheets[workbook.SheetNames[0]];

				try {
					jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

					const keys = jsonData[0];
					let newArr = jsonData.filter((x) => x.length !== 0);
					jsonData = newArr.slice(1).map((row) => {
						return row.reduce((obj, value, index) => {
							obj[keys[index]] = value;
							return obj;
						}, {});
					});

					const validationResponse = await validateProducts(jsonData);

					if (validationResponse) {
						cart = validationResponse.validProducts;
						invalidProducts = validationResponse.invalidProducts;
					}
				} catch (err) {
					fileError = 'Error parsing the file.';
				}
			};
			reader.readAsArrayBuffer(file);
		}
	}
	let recentOrders = [];
	function hideDetails() {
		showDetailsModal = false;
	}
	let currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + 7);
	let estimatedShipDate = formatDate(currentDate);
</script>

<main class="w-full mx-auto py-5 md:flex md:space-x-8 xl:max-w-7xl">
	<div class="md:w-full">
		<h1 class="font-bold text-lg md:text-2xl">Quick Order</h1>

		{#if !userLoggedIn}
			<div class="flex justify-normal md:justify-end">
				<div
					class="flex items-center gap-2 w-72 text-xs rounded-md p-3 border border-primary-100 shadow-sm bg-white shadow-primary-100 my-1"
				>
					<Icon icon="mingcute:warning-line" class="text-primary-500 text-4xl shrink-0" />
					<a href="/signin">Sign in to import items from your recent orders and quotes.</a>
				</div>
			</div>
		{/if}

		<div class="my-4 ml-4">
			<button
				on:click={() => (toggle = false)}
				class="px-5 py-2 text-sm font-semibold {toggle
					? 'bg-primary-200'
					: 'bg-white border-b-2 border-primary-500 text-primary-500'}"
			>
				Manual Entry
			</button>
			<button
				on:click={() => (toggle = true)}
				class="px-5 py-2 text-sm font-semibold {toggle
					? 'bg-white border-b-2 border-primary-500 text-primary-500'
					: 'bg-primary-200'}"
			>
				Bulk Upload
			</button>
		</div>

		{#if toggle}
			<div class="w-full px-5">
				<p class="text-2s md:text-xs font-medium py-1.5">
					Type or paste product SKU (product number and pack size), quantity, promo code, and
					reference number separated by commas*. Enter separate products on new lines.
				</p>

				<section class="w-full mx-auto md:flex items-center gap-5">
					<div
						class="md:w-3/5 h-72 border-1 bg-white rounded overflow-hidden overflow-y-scroll p-5"
					>
						{#if jsonData.length > 0}
							<div class="text-sm">
								{#each jsonData as { SKU, Quantity }}
									<p>{SKU}, {Quantity}</p>
								{/each}
							</div>
						{:else}
							<div class="text-gray-300 text-sm">
								<p>Example</p>
								<p>TP23-47474,50</p>
								<p>57-67574,1</p>
								<p>23-UR474,20</p>
								<p>T3-78894,100</p>
							</div>
						{/if}

						{#if fileError}
							<p class="text-red-500 text-sm mt-2">{fileError}</p>
						{/if}
					</div>

					<section class="mt-3 md:mt-0 md:w-2/5">
						<div class="flex justify-center bg-white items-center h-12 border-1 rounded">
							<a
								class="flex items-center gap-2 text-sm font-medium text-primary-500"
								href="/quick_order_template.csv"
								download
							>
								<Icon icon="pajamas:download" class="text-lg" /> Download Template
							</a>
						</div>

						<div
							bind:this={dropArea}
							on:drop={handleDrop}
							on:dragover={handleDragOver}
							class="w-full flex flex-col justify-center bg-white items-center rounded h-56 mt-3 space-y-2 py-10 border-1 border-dashed"
						>
							<Icon icon="uil:upload" class="text-3xl text-primary-500 -ml-4" />
							<p class="text-xs">Drag and Drop your CSV or XLS file to upload or</p>
							<label for="bulkupload" class="text-xs mr-3">
								<span class="font-medium text-primary-600">Choose File</span>
								<input
									id="bulkupload"
									class="hidden"
									type="file"
									accept=".xlsx, .xls, .csv,.txt"
									on:change={handleFileInputChange}
								/>
							</label>
						</div>
					</section>
				</section>

				{#if cartProducts.length > 0}
					<div class="mt-4 text-green-500">
						<h3>Valid Products Added to Cart:</h3>
						{#each cartProducts as item}
							<p>{item.SKU} - {item.Quantity}</p>
						{/each}
					</div>
				{/if}

				{#if invalidProducts.length > 0}
					<div class="mt-4 text-red-500">
						<h3>Invalid Products:</h3>
						{#each invalidProducts as item}
							<p>{item.SKU} is invalid or missing size information</p>
						{/each}
					</div>
				{/if}

				<p class="text-2s md:text-xs font-medium py-1.5">
					*Promo codes and references numbers cannot be used when requesting quotes.
				</p>
				<section class=" w-full mx-auto md:flex items-center gap-5">
					<div
						class=" md:w-3/5 h-72 border-1 bg-white rounded overflow-hidden overflow-y-scroll scroll p-5"
					>
						{#if jsonData.length > 0}
							<div class=" text-sm">
								{#each jsonData as { SKU, Quantity }}
									<p>{SKU},{Quantity}</p>
								{/each}
							</div>
						{:else}
							<div class=" text-gray-300 justify-center items-center text-sm">
								<p>Example</p>
								<p>TP23-47474,50</p>
								<p>57-67574,1</p>
								<p>23-UR474,20</p>
								<p>T3-78894,100</p>
							</div>
						{/if}
					</div>
					<section class="mt-3 md:mt-0 md:w-2/5">
						<div class=" flex justify-center bg-white items-center h-12 border-1 rounded">
							<a
								class=" flex items-center gap-2 text-sm font-medium text-primary-500"
								href="/quick_order_template.csv"
								download
							>
								<Icon icon="pajamas:download" class="text-lg" /> Download Template
							</a>
						</div>

						<div
							bind:this={dropArea}
							on:drop={handleDrop}
							on:dragover={handleDragOver}
							class=" w-full flex flex-col justify-center bg-white items-center rounded h-56 mt-3 space-y-2 py-10 border-1 border-dashed"
						>
							<Icon icon="uil:upload" class=" text-3xl text-primary-500 -ml-4" />

							<p class="text-xs">Drag and Drop your CSV or XLS file to upload or</p>
							<label for="bulkupload" class=" text-xs mr-3">
								<span class="font-medium text-primary-600">Chooose File</span>
								<input
									id="bulkupload"
									class="hidden"
									type="file"
									accept=".xlsx, .xls, .csv,.txt"
									on:change={handleFileInputChange}
								/>
							</label>
						</div>
					</section>
				</section>
				<p class=" text-2s md:text-xs font-medium py-1.5">
					*Promo codes and references numbers cannot be used when requesting quotes.
				</p>

				<div class="w-full">
					<div class="flex justify-end mt-4">
						<button
							on:click={() => addToCart(rows, products)}
							class="lg:w-1/6 w-1/3 mt-6 lg:px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-600 flex items-center justify-center space-x-2"
						>
							<span>Add to Cart</span>
							<Icon icon="ion:cart-outline" class="text-2xl shrink-0" />
						</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="space-y-2 px-5">
				{#each rows as row, index}
					<div class="flex sm:w-full gap-2 items-center relative">
						<input
							type="text"
							bind:value={row.sku}
							placeholder="Product SKU"
							on:input={() => handleProductFilter(row.sku, index)}
							class="p-2 border rounded w-full"
						/>
						{#if searchQuery && row.filteredProducts.length > 0}
							<div
								class="absolute w-full mt-20 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-md z-10"
							>
								<button
									class="absolute top-2 right-2 bg-transparent text-primary-400 hover:text-gray-600 p-1"
									on:click={() => clearSearch(index)}
								>
									<Icon icon="cuida:x-outline" class="w-5 h-5" />
								</button>

								{#each row.filteredProducts as result (result.productNumber)}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										class="p-4 border-b border-gray-300 last:border-b-0 hover:bg-gray-100 cursor-pointer"
										on:click={() => selectProduct(result, index)}
									>
										{#if result.priceSize && result.priceSize.length > 0}
											<div class="space-y-1 mt-2">
												{#each result.priceSize as size}
													<div>{result.productNumber}-{size.size || 'No Size Available'}</div>
												{/each}
											</div>
										{:else}
											<div>No Size Available</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}

						{#if row.error}
							<div class="text-red-500 text-xs mt-2">
								{row.error}
							</div>
						{/if}

						<div class="w-full md:w-72 mt-3 md:mt-0 flex items-center gap-2">
							<input
								type="number"
								min="1"
								bind:value={row.quantity}
								class="w-2/3 grow text-center border-1 rounded bg-white font-medium h-10 outline-none py-2"
								on:input={() => (row.quantity = Math.max(1, Math.min(9999, row.quantity)))}
							/>
							<button class="outline-none" on:click={() => incrementQuantity(index)}>
								<Icon
									icon="ic:round-plus"
									class="text-lg border-1 rounded bg-white text-primary-500 w-12 h-10 p-2"
								/>
							</button>
							<button class="outline-none" on:click={() => decrementQuantity(index)}>
								<Icon
									icon="ic:round-minus"
									class="text-lg border-1 rounded bg-white text-primary-500 w-12 h-10 p-2"
								/>
							</button>
						</div>
					</div>

					{#if selectedProduct && selectedProduct.productNumber === row.sku.split('-')[0]}
						<div class="   gap-5 items-center md:block hidden rounded w-full">
							<span class="font-semibold">{selectedProduct.productName}</span>
							<span>Size: {selectedProduct.priceSize?.[0]?.size || 'No Size Available'}</span>
							<span>Price: ₹{selectedProduct.priceSize?.[0]?.price}</span>
							<button class="p-2 text-primary-400 rounded" on:click={showDetails}> Details </button>
							<div
								class="p-2 text-red-500 cursor-pointer hover:text-red-700"
								on:click={() => clearSelectedProduct(index)}
							>
								<Icon icon="mdi:close-circle" class="w-6 h-6" />
							</div>
						</div>
					{/if}
				{/each}

				<div class="mt-2 flex items-center justify-between space-x-2 lg:space-x-54">
					<button on:click={addRows} class="text-primary-500 text-md mt-6"> + Add More</button>

					<button
						on:click={() => addToCart(rows, products)}
						class="lg:w-1/5 w-1/2 mt-6 lg:px-4 py-2 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-600 flex items-center justify-center"
					>
						<span>Add to Cart</span>
						<Icon icon="ion:cart-outline" class="text-2xl shrink-0" />
					</button>
				</div>

				{#if showCartMessage}
					<div class="text-primary-500 text-center mt-2">Products added to cart!</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if userLoggedIn}
		<div
			class="w-full sm:w-full md:w-1/4 lg:w-1/4 h-1/2 ml-0 sm:ml-0 mt-8 md:mt-24 bg-gray-50 border rounded-lg border-gray-400 p-4"
		>
			<h2 class="font-semibold text-xl mb-2">Hello, {email}</h2>
			<div class="mb-2">
				<div class="flex items-center space-x-2">
					<h3 class="font-semibold text-lg">Saved Carts</h3>
					<button class="text-primary-500" on:click={() => (showSavedCarts = !showSavedCarts)}>
						<Icon
							icon={showSavedCarts
								? 'iconamoon:arrow-up-2-duotone'
								: 'iconamoon:arrow-down-2-duotone'}
							class="text-3xl"
						/>
					</button>
				</div>

				{#if showSavedCarts}
					{#if cartProducts.length > 0}
						<ul>
							{#each cartProducts as cart}
								<li class="text-sm mt-2 text-gray-700">
									{cart.productName} ({cart.quantity} items)
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-sm text-gray-500">No saved carts found.</p>
					{/if}
				{/if}
			</div>
			<div class="mb-2">
				<div class="flex items-center space-x-2">
					<h3 class="font-semibold text-lg">Recent Orders</h3>
					<button class="text-primary-500" on:click={() => (showRecentOrders = !showRecentOrders)}>
						<Icon
							icon={showRecentOrders
								? 'iconamoon:arrow-up-2-duotone'
								: 'iconamoon:arrow-down-2-duotone'}
							class="text-3xl"
						/>
					</button>
				</div>

				{#if showRecentOrders}
					{#if recentOrders.length > 0}
						<ul>
							{#each recentOrders as order}
								<li class="text-sm text-gray-700">
									Order Number: {order.orderNumber} - {order.productName}
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-sm text-gray-500">No results found.</p>
					{/if}
				{/if}
			</div>

			<div class="flex items-center space-x-2">
				<h3 class="font-semibold text-lg">Lists</h3>
				<button class="text-primary-500" on:click={() => (showLists = !showLists)}>
					<Icon
						icon={showLists ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'}
						class="text-3xl"
					/>
				</button>
			</div>
			{#if showLists}
				<a href="/lists" class="text-gray-500">See Lists# </a>
			{/if}
			<div class="flex items-center space-x-2 mt-2">
				<h3 class="font-semibold text-lg">Quotes</h3>
				<button class="text-primary-500" on:click={() => (showquotes = !showquotes)}>
					<Icon
						icon={showquotes ? 'iconamoon:arrow-up-2-duotone' : 'iconamoon:arrow-down-2-duotone'}
						class="text-3xl"
					/>
				</button>
			</div>
			{#if showquotes}
				<a href="/lists" class="text-gray-500">See Quotes # </a>
			{/if}
		</div>
	{/if}
	{#if showDetailsModal && selectedProduct}
		<div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
			<div class="bg-white p-6 rounded-lg w-100 relative">
				<button
					class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
					on:click={hideDetails}
					aria-label="Close"
				>
					<Icon icon="cuida:x-outline" class="w-5 h-5" />
				</button>

				<h3 class="text-xl font-semibold">
					{selectedProduct.productName} - {selectedProduct.productNumber}
				</h3>
				<p class="mt-2">Enter quantity to check availability and estimated ship date.</p>

				<div class="flex items-center gap-2">
					<button class="p-2 text-white bg-primary-500 rounded" on:click={decrementQuantity}>
						-
					</button>
					<input
						type="number"
						min="1"
						max="9999"
						bind:value={selectedProduct.quantity}
						class="w-20 text-center p-2 border rounded"
						on:input={() => {
							if (selectedProduct.quantity < 1) selectedProduct.quantity = 1;
							if (selectedProduct.quantity > 9999) selectedProduct.quantity = 9999;
						}}
					/>
					<button class="p-2 text-white bg-primary-500 rounded" on:click={incrementQuantity}>
						+
					</button>
					<button
						class="mt-3 p-2 text-white bg-primary-500 rounded"
						on:click={() => console.log('Check availability')}
					>
						Check Availability
					</button>
				</div>

				<p class="mt-2">
					Estimated to ship on {estimatedShipDate} for quantity {selectedProduct.quantity} from Bangalore
					Non-Bonded Warehouse
				</p>

				<button
					class="mt-3 p-2 text-white bg-primary-500 rounded"
					on:click={() => addToCart(rows, products)}
				>
					Add to Cart
				</button>
			</div>
		</div>
	{/if}
</main>
