<script>
	import { sendMessage } from "$lib/utils.js";
	import { cart, guestCart, removeFromCart } from "$lib/stores/cart.js";
	import { goto, invalidate } from "$app/navigation";
	import { enhance } from "$app/forms";
	let cartId;
	// import { updateCartState } from '$lib/stores/cart.js';
	import { onMount, onDestroy } from "svelte";
	import Icon from "@iconify/svelte";
	import { toast } from "svelte-sonner";
	import {
		authedUser,
		currencyState,
		cartTotalComps,
	} from "$lib/stores/mainStores.js";
	//   console.log("hey im guest cart from side cart",$guestCart);

	let cartOpen = false;
	let cartItems = [];
	let subtotal = 0;
	let priceINR = 0;
	let priceUSD = 0;
	let tog = null;
	let form;
	let form2;
	let isLoggedIn = $authedUser?.id ? true : false;

	function formatPriceToNumber(priceString) {
		if (!priceString) return 0;
		const formattedPrice = String(priceString)
			.replace(/[^\d.-]/g, "")
			.trim();
		return parseFloat(formattedPrice) || 0;
	}

	const loadCartFromLocalStorage = () => {
		if (typeof window !== "undefined" && window.localStorage) {
			const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
			cartItems = storedCart.map((item) => ({
				...item,
				price: formatPriceToNumber(item.priceSize?.price),
				size: item.priceSize?.size,
				quantity: item.quantity || 1,
			}));
			calculateSubtotal();
		}
	};

	const calculateSubtotal = () => {
		subtotal = cartItems.reduce((sum, item) => {
			if (item.price && !isNaN(item.price)) {
				return sum + item.price * item.quantity;
			}
			return sum;
		}, 0);
	};

	const updateLocalStorage = () => {
		if (typeof window !== "undefined" && window.localStorage) {
			//localStorage.setItem("cart", JSON.stringify(cartItems));
		}
	};

	const handleStorageChange = (event) => {
		if (event.key === "cart") {
			loadCartFromLocalStorage();
		}
	};

	const calculateTotalPrice = (cart) => {
		// console.log("cart",cart);

		priceINR = cart.reduce(
			(sum, crt) => sum + crt?.pricing?.INR * crt?.quantity,
			0,
		);
		priceUSD = cart.reduce(
			(sum, crt) => sum + crt?.pricing?.USD * crt?.quantity,
			0,
		);
		//    console.log("priceUINR",priceINR);
		//    console.log("priceUSD",priceUSD);
	};

	$: calculateTotalPrice($cart);

	let timeout;

	const handleQty = (quantity, stock, _id, indx) => {
		if(isNaN(quantity)){
			calculateTotalPrice($cart)
			return
		}
		clearTimeout(timeout);
		if (quantity > 10000000) quantity = 10000000;
		timeout = setTimeout(() => {
		if(quantity <= stock.orderMultiple ) quantity = stock.orderMultiple
		const selectedQty = Math.ceil(quantity/ stock.orderMultiple) * stock.orderMultiple
		
		if (!isLoggedIn) {
			cart.update((item) => {
				item[indx].quantity = selectedQty;
				return item;
			});
			// guestCart.update((item) => {
			// 	item[indx].quantity = selectedQty;
			// 	return item;
			// });
			calculateTotalPrice($cart);
			tog = null;
			return;
		}
	}, 1500);


		const index = $cart.findIndex((item) => item._id === _id);
		
		timeout = setTimeout(() => {
			if (index !== -1) {
			cart.update((item) => {
				item[index].quantity = Math.ceil(quantity/ stock.orderMultiple) * stock.orderMultiple;
				return item;
			});
		    }
			const formdata = new FormData();
			formdata.append("_id", _id);
			formdata.append("stock", stock);
			formdata.append("quantity", $cart[index]?.quantity);
			formdata.append("cartId", cartId);
			sendMessage("/cart?/updateQty", formdata, async (result) => {
				invalidate("data:cart");
				calculateTotalPrice($cart);
				tog = null;
			});
		}, 1400);
	};
	const incrementQuantity = (stock, _id, indx) => {
		clearTimeout(timeout);
		// console.log("stock",stock);
		// console.log("_id",_id);
		// console.log("indx",indx);
		if (!isLoggedIn) {
			cart.update((item) => {
				item[indx].quantity += item[indx].stockDetails.orderMultiple;
				return item;
			});
			// console.log("afterrrrrrrrrrr updationn",$cart);

			// guestCart.update((item) => {
			// 	console.log(item,"llllllll");
			// 	item[indx].quantity += item[indx].stockDetails.orderMultiple;
			// 	return item;
			// });
			calculateTotalPrice($cart);
			return;
		}

		const index = $cart.findIndex((item) => item._id === _id);
		if (index !== -1) {
			cart.update((item) => {
				item[index].quantity += item[indx].stockDetails.orderMultiple;
				return item;
			});
		}

		timeout = setTimeout(() => {
			const formdata = new FormData();
			formdata.append("_id", _id);
			formdata.append("stock", stock);
			formdata.append("quantity", $cart[index]?.quantity);
			formdata.append("cartId", cartId);
			sendMessage("/cart?/updateQty", formdata, async (result) => {
				// console.log(result);
				calculateTotalPrice($cart);
			});
		}, 1000);
	};

	const decrementQuantity = (stock, _id, indx) => {
		clearTimeout(timeout);
		if (!isLoggedIn) {

			cart.update((item) => {
				if(item[indx].quantity <= stock.orderMultiple) return item
				item[indx].quantity -= item[indx].stockDetails.orderMultiple;
				return item;
			});
			// guestCart.update((item) => {
			// 	if(item[indx].quantity <= stock.orderMultiple) return item
			// 	item[indx].quantity -= item[indx].stockDetails.orderMultiple;
			// 	return item;
			// });
			calculateTotalPrice($cart);
			return;
		}
		const index = $cart.findIndex((item) => item._id === _id);
		if (index !== -1) {
				cart.update((item) => {
				if(item[indx].quantity <= stock.orderMultiple) return item
					item[index].quantity -= item[index].stockDetails.orderMultiple;
					return item;
				});
		}
		timeout = setTimeout(() => {
			const formdata = new FormData();
			formdata.append("_id", _id);
			formdata.append("stock", stock);
			formdata.append("quantity", $cart[index].quantity);
			formdata.append("cartId", cartId);
			sendMessage("/cart?/updateQty", formdata, async (result) => {
				calculateTotalPrice($cart);
				// console.log(result);
			});
		}, 1000);
	};

	const removeItem = (productNumber, _id, index) => {
		if (!isLoggedIn) {
			removeFromCart(index);
			toast.success(`${productNumber} is deleted successfully`);
			submitAlternateForm();
			return;
		}
		const formdata = new FormData();
		formdata.append("cartId", cartId);
		formdata.append("productNumber", productNumber);
		formdata.append("_id", _id);
		sendMessage("/cart?/deleteOne", formdata, async (result) => {
			if (result.success) {
				cart.update((items) => {
					// Filter out the item with the matching _id
					return items.filter((item) => item._id !== _id);
				});
				form.requestSubmit();
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		});
	};

	async function submitAlternateForm() {
		// submitGuestForm.requestSubmit();
		const storedTotalComps = JSON.parse(localStorage.getItem("cart"));
		localStorage.setItem("totalCompsChemi", storedTotalComps.length);
		syncLocalStorageToStore();
	}

	const emptyCart = () => {
		if (!isLoggedIn) {
			removeFromCart();
			toast.success(`All products are deleted successfully`);
			localStorage.setItem("totalCompsChemi", 0);
			syncLocalStorageToStore();
			return;
		}
		const formdata = new FormData();
		formdata.append("cartId", cartId);
		sendMessage("/cart?/deleteAll", formdata, async (result) => {
			if (result.success) {
				cart.update(() => {
					return [];
				});
				localStorage.setItem("totalCompsChemi", 0);
				syncLocalStorageToStore();
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		});
	};

	const observeLocalStorage = () => {
		let originalSetItem = localStorage.setItem;
		localStorage.setItem = function (key, value) {
			originalSetItem.apply(this, arguments);
			if (key === "cart") {
				loadCartFromLocalStorage();
			}
		};
	};

	const toggleCart = () => {
		// console.log("clicked");
		if ($authedUser?.id) {
			form.requestSubmit();
		} else {
			// observeLocalStorage();
			form2.requestSubmit();
		}
		//   if (typeof window !== 'undefined') {
		// 	window.addEventListener('storage', handleStorageChange);
		//   }
		cartOpen = !cartOpen;
	};

	function handleDataCart() {
		return async ({ result }) => {
			// console.log("result from page server for carat data",result.data);
			const totalComps = result.data?.cart[0]?.cartItems.length;
			// console.log("totalComps",totalComps);
			localStorage.setItem("totalCompsChemi", totalComps);
			

			
			cartId = result.data?.cart[0]?.cartId;
			$cart = result.data?.cart[0]?.cartItems || [];
			syncLocalStorageToStore();
		};
	}

	function syncLocalStorageToStore() {
		// Check if we are in the browser
		if (typeof window !== "undefined") {
			const storedTotalComps = localStorage.getItem("totalCompsChemi");
			if (storedTotalComps) {
				cartTotalComps.set(Number(storedTotalComps));
			}
		}
	}

	function handleDataGuestCart() {
		return async ({ result }) => {
			console.log("result from page server for carat data",result);
			cart.set(result.data.cart)
		};
	}

	const visitcart = () => {
		goto("/cart");
		cartOpen = !cartOpen;
	};

	onMount(() => {
		//   loadCartFromLocalStorage();
		//   observeLocalStorage();
		if (typeof window !== "undefined") {
			window.addEventListener("storage", handleStorageChange);
		}
	});

	loadCartFromLocalStorage();
	updateLocalStorage();
	// observeLocalStorage();

	onDestroy(() => {
		if (typeof window !== "undefined") {
			window.removeEventListener("storage", handleStorageChange);
		}
	});

	function getFullPath(partNumber) {
		const basePath =
			"/products/analytical-chemistry/analytical-chromatography";

		if (typeof window !== "undefined") {
			const currentPath = window.location.pathname;
			if (currentPath.startsWith(basePath)) {
				return `${basePath}/${encodeURIComponent(partNumber)}`;
			}
		}
		return `${basePath}/${encodeURIComponent(partNumber)}`;
	}
</script>

<form
	method="POST"
	action="/?/getCartData"
	bind:this={form}
	use:enhance={handleDataCart}
>
	<input type="hidden" name="loggedInUser" value={$authedUser?.id} />
</form>
<form
	method="POST"
	action="/cart?/guestCart"
	bind:this={form2}
	use:enhance={handleDataGuestCart}
>
	<input type="hidden" name="guestCart" value={JSON.stringify($guestCart)} />
</form>
<button on:click={toggleCart} class="  text-gray-600 pr-0 md:-mt-2 sm:pr-2">
	<span class="flex items-center space-x-1">
		<!-- Wrapper for Icon with Badge -->
		<div class="relative inline-block">
			<!-- Shopping Cart Icon -->
			<Icon
				icon="heroicons-solid:shopping-cart"
				class=" text-xl sm:text-3xl hover:text-primary-100 hover:scale-105 text-white shrink-0"
			/>
			<!-- Badge -->
			<span
				class="absolute sm:ml-3.5 ml-1.5 top-1 transform translate-x-1/2 -translate-y-1/2 {$cartTotalComps ===
				0 || $cartTotalComps == undefined || isNaN($cartTotalComps)
					? 'hidden'
					: 'text-white font-semibold bg-gray-600 inset-0 shadow-md'} text-2s font-medium rounded-full w-4 h-4 flex items-center justify-center"
			>
				{$cartTotalComps}
			</span>
		</div>
	</span>
</button>

{#if cartOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm transition-opacity z-50"
		on:click={(e) => {
			if (e.target === e.currentTarget) {
				cartOpen = false;
			}
		}}
	></div>
	<div
		class="fixed top-0 right-0 h-full w-full sm:w-1/2 md:w-2/4 lg:w-2/6 z-50"
	>
		<div class="w-full h-full bg-white shadow-lg flex flex-col">
			<div
				class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10"
			>
				<h1 class="text-md font-semibold">
					CART ITEMS <span class="text-primary-400"
						>({$cart.length})</span
					>
				</h1>
				<button class="text-primary-400" on:click={toggleCart}>
					<Icon icon="cuida:x-outline" class="text-2xl" />
				</button>
			</div>
			<div class="px-2 py-2 overflow-y-auto scroll flex-1">
				{#if !$cart.length}
					<div
						class="w-full h-full flex flex-col gap-2 items-center justify-center"
					>
						<Icon
							icon="typcn:shopping-cart"
							class="text-5xl text-primary-500 md:text-8xl"
						/>
						<p class=" font-bold text-lg md:text-xl xl:text-2xl">
							Cart is Empty
						</p>
					</div>
				{:else}
					{#each $cart as item, index}
						<div class="flex flex-col py-4 border-b">
							<div class="flex items-center space-x-1.5">
								<div
									class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-stone-300 rounded-md overflow-hidden"
								>
									<img
										src={item.productDetails.imageSrc}
										alt="img"
										class="w-full h-full object-cover"
									/>
								</div>
								<div class="flex-1">
									<button on:click={()=>{
										cartOpen = false
										goto(`/products/details/${item.productDetails.productNumber}`)
									}} class="hover:text-primary-500 hover:underline font-semibold text-sm">
										{item.productDetails.productNumber}
									</button>
									<p class="font-medium text-xs text-gray-800">
										{item.productDetails.productName}
									</p>
									<p class="text-xs text-gray-500">
										{item.pricing.break}
									</p>
								</div>
								<button
									type="button"
									class="text-primary-400"
									on:click={() =>
										removeItem(
											item.productDetails.productNumber,
											item._id,
											index,
										)}
								>
									<Icon
										icon="codicon:trash"
										class="text-xl sm:text-2xl hover:scale-105"
									/>
								</button>
							</div>

							<div class="flex items-center justify-between mt-3">
								<p class="text-sm font-semibold text-gray-600">
									{$currencyState === "inr"
										? "₹" +
											item?.pricing.INR.toLocaleString(
												"en-IN",
											)
										: "$" +
											item?.pricing.USD.toLocaleString(
												"en-IN",
											)}
								</p>
								<div class="flex items-center">
									<input
										type="number"
										bind:value={item.quantity}
										on:input={(e) =>
											handleQty(
												parseInt(e.target.value),
												item.stockDetails,
												item._id,
												index,
											)}
										class="{tog === index
											? ''
											: 'hidden'} border-1 border-gray-200 rounded outline-none text-xs p-1 font-medium focus:ring-0 focus:border-primary-400"
										min="1"
										max="10000000"
									/>
									<div
										class=" {tog === index
											? 'hidden'
											: ''} flex items-center border-1 rounded"
									>
										<button
											disabled={item.isCart ||
												item.isQuote}
											on:click={() =>
												decrementQuantity(
													item.stockDetails,
													item._id,
													index,
												)}
											class=" border-r-1 p-1.5 disabled:bg-gray-200 disabled:text-white text-primary-500"
											><Icon
												icon="rivet-icons:minus"
												class="text-xs"
											/></button
										>
										<button
											on:click={() => {
												tog = index;
											}}
											class="w-fit px-3 py-1 text-xs font-medium outline-none text-center"
										>
											{item.quantity === null ? "" : item.quantity}
										</button>
										<button
											disabled={item.isCart ||
												item.isQuote}
											on:click={() =>
												incrementQuantity(
													item.stockDetails,
													item._id,
													index,
												)}
											class=" border-l-1 p-1.5 disabled:bg-gray-200 disabled:text-white text-primary-500"
										>
											<Icon
												icon="rivet-icons:plus"
												class="text-xs"
											/>
										</button>
									</div>
								</div>
								<p class="text-sm font-semibold text-gray-600">
									{$currencyState === "inr"
										? "₹" +
											(
												item.pricing.INR * item.quantity
											).toLocaleString("en-IN")
										: "$" +
											(
												item.pricing.USD * item.quantity
											).toLocaleString("en-IN")}
								</p>
							</div>
						</div>
					{/each}
				{/if}
			</div>
			<div class="p-2 border-t mt-4 sticky bottom-0 bg-white z-10">
				<div class="flex justify-between items-center mb-4">
					<p class="text-gray-600 text-sm font-semibold">
						Estimated Total
					</p>
					<p class="font-bold text-lg">
						{$currencyState === "inr"
							? "₹" + priceINR.toLocaleString("en-IN")
							: "$" + priceUSD.toLocaleString("en-IN")}
					</p>
				</div>

				<div class="flex flex-col space-y-4">
					<button
						on:click={visitcart}
						class="bg-primary-400 text-sm text-white text-center py-2 rounded font-semibold hover:bg-primary-500"
					>
						VIEW CART
					</button>
					{#if $cart.length}
						<button
							on:click={emptyCart}
							class="bg-white text-primary-400 text-sm border border-primary-400 text-center py-2 rounded font-semibold hover:bg-primary-400 hover:text-white"
						>
							EMPTY CART
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
