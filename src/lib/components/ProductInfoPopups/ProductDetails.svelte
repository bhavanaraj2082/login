<script>
	import { onMount } from 'svelte';
	import { enhance, applyAction } from '$app/forms';
	import Properties from './Properties.svelte';
	import Imageinfo from './Imageinfo.svelte';
	import Icon from '@iconify/svelte';
	import { cartState } from '$lib/stores/cartStores.js';
	import { authedUser } from '$lib/stores/mainStores.js';
	import Variants from '$lib/components/ProductInfoPopups/Variants.svelte';
	import Description from '$lib/components/ProductInfoPopups/Description.svelte';

	let showDropdown = false;
	let showSharePopup = false;
	let showModal = false;
	let showImagePopup = false;
	export let data;

	let showQuoteModal = false;
	let productQuote = null;

	function toggleQuoteModal(selectedProduct) {
		showQuoteModal = !showQuoteModal;
		productQuote = selectedProduct;
	}

	export let isFavorite;
	let product = data.records;
	let showToast = false;
	let productURL = '';
	let showPopup = false;
	let stockStatus = '';
	let stockAvailability = '';
	let stockType = '';
	let stockUnAvailability = '';
	let cartNotification = '';
	let notificationTimeout;
	let index = 0;
	let isLiked = isFavorite;
	let favoriteNotification = '';
	let favoriteStatus = '';
	$: isLoggedIn = !!$authedUser.email;
	let authedEmail = $authedUser.email;
	let email = '';
	let password = '';
	let loginSuccessmsg = '';
	let loginSuccesstype = '';
	let showLikedPopup = false;
	let successMessage = '';
	let errorMessage = '';
	const conversionRate = 83;

	$: {
		data.records.forEach((record, index) => {
			record.priceSize.forEach((priceItem, i) => {
				if (!priceItem.hasOwnProperty('INR')) {
					const inrValue = Number(priceItem.USD * conversionRate);
					priceItem.INR = inrValue;
					delete priceItem.USD;
				}
			});
		});
	}

	let orderMultiple = null;
	let quantity = orderMultiple;
	$: {
		if (data.records.length > 0) {
			orderMultiple = data.records[0].orderMultiple;
			quantity = orderMultiple;
		} else {
			quantity = null;
		}
	}

	let minPrice = Infinity;
	let maxPrice = -Infinity;

	$: {
		// Reset the prices before recalculating
		minPrice = Infinity;
		maxPrice = -Infinity;

		data.records.forEach((record) => {
			if (record?.variants && record?.variants.length > 0) {
				record?.variants.forEach((variant) => {
					let variantMinPrice = Infinity;
					let variantMaxPrice = -Infinity;

					if (variant?.pricing && variant?.pricing?.length > 0) {
						variant.pricing.forEach((priceItem) => {
							if (priceItem.USD) {
								// Convert USD to INR
								const usdValue = priceItem.USD;
								const inrValue = usdValue * conversionRate;
								priceItem.INR = inrValue;
								delete priceItem.USD; // Remove USD key
							}
						});

						variant.pricing.forEach((priceItem) => {
							if (priceItem.INR !== undefined) {
								variantMinPrice = Math.min(variantMinPrice, priceItem.INR);
								variantMaxPrice = Math.max(variantMaxPrice, priceItem.INR);

								// Update the global min and max prices
								minPrice = Math.min(minPrice, priceItem.INR);
								maxPrice = Math.max(maxPrice, priceItem.INR);
							}
						});

						// Set the min/max price for the variant
						variant.minPriceINR = variantMinPrice;
						variant.maxPriceINR = variantMaxPrice;
					}
				});
			}
		});
	}
	// console.log("data in componenet",data);

	function handleThumbnailClick(selectedIndex) {
		index = selectedIndex;
	}

	function togglePopup() {
		showPopup = !showPopup;
	}

	function toggleLike() {
		isLiked = !isLiked;
	}

	onMount(() => {
		productURL = window.location.href;
	});

	// console.log("Products from load function:", product);

	function toggleModal() {
		showModal = !showModal;
	}

	const toggleDropdown = () => {
		showDropdown = !showDropdown;
	};

	const increaseQuantity = () => {
		quantity += orderMultiple;
	};

	const decreaseQuantity = () => {
		if (quantity - orderMultiple >= 1) {
			quantity -= orderMultiple;
		} else {
			quantity = 0;
		}
	};

	function toggleSharePopup() {
		showSharePopup = !showSharePopup;
	}

	function toggleImagePopup() {
		showImagePopup = !showImagePopup;
	}

	function copyToClipboard() {
		navigator.clipboard
			.writeText(productURL)
			.then(() => {
				showToast = true;
				setTimeout(() => {
					showToast = false;
				}, 2000);
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err);
			});
	}

	function toggleLikedPopup() {
		showLikedPopup = !showLikedPopup;
	}

	export function addToCart(product, index) {
		const cartProduct = {
			id: product.productId,
			name: product.productName,
			partNumber: product.productNumber,
			description: product.prodDesc,
			image: product.imageSrc,
			stock: product.stockQuantity,
			priceSize: {
				price: product?.priceSize[index].INR,
				size: product?.priceSize[index].break
			},
			quantity: quantity
		};
		cartState.update((cart) => {
			const exactMatchIndex = cart.findIndex(
				(item) =>
					item?.priceSize?.size === cartProduct?.priceSize?.size &&
					item?.priceSize?.price === cartProduct?.priceSize?.price
			);
			if (exactMatchIndex !== -1) {
				const existingItem = cart[exactMatchIndex];
				if (existingItem.quantity !== cartProduct.quantity) {
					cart[exactMatchIndex].quantity = cartProduct.quantity;
					cartNotification = `Updated quantity for item  in your cart.`;
				} else {
					cartNotification = `The item is already in your cart with the same quantity.`;
				}
			} else {
				cart.push(cartProduct);
				const totalItems = cart.length;
				cartNotification = `You have ${totalItems} item(s) in your cart.`;
			}
			localStorage.setItem('cart', JSON.stringify(cart));
			return cart;
		});
		if (notificationTimeout) clearTimeout(notificationTimeout);
		notificationTimeout = setTimeout(() => {
			cartNotification = '';
		}, 3000);
	}
