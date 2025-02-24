<script>
	import { sendMessage } from '$lib/utils.js';
	import { goto,invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { authedUser } from '$lib/stores/mainStores.js';
	import Icon from '@iconify/svelte';
	import { onMount, createEventDispatcher } from 'svelte';
	import RecurrencePopup from '$lib/components/Cart/RecurrencePopup.svelte';
	import { cartState, updateCartState } from '$lib/stores/cartStores.js';
	import { cart, guestCart,removeFromCart } from '$lib/stores/cart.js';
	import jsPDF from 'jspdf';
	import { toast } from 'svelte-sonner';
	import 'jspdf-autotable';
	import { page } from '$app/stores';
	import * as XLSX from 'xlsx';

	const dispatch = createEventDispatcher();

	export let data

	let loading = false;
	let isLoggedIn = true;

	let totalPrice = 0;
	let order = '';
	let filteredGuestCart = ''
	let container
	let addToCartModal = false
	let recureModal = false
	let timeout
	let priceINR = 0
	let priceUSD = 0

	$: cartData = data?.cart[0]?.cartItems || [];
	$: cart.set(cartData);
	$: cartId = data?.cart[0]?.cartId || '';
	$: cartName = data?.cart[0]?.cartName || '';
	$: recurrence = data?.cart[0]?.recurrence || '';
	//$: console.log(data,"forntend");

	const calculateTotalPrice = (cart)=>{
       priceINR = cart.reduce((sum,crt)=> sum + crt.pricing.INR*crt.quantity,0)
       priceUSD = cart.reduce((sum,crt)=> sum + crt.pricing.USD*crt.quantity,0)
	}
	const guestCartFetch = () => {
		const formdata = new FormData();
		formdata.append('guestCart', JSON.stringify($guestCart));
		sendMessage('?/guestCart', formdata, async (result) => {
		    //console.log("guest cart in coponent",result);
			cart.set(result.cart);
			calculateTotalPrice($cart);
		});
	};

	onMount(() => {
		filteredGuestCart = $guestCart.filter(guestItem => 
            !$cart.some(cartItem => cartItem.productId === guestItem.productId)
        );
		//console.log('object',filteredGuestCart);

		if (!isLoggedIn) {
			if ($guestCart.length) {
				guestCartFetch();
			} else {
				cart.set([]);
			}
		} else {
			cartData = data?.cart[0]?.cartItems || [];
			cart.set(cartData);
		    calculateTotalPrice($cart);
		}

	});
	
	//$:calculateTotalPrice($cart)
	let showModal = false;

	const toggleModal = () => {
		showModal = !showModal;
	};

	const handleClick = (e) => {
		if (!container.contains(e.target)) {
			addToCartModal = !addToCartModal;
		}
	};

	const downloadExcel = () => {
    // Define the data (same as the original CSV content)
    const headers = [
        'Product Name',
        'Manufacturer',
        'Quantity',
        'Back Order',
        'Price',
        'Total Price'
    ];

    console.log($cart);

    const data = $cart.map((item) => [
        item.productDetails.productName,
        item.mfrDetails.name,
        item.quantity,
        item.quantity - item.stockDetails.stock < 0 ? 0 : item.quantity - item.stockDetails.stock,
        "₹ " + item.pricing.INR.toLocaleString("en-IN"),
        "₹ " + (item.pricing.INR * item.quantity).toLocaleString("en-IN"),
    ]);

    // Calculate total price (sum of the last column - 'Extended Price')
    const totalPrice = $cart.reduce((total, item) => {
        return total + item.pricing.INR * item.quantity;
    }, 0);

    // Add a new row for the total price at the bottom
    const totalRow = [
        '', '', '', '', 'Total Price', "₹ "+totalPrice.toLocaleString("en-IN")
    ];

    // Prepare the data for SheetJS
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data, totalRow]); // AoA = Array of Arrays
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cart Details'); // Append the sheet

    // Apply styles to the header row
    const headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' } }, // Bold white text
        fill: { fgColor: { rgb: '4F81BD' } }, // Blue background
        alignment: { horizontal: 'center', vertical: 'center' }, // Center text
        border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
        }
    };

    // Apply styles for header row cells
    for (let c = 0; c < headers.length; c++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: c })];
        if (!cell) worksheet[XLSX.utils.encode_cell({ r: 0, c: c })] = {}; // Ensure cell exists
        worksheet[XLSX.utils.encode_cell({ r: 0, c: c })].s = headerStyle;
    }

    // Apply column width (optional)
    worksheet['!cols'] = headers.map(() => ({ width: 20 })); // Set column width

    // Apply styles to the data rows (optional)
    const dataStyle = {
        alignment: { horizontal: 'center', vertical: 'center' }, // Center text
        border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
        }
    };

    // Apply styles to all data rows
    for (let r = 1; r < data.length + 2; r++) { // Include the total row
        for (let c = 0; c < headers.length; c++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: r, c: c })];
            if (!cell) worksheet[XLSX.utils.encode_cell({ r: r, c: c })] = {}; // Ensure the cell exists
            worksheet[XLSX.utils.encode_cell({ r: r, c: c })].s = dataStyle;
        }
    }

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'cart_details.xlsx');
    };

	const recurrencePeriod =(recurring)=>{
		if(recurring === 1){
       return "Monthly" 
	}else if(recurring === 3){
      return "Quarterly"
	}else if(recurring === 6){
       return "Semi Annual"
	}else if(recurring === 12){
       return "Annual"
	}else{
		return recurring + " Months"
	}
	}

	const incrementQuantity = (quantity,stock,_id,indx) => {
		clearTimeout(timeout)

		if(!isLoggedIn){
			cart.update(item=>{
				item[indx].quantity += 1
				return item
			})
			guestCart.update(item=>{
			item[indx].quantity += 1
			return item
		    })
			calculateTotalPrice($cart)
			return
		}

	    const index = $cart.findIndex((item) =>item._id === _id);
		if (index !== -1) {
			cart.update(item=>{
				item[index].quantity += 1
				return item
			})
		}

		timeout = setTimeout(()=>{
		  const formdata = new FormData()
		  formdata.append("_id",_id)
		  formdata.append("stock",stock)
		  formdata.append("quantity",$cart[index]?.quantity)
		  formdata.append("cartId",cartId)
		  sendMessage("?/updateQty",formdata,async(result)=>{
			calculateTotalPrice($cart)
		  })
	  },1000)

	};

	const decrementQuantity = (quantity,stock,_id,indx) => {
		clearTimeout(timeout)
		if(!isLoggedIn){
			cart.update(item=>{
				item[indx].quantity -= 1
				return item
			})
			guestCart.update(item=>{
			item[indx].quantity -= 1
			return item
		    })
			calculateTotalPrice($cart)
			return
		}
	    const index = $cart.findIndex((item) =>item._id === _id);
		if (index !== -1) {
			if($cart[index]?.quantity !== 1){
				cart.update(item=>{
					item[index].quantity -= 1
					return item
			    })
			}
		}
		timeout = setTimeout(()=>{
		  const formdata = new FormData()
		  formdata.append("_id",_id)
		  formdata.append("stock",stock)
		  formdata.append("quantity",$cart[index].quantity)
		  formdata.append("cartId",cartId)
		  sendMessage("?/updateQty",formdata,async(result)=>{
			calculateTotalPrice($cart)
		  })
	  },1000)
	};

	const removeItem = (productNumber,_id,index) => {
		if(!isLoggedIn){
			removeFromCart(index)
			toast.success(`${productNumber} is deleted successfully`);
			return
		}
		const formdata = new FormData()
		formdata.append("cartId",cartId)
		formdata.append("productNumber",productNumber)
		formdata.append("_id",_id)
	    sendMessage("?/deleteOne",formdata,async(result)=>{
			console.log(result);
			if(result.success){
				toast.success(result.message)
			}else{
				toast.error(result.message)
			}
			invalidate("data:cart")

		})
	};

	const emptyCart = () => {
		if(!isLoggedIn){
			removeFromCart()
			toast.success(`All products are deleted successfully`);
			return
		}
		const formdata = new FormData()
		formdata.append("cartId",cartId)
	    sendMessage("?/deleteAll",formdata,async(result)=>{
			console.log(result);
			if(result.success){
				toast.success(result.message)
			}else{
				toast.error(result.message)
			}
			invalidate("data:cart")

		})
	};

	function setRedirectUrl() {
		const currentUrl = $page.url.href;
		document.cookie = `redirectUrl=${encodeURIComponent(currentUrl)}; path=/;`;
	}

	function handleCart({ cancel }) {
		return async ({ result }) => {
			console.log(result);
			addToCartModal = !addToCartModal;
			removeFromCart();
			calculateTotalPrice($cart)
			toast.success('Components are added to cart');
			invalidate('data:cart');
		};
	}