</script>

{#each data.records as product}
	<div class="md:flex lg:flex bg-white shadow-sm rounded-lg m-10">
		<div
			class=" w-full shadow-sm rounded-sm p-3 flex space-x-4 justify-between items-center flex-col lg:flex-row m-3"
		>
			<div class="flex flex-col space-y-4 lg:w-1/3">
				<div class="mb-3 lg:h-80">
					<button on:click={toggleImagePopup} class="w-full h-80">
						<!-- svelte-ignore a11y-img-redundant-alt -->
						<img
							src={product.imageSrc}
							alt="Product Image"
							class="rounded-lg w-full h-80 object-contain"
						/>
					</button>
					{#if showImagePopup}
						<Imageinfo {data} ImageclosePopup={toggleImagePopup} />
					{/if}
				</div>
				<div class="w-full mb-4">
					<button class="w-full text-left bg-white text-gray-900 font-medium p-2 pl-0">
						Documents
					</button>
					<div class="w-full rounded-lg space-y-1">
						<!-- {#if showDropdown} -->
						<div class="text-primary-400 text-sm text-left cursor-pointer">
							<a href={product?.safetyDatasheet} target="_blank">
								<Icon icon="ic:round-download" class="text-md inline" />SDS
							</a>
						</div>
						<!-- <div class="text-primary-400 text-sm text-left cursor-pointer">
              <a href="/" target="_blank"
                ><i class="fa-solid fa-sheet-plastic mr-1"></i>Specifications
                Sheet</a
              >
            </div> -->
						<!-- {/if} -->
					</div>
				</div>
			</div>

			<!-- Right Column (Product Details) -->
			<div class="flex flex-col space-y-4 w-full lg:w-3/4 max-[991px]:mt-5 max-[991px]:!ml-0">
				<div class="flex items-center justify-between">
					<span class="text-primary-400 font-semibold">{product.productNumber}</span>
					<div class="flex">
						<form
							method="POST"
							action="?/favorite"
							use:enhance={() => {
								return async ({ result }) => {
									let status = '';
									console.log(result);
									status = result.type;
									console.log('success/error type:', status);
									console.log('success/error message:result.data.message=', result.data.message);
									favoriteNotification = result.data.message;
									favoriteStatus = result.data.type;
									// loginSuccessmsg=result.data.message;
									// loginSuccesstype=result.data.type;
								};
							}}
						>
							<input type="hidden" name="id" value={product.productId} />
							<input type="hidden" name="imgUrl" value={product.imageSrc} />
							<input type="hidden" name="priceSize" />
							<input type="hidden" name="authedEmail" value={authedEmail} />
							<input type="hidden" name="price" value={product?.priceSize[index]?.INR} />
							<input type="hidden" name="size" value={product?.priceSize[index]?.break} />
							<input type="hidden" name="productDesc" value={product.prodDesc} />
							<input type="hidden" name="productName" value={product.productName} />
							<input type="hidden" name="productNumber" value={product?.productNumber} />
							<input type="hidden" name="quantity" value={product?.quantity || 1} />
							<input type="hidden" name="stock" value={product?.stockQuantity} />
							<button type="submit" class="btn btn-primary" on:click={toggleLikedPopup}>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<Icon
									icon="icon-park-outline:like"
									class={`text-2xl ml-10 ${isLiked ? 'text-orange-500' : 'text-primary-400'} text-end`}
									on:click={toggleLike}
								/>
							</button>
						</form>
					</div>
				</div>
				<h1 class="text-gray-800 font-semibold text-2xl">
					{product?.productName}
				</h1>
				{#if product?.CAS && product?.CAS !== ''}
					<p class="text-gray-500 text-sm !mt-1 mb-1">
						CAS Number: <span class="font-bold">{product?.CAS}</span>
					</p>
				{/if}
				{#if product?.returnPolicy === true}
					<p class="text-gray-500 text-sm font-bold !mt-1 mb-1">This product is Returnable.</p>
				{:else}
					<p class="text-gray-500 text-sm font-bold !mt-1 mb-1">This product is Not Returnable.</p>
				{/if}
				{#if product.prodDesc !== ''}
					<p class="text-gray-500 text-sm !mt-1">
						{product.prodDesc}
					</p>
				{/if}
				{#if product.productSynonym}
					<div class="flex justify-between !mt-3">
						<p class="text-gray-900 text-sm font-semibold text-start">
							Synonym(S): <span class="text-gray-500 font-normal">{product.productSynonym}</span>
						</p>
					</div>
				{/if}
				{#if product?.variants && product?.variants.length > 0}
					<div class="flex justify-between !mt-3">
						<p class="text-gray-900 text-lg font-semibold text-start">
							₹ {minPrice} - ₹ {maxPrice}
						</p>
					</div>
				{/if}
				{#if !((product?.variants && product?.variants.length > 0) || product?.priceSize?.length === 0)}
					<div class="">
						<h2 class="bg-white font-semibold text-left">SELECT A SIZE</h2>
						<div
							class="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm font-semibold text-gray-700 mt-2 text-left border-b border-gray-300"
						>
							<div class="p-2">Pack Size</div>
							<div class="p-2">SKU</div>
							<div class="p-2">Availability</div>
							<div class="p-2">Price</div>
						</div>
						{#each product?.priceSize as priceItem, i}
							<div class="w-full mt-1">
								<button
									type="button"
									class={`w-full grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-500 cursor-pointer transition-transform border border-gray-300  rounded-sm ${index === i ? 'border md:border-l-6 lg:border bg-primary-50' : 'border-none'}`}
									on:click={() => handleThumbnailClick(i)}
								>
									<div class="col-span-1 p-2 text-left">{priceItem?.break}</div>
									<div class="col-span-1 p-2 text-left">
										{product?.productNumber}-{priceItem?.break}
									</div>
									<div
										class="col-span-1 p-2 flex items-center justify-center space-x-1 sm:space-x-2"
									>
										<span class="text-left">
											{#if product?.stockQuantity > 0}
												<Icon
													icon="carbon:checkmark-outline"
													class="text-sm text-primary-400 inline"
												/> Available
											{:else}
												<Icon icon="mdi:close" class="text-sm text-primary-400" /> Out of stock
											{/if}</span
										>
									</div>
									<div class="col-span-1 p-2 text-left">
										₹ {priceItem.INR.toLocaleString('en-IN')}
									</div>
								</button>
							</div>
						{/each}
					</div>
				{/if}
				{#if !((product?.variants && product?.variants.length > 0) || product?.priceSize?.length > 0)}
					<div>
						<p>Price not available for this product, request Quote</p>
						<button
							on:click={() => toggleQuoteModal(product)}
							class="bg-primary-500 py-2 px-4 hover:bg-primary-600 rounded text-white mt-2"
							>Request Quote</button
						>
					</div>
				{/if}
			</div>
		</div>
		{#if !((product?.variants && product?.variants.length > 0) || product?.priceSize?.length === 0)}
			<div
				class=" shadow-sm rounded-sm p-3 space-x-4 justify-between items-center flex-col lg:flex-row m-3 lg:w-1/4 md:w-3/6"
			>
				<div class="flex flex-col w-full">
					<div class="text-gray-800">
						<div class="items-center justify-between border-dotted border-b-2 border-gray-300 pb-2">
							<div class="text-lg font-semibold relative">
								{product?.productNumber}-{product?.priceSize[index]?.break}
								<button on:click={toggleModal} class="ml-1 text-primary-400">
									<Icon icon="material-symbols:info-outline" class="text-md" /></button
								>
								{#if showModal}
									<div
										class="absolute bottom-full mb-px left-0 bg-white p-2 rounded-lg shadow-lg w-52 border border-primary-400"
									>
										<button
											on:click={toggleModal}
											class="absolute top-2 right-2 text-gray-500 font-semibold"
										>
											<Icon icon="mdi:close" class="text-sm" />
										</button>
										<h2 class="text-sm font-medium">Product Information</h2>
										<p class="text-xs text-gray-500 font-normal">
											Foreign Trade Community Code: {product?.productNumber}
										</p>
									</div>
								{/if}
							</div>
							<span class="text-lg font-semibold">
								₹ {product?.priceSize[index]?.INR.toLocaleString('en-IN')}
							</span>
						</div>
					</div>

					<div class="border-dotted border-b-2 border-gray-300 pb-2 mb-2">
						<p class="text-gray-800 font-semibold text-sm mt-4">Availability</p>
						<p class="text-sm">
							{#if product?.stockQuantity > 0}
								<Icon
									icon="material-symbols:check-circle-outline"
									class="text-sm text-primary-400 inline"
								/> Available
							{:else}
								<Icon icon="meteor-icons:circle-xmark" class="text-sm text-primary-400" /> Out of stock
							{/if}
						</p>
						<div class="flex space-x-2 items-center mt-2">
							<button
								on:click={togglePopup}
								class="w-full text-sm font-semibold text-left text-primary-400">More Info</button
							>
							{#if showPopup}
								<div
									class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 !ml-0"
								>
									<div
										class="bg-white rounded-lg w-full max-w-lg p-6 md:p-8 mx-4 md:mx-0 relative shadow-lg"
									>
										<button
											on:click={togglePopup}
											class="absolute top-4 right-4 text-primary-400 text-xl font-bold"
										>
											<Icon icon="mdi:close" class="text-sm" />
										</button>

										<h2 class="text-xl font-bold text-left">
											Availability for {product?.productNumber}-{product?.priceSize[index]?.break}
										</h2>
										<p class="text-gray-500 text-left mt-2">
											Enter quantity to check availability and estimated ship date.
										</p>

										<form
											method="POST"
											action="?/checkavailabilityproduct"
											use:enhance={() => {
												return async ({ result }) => {
													let status = '';
													console.log(result);
													status = result.type;
													console.log('success/error type:', status);
													console.log(
														'success/error message:result.data.message=',
														result.data.record.message
													);
													console.log(
														'success/error message:result.data.message=',
														result.data.record.stock
													);
													stockStatus = result.data.record.stock;
													stockAvailability = result.data.record.message;
													stockUnAvailability = result.data.record.message1;
													stockType = result.data.record.type;
												};
											}}
										>
											<div class="flex justify-between items-center mt-6">
												<div class="flex items-center space-x-4">
													<button
														on:click={decreaseQuantity}
														class="w-8 h-8 text-primary-400 flex items-center justify-center"
													>
														<Icon icon="ic:round-minus" class="text-2xl" />
													</button>
													<input
														type="text"
														name="quantity"
														bind:value={quantity}
														readonly
														class="w-16 h-8 text-center border border-gray-300 rounded-md"
													/>
													<input type="hidden" name="ProductId" value={product.productId} />
													<button
														on:click={increaseQuantity}
														class="w-8 h-8 text-primary-400 flex items-center justify-center"
													>
														<Icon icon="ic:round-plus" class="text-2xl" />
													</button>
												</div>

												<button
													type="submit"
													class="bg-primary-400 text-white p-2 rounded-lg flex items-center space-x-1"
												>
													<Icon icon="tabler:calendar-check" class="text-sm" />
													<span>Check Availability</span>
												</button>
											</div>

											{#if stockType === 'success'}
												<div class="mt-6 space-y-2 text-sm">
													<div class="flex items-center space-x-2">
														<Icon
															icon="material-symbols:check-circle-outline"
															class="text-sm text-primary-400"
														/>
														<p>{stockAvailability}</p>
													</div>
													{#if stockUnAvailability !== ''}
														<div class="flex items-center space-x-2">
															<Icon
																icon="material-symbols:check-circle-outline"
																class="text-sm text-primary-400"
															/>
															<p>{stockUnAvailability}</p>
														</div>
													{/if}
												</div>
											{:else if stockType === 'error'}
												<div class="mt-6 space-y-2 text-sm">
													<div class="flex items-center space-x-2">
														<Icon
															icon="meteor-icons:circle-xmark"
															class="text-sm text-primary-400"
														/>
														<p>{stockAvailability}</p>
													</div>
												</div>
											{/if}
										</form>
										<div class="mt-6 flex justify-end">
											<button
												on:click={() => addToCart(product, index)}
												class="bg-primary-400 text-white py-2 px-4 rounded-lg flex items-center space-x-1"
											>
												<Icon icon="ic:round-shopping-cart" class="text-2xl" />Add To Cart
											</button>
										</div>
									</div>
								</div>
							{/if}
							<button
								on:click={toggleSharePopup}
								class="w-full text-sm font-semibold text-right text-primary-400"
								>Share <Icon icon="fluent:share-24-regular" class="text-md inline" /></button
							>
							{#if showSharePopup}
								<div
									class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
								>
									<div class="bg-white w-full max-w-md rounded-md shadow-lg p-4 relative mx-4">
										<button
											on:click={toggleSharePopup}
											class="absolute top-3 right-3 text-primary-400"
										>
											<Icon icon="mdi:close" class="text-2xl" />
										</button>

										<h2 class="text-base font-semibold text-primary-400 mb-3">Share Product</h2>

										<div class="flex items-start space-x-4">
											<div
												class="w-32 h-20 rounded-lg overflow-hidden flex items-center justify-center"
											>
												<!-- svelte-ignore a11y-img-redundant-alt -->
												<img
													src={product.imageSrc}
													alt="Product Image"
													class="w-full h-full object-cover"
												/>
											</div>

											<div>
												<p class="text-lg font-semibold text-primary-400">
													{product.productNumber}
												</p>
												<p class="text-sm text-gray-600">
													{product.productName}
												</p>
											</div>
										</div>

										<div class="mt-4">
											<p class="text-sm md:text-base font-semibold text-gray-800 mb-1">
												Direct Link
											</p>
											<div
												class="relative flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-center"
											>
												{#if showToast}
													<div
														class="absolute -top-8 transform -translate-x-1/2 left-1/2 bg-gray-800 text-white py-1 px-3 rounded text-xs sm:text-sm"
													>
														Copied!
													</div>
												{/if}

												<input
													type="text"
													readonly
													bind:value={productURL}
													class="text-xs sm:text-sm md:text-sm border border-primary-400 p-2 rounded-lg text-gray-600 outline-none flex-grow w-full"
												/>

												<button
													on:click={copyToClipboard}
													class="text-primary-400 text-xs sm:text-sm md:text-sm font-semibold border p-2 border-primary-400 rounded-lg flex items-center justify-center space-x-1 w-full sm:w-auto"
												>
													<Icon icon="mingcute:copy-fill" class="text-md" />
													<span>Copy</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<div class="w-full !ml-0">
					<div
						class="flex items-center border border-gray-300 rounded-sm justify-between w-full space-x-4 mt-10"
					>
						<button
							on:click={decreaseQuantity}
							class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
							><Icon icon="ic:round-minus" class="text-2xl" /></button
						>
						<span class="w-full text-center text-gray-800 rounded-sm p-1">{quantity}</span>
						<button
							on:click={increaseQuantity}
							class="w-full text-lg text-primary-400 font-bold h-8 flex items-center justify-center"
							><Icon icon="ic:round-plus" class="text-2xl" /></button
						>
					</div>
					<div class="w-full mt-3">
						<button
							on:click={() => addToCart(product, index)}
							class="w-full text-white border border-primary-400 rounded-lg py-2 px-2 hover:bg-primary-400 bg-primary-400 hover:text-white"
							><Icon icon="ic:round-shopping-cart" class="text-2xl inline mr-1" />Add To Cart</button
						>
						<!-- <button class="mt-4 w-full bg-white text-primary-400 border border-primary-400 rounded-lg py-2 px-2 hover:bg-primary-400 hover:text-white">
          <i class="fa-solid fa-code-pull-request mr-1"></i>Request For Bulk
            Order
        </button> -->
					</div>
				</div>
			</div>
		{/if}
	</div>
	{#if cartNotification}
		<div class="fixed bottom-4 left-4 p-4 bg-primary-400 text-white rounded-md shadow-lg z-50">
			{cartNotification}
		</div>
	{/if}

	{#if authedEmail === ''}
		{#if showLikedPopup}
			<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
				<div class="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full relative">
					<button
						on:click={toggleLikedPopup}
						class="absolute top-3 right-3 text-primary-400 font-bold hover:text-primary-500 transition"
						aria-label="Close"
					>
						<Icon icon="mdi:close" class="text-2xl" />
					</button>
					<h2 class="text-xl font-bold text-gray-800 text-center mb-4">
						Please Login or Register to Continue
					</h2>
					<button
						class="w-full bg-primary-400 hover:bg-primary-400 text-white font-medium py-3 px-6 rounded-lg shadow-md mb-4 transition"
					>
						<a href="/login" class="block">Login</a>
					</button>
					<p class="text-center text-gray-500 mb-2">Don’t have an account?</p>
					<button
						class="w-full border border-primary-500 hover:bg-primary-400 hover:text-white text-primary-400 font-medium py-3 px-6 rounded-lg shadow-md mb-6 transition"
					>
						<a href="/signup" class="block">Register</a>
					</button>
					<div class="text-center">
						<a
							href="/"
							class="text-primary-400 hover:text-primary-500 font-medium transition"
							on:click|preventDefault={toggleLikedPopup}
						>
							Continue Browsing
						</a>
					</div>
				</div>
			</div>
		{/if}
	{:else if showLikedPopup}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
			<div class="bg-white rounded-2xl shadow-lg p-8 relative max-w-md w-full">
				<h1 class="text-xl font-bold text-gray-700 text-center mb-4">
					{favoriteNotification}
				</h1>
				<hr class="border-gray-200 mb-6" />
				<div class="flex items-center justify-center">
					<button
						on:click={toggleLikedPopup}
						class="bg-primary-400 hover:bg-primary-500 text-white font-medium py-2 px-6 rounded-lg shadow-md transition"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	{/if}
{/each}
{#if showQuoteModal}
	<div class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
		<div class="bg-white rounded-lg p-6 w-96 h-4/5 overflow-y-auto">
			<h2 class="text-xl font-semibold mb-4">Request a Quote</h2>
			<!-- Form -->
			<form
				method="POST"
				action="?/createQuote"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.status === 200) {
							successMessage = 'Successfully create Quote';
							errorMessage = '';
							location.reload();
						} else {
							successMessage = '';
							errorMessage = 'Error creating Quote';
						}
						// showQuoteModal=false
						await applyAction(result);
					};
				}}
			>
				{#if product}
					<div class="mb-4">
						<p><strong>Product Name:</strong> {productQuote.productName}</p>
					</div>
				{/if}
				<input type="text" hidden name="productName" value={productQuote.productName} />
				<input type="text" hidden name="productNumber" value={productQuote.productNumber} />
				<input type="text" hidden name="status" value="unread" />
				<div class="mb-4">
					<label for="name" class="block text-sm font-medium text-gray-700">Units</label>
					<input
						type="number"
						name="units"
						class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
						placeholder="Units Required"
					/>
				</div>
				<div class="mb-4">
					<label for="Firstname" class="block text-sm font-medium text-gray-700">First Name</label>
					<input
						type="text"
						name="Firstname"
						class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
						placeholder="First Name"
					/>
				</div>
				<div class="mb-4">
					<label for="lastname" class="block text-sm font-medium text-gray-700">Last Name</label>
					<input
						type="text"
						name="lastname"
						class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
						placeholder="Last Name"
					/>
				</div>
				<div class="mb-4">
					<label for="organisation" class="block text-sm font-medium text-gray-700"
						>Organisation</label
					>
					<input
						type="text"
						name="organisation"
						class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
						placeholder="Organisation Name"
					/>
				</div>
				<div class="mb-4">
					<label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
					<input
						type="number"
						name="phone"
						class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
						placeholder="Phone Number"
					/>
				</div>
				<div class="mb-4">
					<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						name="email"
						class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
						placeholder="Your email"
					/>
				</div>
				<div class="mb-4">
					<label for="futherdetails" class="block text-sm font-medium text-gray-700">Message</label>
					<textarea
						class="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
						placeholder="Your message"
						name="futherdetails"
					></textarea>
				</div>
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
				<div class="flex justify-between">
					<button
						on:click={toggleQuoteModal}
						class="bg-gray-400 py-2 px-4 hover:bg-red-600 rounded text-white">Close</button
					>
					<button
						type="submit"
						class="bg-green-500 py-2 px-4 hover:bg-primary-600 rounded text-white"
					>
						Submit
					</button>
				</div>
			</form>
			<!-- Close button -->
		</div>
	</div>
{/if}

<Properties {data} />

{#each data.records as record}
	{#if record?.variants && record?.variants?.length > 0}
		<Variants {record} />
	{/if}
{/each}
<Description {data} />