</script>

<div class="mx-auto bg-gray-50 mb-5">

	<div class=" w-11/12 mx-auto flex flex-col xl:flex-row justify-between gap-4">
		{#if loading}
			<div
				class="w-full h-72 flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white p-4 rounded shadow-md"
			>
				<p class=" font-medium text-lg md:text-xl xl:text-2xl">Loading...</p>
			</div>
		{:else if !$cart.length}
			<div class="w-full flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white py-5 rounded shadow-sm">
				<Icon icon="ic:outline-shopping-cart" class="text-5xl text-primary-400 md:text-6xl" />
				<p class=" font-bold text-lg md:text-xl">Cart is Empty</p>
			</div>
		{:else}
			<div class="w-full lg:w-4/4 xl:w-3/4 bg-white p-3 sm:px-4 sm:py-3 rounded-lg shadow-sm h-fit">
				<div class=" w-full flex items-center justify-between mb-4 sm:space-y-1">
					<div>
						<h2 class=" text-xs sm:text-4s font-semibold">
							Cart Items <span class="text-red-500">({$cart.length})</span>
						</h2>
						<p class="{ isLoggedIn && recurrence?.recurring ? "" :"hidden"} text-2s sm:text-xs font-medium">Recurring: <span class=" font-semibold text-2s sm:text-sm ">{recurrencePeriod(recurrence.recurring)}</span></p>
					</div>
					
					<div class="flex items-center gap-2">
						<button
					        type="button"
					        on:click={()=>recureModal = true}
					        class="{isLoggedIn ? "" : "hidden"} text-2s sm:text-xs w-fit flex justify-center items-center gap-1 p-1.5 sm:px-4 md:py-2 rounded text-white bg-primary-500 hover:bg-primary-600 font-medium">
							<Icon icon="iconoir:calendar-rotate-solid" class=" text-lg sm:text-xl rounded text-white"/>
					        <span class="hidden sm:block">{recurrence?.recurring ? "Edit" : "Recurrence"}</span>
						</button>
						<button
					        type="button"
					        on:click={downloadExcel}
					        class=" text-2s sm:text-xs w-fit flex justify-center items-center gap-1 p-1.5 sm:px-4 md:py-2 rounded text-white bg-primary-500 hover:bg-primary-600 font-medium">
							<Icon icon="mdi:file-download" class="text-lg sm:text-xl rounded text-white"/>
					        <span class="hidden sm:block">Download</span>
						</button>
				        <button
					        type="button"
					        on:click={emptyCart}
					        class=" text-2s sm:text-xs w-fit flex justify-center items-center gap-1 p-1.5 sm:px-4 md:py-2 rounded text-white bg-primary-500 hover:bg-primary-600 font-medium">
							<Icon icon="material-symbols:delete" class="text-lg sm:text-xl rounded text-white"/>
							<span class="hidden sm:block">Delete All</span>
						</button>
					</div>
				</div>
				

				<div class="hidden lg:flex text-gray-500 text-sm pb-2 font-semibold">
					<p class=" w-6/12">Product</p>
					<p class=" w-2/12">Price</p>
					<p class=" w-2/12">Quantity</p>
					<p class=" w-2/12">Total</p>
				</div>

				<ul class="">
					{#each $cart as item,index}
						<li class="flex flex-col lg:flex-row lg:items-center py-2 border-t-1">
					
							<h3 class=" lg:hidden font-medium text-xs sm:text-sm">Product</h3>
							<div class="flex items-center w-full md:w-6/12 md:pr-2">
								<img src={item.productDetails.imageSrc} alt={item.productDetails.productName} class="w-20 h-20 shrink-0 object-cover rounded-md" />
								<div class="ml-2">
									<p class="text-sm text-red-500 font-semibold">{item.productDetails.productNumber}</p>
									<p class=" text-gray-800 text-xs lg:text-3s">{item.productDetails.productName}</p>
									<p class=" text-gray-800 text-xs font-semibold">{item.pricing.break}</p>
								</div>
							</div>
                            <div class=" lg:w-6/12 sm:flex justify-between items-center">
							    
								 <div class=" lg:w-2/6">
									<h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Price</h3>
									<p class="text-xs w-full font-semibold text-content">
										₹{item.pricing.INR.toLocaleString("en-IN")}
									</p>
								 </div>
							
								<div class=" lg:w-2/6">
							        <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Quantity</h3>
							        <div class="flex items-center md:w-2/12">
							        	<div class="flex items-center border-1 rounded">
							        		<button
							        			on:click={() => decrementQuantity(item.quantity,item.stockDetails.stock,item._id,index)}
							        			class=" border-r-1 p-1.5 text-primary-500"
							        			><Icon icon="rivet-icons:minus" class="text-xs" /></button
							        		>
							        		<p class="w-fit mx-3 text-xs font-medium outline-none text-center">
							        			{item.quantity}
							        		</p>
							        		<button
							        			on:click={() => incrementQuantity(item.quantity,item.stockDetails.stock,item._id,index)}
							        			class=" border-l-1 p-1.5  text-primary-500">
												<Icon icon="rivet-icons:plus" class="text-xs" />
											</button>
							        	</div>
							        </div>
							    </div>
							
								<div class=" lg:w-2/6">
							        <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Total</h3>
							        <div class=" w-full flex justify-between items-center">
							        	<p class="text-xs font-semibold">
							        		₹{(item.pricing.INR * item.quantity).toLocaleString("en-IN")}
							        	</p>
							        	<button
							        		type="button"
							        		on:click={() => removeItem(item.productDetails.productNumber,item._id,index)}
							        		class=" text-lg sm:hidden text-primary-600"
							        	>
							        		<Icon icon="fluent-mdl2:delete" class=" text-xl" />
							        	</button>
							        </div>
								</div>
								<button
							        type="button" on:click={() => removeItem(item.productDetails.productNumber,item._id,index)}
							        class=" text-lg hidden sm:block text-primary-600">
							        <Icon icon="fluent-mdl2:delete" class=" text-lg" />
							    </button>
						    </div>
						</li>
					{/each}
				</ul>
			</div>
		
		{/if}

		
		 <div class="w-full sm:w-2/4 md:w-2/5 lg:w-2/6 xl:w-1/4 self-end xl:self-start bg-white p-3 rounded-lg shadow-sm">
			<div class=" space-y-2">
				<h2 class=" text-sm lg:text-lg font-bold">Your Order</h2>
				<div class="space-y-2">
					<div class="flex justify-between font-medium text-sm">
						<p>Subtotal</p>
						<p>₹{priceINR.toLocaleString("en-IN")}</p>
					</div>
					<div class="flex justify-between font-medium text-sm">
						<p>Tax</p>
						<p>charges apply</p>
					</div>
					<div class="flex border-t-1 pt-2 justify-between text-sm font-bold">
						<p>Total</p>
						<p>₹{priceINR.toLocaleString("en-IN")}</p>
					</div>
				</div>
			</div>
			{#if $cart.length}
				<div class="mt-4 w-full gap-2">
					{#if isLoggedIn}
						<button
							on:click={()=>goto('/checkout')}
							class="flex w-full text-xs sm:text-sm items-center justify-center gap-2 bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 py-2 rounded font-semibold">
							Checkout
				        </button>
					{:else}
						<button
							type="button"
							on:click={()=>goto('/login')}
							class="flex w-full text-xs sm:text-sm items-center justify-center gap-2 bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 py-2 rounded font-semibold"
						>
							Login to Proceed
						</button>
					{/if}					
				</div>
			{/if}
		</div>
	 
	</div>

</div>

{#if isLoggedIn  && filteredGuestCart.length}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click={handleClick}
		class="fixed {addToCartModal ? 'hidden' : ''} inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
	>
		<div bind:this={container} class="bg-white relative p-6 rounded shadow-lg w-11/12 sm:w-3/5 md:w-2/5 2xl:w-2/6 space-y-2">
            <button on:click={()=>{
				addToCartModal = !addToCartModal
				browser ? localStorage.clear() : ""
				invalidate("data:cart")
			}} class=" absolute right-5 top-5">
				<Icon icon="maki:cross" class=" text-lg sm:text-xl"/>
			</button>
			<Icon
				icon="fa-solid:cart-plus"
				width="60"
				height="60"
				class=" w-full text-center text-primary-600"
			/>
			<h1 class=" font-medium pt-2">You have added components to cart before Login</h1>
			<p class=" text-sm">{cartId.length ? "Are you willing to add in existing cart or create a new cart": "Create a new cart"}</p>
			<form method="POST" use:enhance={handleCart} class=" w-full flex items-center gap-6">
				{#if isLoggedIn && filteredGuestCart.length}
					<input type="hidden" name="cartId" value={cartId} />
				{/if}
				<input type="hidden" name="guestCart" value={JSON.stringify(filteredGuestCart)} />
				{#if cartId.length}
					<button
						type="submit"
						formaction="?/existingcart"
						class=" py-2 bg-primary-600 w-full rounded text-white font-medium text-sm"
						>Existing Cart</button
					>
				{/if}
				<button
					type="submit"
					formaction="?/newcart"
					class=" py-2 bg-primary-600 w-full rounded text-white font-medium text-sm"
					>New Cart</button
				>
			</form>
		</div>
	</div>
{/if}

<RecurrencePopup {recureModal} {recurrence} {cartId} togglePopup={() => (recureModal = !recureModal)} />


<!-- {#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
		<div class="bg-white p-6 rounded-lg w-full mx-2 md:w-1/3">
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
{/if} -->
