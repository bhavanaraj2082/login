<script>
	import { sendMessage } from '$lib/utils.js';
	import { goto,invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { authedUser ,currencyState,cartTotalComps } from '$lib/stores/mainStores.js';
	import Icon from '@iconify/svelte';
	import { onMount, onDestroy } from 'svelte';
	import RecurrencePopup from '$lib/components/Cart/RecurrencePopup.svelte';
	import { cart, guestCart,removeFromCart } from '$lib/stores/cart.js';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import * as XLSX from 'xlsx';
	import { PUBLIC_IMAGE_URL } from "$env/static/public"

	export let data
	let loading = true;
	let isLoggedIn = $authedUser?.id ? true : false
	let filteredGuestCart = ''
	let container
	let addToCartModal = false
	let recureModal = false
	let timeout
	let priceINR = 0
	let priceUSD = 0
	let checkout,items
	let scrollto = false
	let isHide = false
	let isDeleteAll = false
	let tog = null
	let checkoutDisabled = false
	let selectedId = ''

	$: cartData = data?.cart[0]?.cartItems || [];
	$: cart.set(cartData);
	$: cartId = data?.cart[0]?.cartId || '';
	$: cartName = data?.cart[0]?.cartName || '';
	$: recurrence = data?.cart[0]?.recurrence || '';
    //$:console.log($cart,"forntend");
	$: a = browser ? JSON.parse(localStorage.getItem("cart")) :[]
	$: guestCart.set(a)

	const calculateTotalPrice = (cart)=>{
       priceINR = cart.reduce((sum,crt)=> sum + crt.currentPrice.INR*crt.quantity,0)
       priceUSD = cart.reduce((sum,crt)=> sum + crt.currentPrice.USD*crt.quantity,0)
	}
	$:calculateTotalPrice($cart)
	const guestCartFetch = () => {
		const formdata = new FormData();
		formdata.append('guestCart', JSON.stringify($guestCart));
		sendMessage('?/guestCart', formdata, async (result) => {
		    console.log("guest cart in coponent",result);
			cart.set(result.cart);
			loading = false
			calculateTotalPrice($cart);
		});
	};
	let scrollTimeout

	const handleScroll = (e) => {
	isHide = true;
	clearTimeout(scrollTimeout);
	scrollTimeout = setTimeout(() => {
      isHide = false;
    }, 400)
	}

	let hoveredItem = null; 
    function handleMouseEnter(imageSrc, index) {
       hoveredItem = { imageSrc, index }; 
    }

    function handleMouseLeave() {
      hoveredItem = null; 
    }
    onMount(() => {
		//window.addEventListener('scroll', handleScroll)
		filteredGuestCart = $guestCart.filter(guestItem => 
            !$cart.some(cartItem => cartItem.productId === guestItem.productId)
        );
		//console.log('object',filteredGuestCart);

		if (!isLoggedIn) {
			if ($guestCart.length) {
				guestCartFetch();
			} else {
			loading = false
				cart.set([]);
			}
		} else {
			let cartData = data?.cart[0]?.cartItems || [];
			cart.set(cartData);
			loading = false
		    calculateTotalPrice($cart);
			if(isLoggedIn && filteredGuestCart.length && !cartId.length){
	    	const formdata = new FormData()
	    	formdata.append("guestCart",JSON.stringify(filteredGuestCart))
	    	sendMessage("?/newcart",formdata,(result)=>{
	    		console.log(result);
	    		localStorage.removeItem("cart")
				filteredGuestCart = []
	    		invalidate("data:cart")
	    	})
	    }
		}
    });
	let showModal = false;

	const toggleModal = () => {
		showModal = !showModal;
	};

	const handleClick = (e) => {
		if (!container.contains(e.target)) {
			addToCartModal = !addToCartModal;
		}
	};
    
	$:syncLocalStorageToStore($cart.length)
	function syncLocalStorageToStore(count) {
    // Check if we are in the browser
      if (typeof window !== 'undefined') {
        const storedTotalComps = localStorage.getItem('totalCompsChemi');
        if (storedTotalComps ) {
            cartTotalComps.set(Number(count));
        }
     }
    }
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

    // console.log($cart);

    const data = $cart.map((item) => [
        item?.productDetails?.productName,
        item?.mfrDetails?.name,
        item.quantity,
        item.quantity - item?.stockDetails?.stock < 0 ? 0 : item.quantity - item?.stockDetails?.stock,
		$currencyState === "inr" ? "₹ "+item?.currentPrice?.INR.toLocaleString("en-IN") : "$ "+item?.currentPrice?.USD.toLocaleString("en-IN"),
        $currencyState === "inr" ? "₹ "+(item?.pricing?.INR * item.quantity).toLocaleString("en-IN") : "$ "+ (item?.pricing?.USD * item.quantity).toLocaleString("en-IN"),
      ]);

    // Calculate total price (sum of the last column - 'Extended Price')
    const totalPrice = $cart.reduce((total, item) => {
        return total + ($currencyState === "inr" ? (item.pricing.INR * item.quantity) : (item.pricing.USD * item.quantity));
    }, 0);
	console.log(totalPrice,"PPP");
    
    // Add a new row for the total price at the bottom
    const totalRow = [
        '', '', '', '', 'Total Price',($currencyState === "inr" ? "₹ " : "$")+totalPrice.toLocaleString("en-IN")
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
	const handleQty = (quantity,stock,_id,indx)=>{
		if(isNaN(quantity)){
			//calculateTotalPrice($cart)
			quantity = 1
		}
		if (quantity > 10000000){
			quantity = 10000000
		}
		if(quantity <= stock.orderMultiple || isNaN(quantity)) quantity = stock.orderMultiple
		clearTimeout(timeout)
        checkoutDisabled = true
		let sec = !isLoggedIn ? 500 : 1500
		timeout = setTimeout(()=>{

		if(!isLoggedIn){
			const selectedQty = Math.ceil(quantity/ stock.orderMultiple) * stock.orderMultiple

			cart.update(item=>{
				item[indx].quantity = selectedQty 
				return item
			})
			// guestCart.update(item=>{
			// item[indx].quantity = selectedQty
			// return item
		    // })
			calculateTotalPrice($cart)
			timeout = setTimeout(()=>{
			tog = null
	        },sec)
		return
			
		}
        selectedId = _id
			const index = $cart.findIndex((item) =>item._id === _id);
		if (index !== -1) {
			cart.update(item=>{
				item[index].quantity = Math.ceil(quantity/ item[index].stockDetails.orderMultiple) * item[index].stockDetails.orderMultiple
				return item
			})
		}
		  const formdata = new FormData()
		  formdata.append("_id",_id)
		  formdata.append("stock",stock)
		  formdata.append("quantity",$cart[index]?.quantity)
		  formdata.append("cartId",cartId)
		  sendMessage("?/updateQty",formdata,async(result)=>{
			invalidate("data:cart")
			calculateTotalPrice($cart)
            tog = null
			selectedId = ''
            checkoutDisabled = false
		  })
	  },1400)
	}

	const incrementQuantity = (quantity,stock,_id,indx) => {
		if (quantity >= 10000000) return
		clearTimeout(timeout)
        checkoutDisabled = true
		if(!isLoggedIn){
			cart.update(item=>{
				item[indx].quantity = quantity + item[indx].stockDetails.orderMultiple
				return item
			})
			// guestCart.update(item=>{
			// item[indx].quantity = quantity + item[indx].stockDetails.orderMultiple
			// return item
		    // })
			calculateTotalPrice($cart)
			return
		}
		selectedId = _id
	    const index = $cart.findIndex((item) =>item._id === _id);
		if (index !== -1) {
			cart.update(item=>{
				item[index].quantity = quantity + item[index].stockDetails.orderMultiple
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
			invalidate("data:cart")
			calculateTotalPrice($cart)
			checkoutDisabled = false
			selectedId = ''
		  })
	  },1000)

	};

	const decrementQuantity = (quantity,stock,_id,indx) => {
		clearTimeout(timeout)
        checkoutDisabled = true
           
			if(!isLoggedIn){
			cart.update(item=>{
				if(item[indx].quantity <= stock.orderMultiple) return item
				item[indx].quantity = quantity - item[indx].stockDetails.orderMultiple
				return item
			})
			// guestCart.update(item=>{
			//     if(item[indx].quantity <= stock.orderMultiple) return item
			//     item[indx].quantity = quantity - item[indx].stockDetails.orderMultiple
			//     return item
		    // })
			calculateTotalPrice($cart)
			return
		}
		selectedId = _id
	    const index = $cart.findIndex((item) =>item._id === _id);
		if (index !== -1) {
			cart.update(item=>{
				if(item[indx].quantity <= stock.orderMultiple) return item
				item[index].quantity = quantity - item[index].stockDetails.orderMultiple
				return item
			})
		}
		timeout = setTimeout(()=>{
		  const formdata = new FormData()
		  formdata.append("_id",_id)
		  formdata.append("stock",stock)
		  formdata.append("quantity",$cart[index].quantity)
		  formdata.append("cartId",cartId)
		  sendMessage("?/updateQty",formdata,async(result)=>{
			invalidate("data:cart")
			calculateTotalPrice($cart)
			checkoutDisabled = false
			selectedId = ''
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
			// console.log(result);
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
			// console.log(result);
			if(result.success){
				toast.success(result.message)
			}else{
				toast.error(result.message)
			}
			isDeleteAll = false
			invalidate("data:cart")

		})
	};

	function setRedirectUrl() {
		const currentUrl = $page.url.href;
		document.cookie = `redirectUrl=${encodeURIComponent(currentUrl)}; path=/;`;
	}

	let selectedImage = null;
	let showimage=false;
	function imagemodal(imageSrc) {
		selectedImage = imageSrc;
		showimage=true;
	}
	function closePopup() {
		showimage = false;
		selectedImage = null;
	}
	
	function handleCart({ cancel }) {
		return async ({ result }) => {
			// console.log(result);
			addToCartModal = !addToCartModal;
			removeFromCart();
			calculateTotalPrice($cart)
			toast.success('Components are added to cart');
			invalidate('data:cart');
		};
	}
	
</script>


<div on:scroll={handleScroll} class=" relative hide mx-auto bg-gray-50 mb-5">
	<!-- <button class="{isHide ? "hidden" : ""} fixed xl:hidden {scrollto ? "top-48 sm:top-28 " : "top-24 sm:top-36"}   right-2 z-20 rounded border shrink-0 p-1.5 bg-primary-100 hover:text-white hover:bg-primary-600" 
	on:click={()=>{
	   scrollto = !scrollto
	   if(scrollto){
		checkout.scrollIntoView({ behavior: 'smooth' })
	   }else{
		items.scrollIntoView({ behavior: 'smooth' })
		window.scrollTo({top:0,behavior:"smooth"})
	   }
	}}>
		<Icon icon={scrollto ? "zondicons:cheveron-up" :"zondicons:cheveron-down"} class='text-2xl'/>
	</button> -->
	<div class=" w-11/12 mx-auto flex flex-col xl:flex-row justify-between gap-4 max-w-7xl">
		{#if loading}
			<div
				class="w-full h-72 flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white p-4 rounded-md shadow-md">
				<p class=" font-medium text-lg md:text-xl xl:text-2xl"> <Icon icon="line-md:loading-loop" class="text-4xl text-primary-500"/></p>
			</div>
		{:else if !$cart.length}
			<div class="w-full flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white py-5 rounded-md shadow">
				<Icon icon="ic:outline-shopping-cart" class="text-5xl text-primary-400 md:text-6xl" />
				<p class=" font-bold text-lg md:text-xl">Cart is Empty</p>
			</div>
		{:else}
			<div bind:this={items} class="w-full lg:w-4/4 xl:w-3/4 bg-white p-3 sm:px-4 sm:py-3 rounded-lg shadow h-fit">
				<div class=" w-full sticky top-0 z-10 bg-white flex items-center justify-between mb-4 sm:space-y-1">
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
					        class="{isLoggedIn ? "" : "hidden"} text-2s sm:text-xs w-fit flex justify-center items-center gap-1 p-1.5 sm:px-4 md:py-2 rounded-md text-white bg-primary-500 hover:bg-primary-600 font-medium">
							<Icon icon="iconoir:calendar-rotate-solid" class=" text-lg sm:text-xl rounded-md text-white"/>
					        <span class="hidden sm:block">{recurrence?.recurring ? "Edit" : "Recurrence"}</span>
						</button>
						<button
					        type="button"
					        on:click={downloadExcel}
					        class=" text-2s sm:text-xs w-fit flex justify-center items-center gap-1 p-1.5 sm:px-4 md:py-2 rounded-md text-white bg-primary-500 hover:bg-primary-600 font-medium">
							<Icon icon="mdi:file-download" class="text-lg sm:text-xl rounded-md text-white"/>
					        <span class="hidden sm:block">Download</span>
						</button>
				        <button
					        type="button"
					        on:click={()=>isDeleteAll = true}
					        class=" text-2s sm:text-xs w-fit flex justify-center items-center gap-1 p-1.5 sm:px-4 md:py-2 rounded-md text-white bg-primary-500 hover:bg-primary-600 font-medium">
							<Icon icon="mdi:delete-forever" class="text-lg sm:text-xl rounded-md text-white"/>
							<span class="hidden sm:block">Delete All</span>
						</button>
						<button class="{isHide || $cart.length <= 10 ? "hidden" : ""} right-2 z-20 rounded-md shrink-0 sm:p-1.5 p-1 bg-primary-200 hover:text-white hover:bg-primary-600" 
							on:click={()=>{
							   scrollto = !scrollto
							   if(scrollto){
								checkout.scrollIntoView({ behavior: 'smooth' })
							   }else{
								items.scrollIntoView({ behavior: 'smooth' })
								window.scrollTo({top:0,behavior:"smooth"})
							   }
							}}>
								<Icon icon={scrollto ? "zondicons:cheveron-up" :"zondicons:cheveron-down"} class='text-2xl'/>
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
								<div class="relative">
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
									<!-- <img src={item.productDetails.imageSrc}  class=" cursor-pointer w-20 h-20 object-contain rounded-md"
									on:click={() => imagemodal(item.productDetails.imageSrc)} /> -->

									<img 
									src="{PUBLIC_IMAGE_URL}/{item.productDetails?.image}"
									onerror="this.src='{PUBLIC_IMAGE_URL}/default.jpg'" 
									class="cursor-pointer w-24 h-24 objec-cover bg-red-200" 
									alt={item.productDetails?.productName}
									on:click={() => imagemodal(item.productDetails?.image)}
									on:mouseenter={() => handleMouseEnter(item.productDetails?.image , index)}
									on:mouseleave={handleMouseLeave}
								  />
								   {#if hoveredItem && hoveredItem.image === item.productDetails?.image && hoveredItem.index === index}
									<div
									  class="absolute bottom-3/4 left-1/2 transform -translate-x-1/2 mb-2 z-50 whitespace-nowrap text-xs text-description font-medium py-1 px-4 rounded-md shadow-lg border leading-snug bg-black text-white"
									>
									  Click to view <br />larger image
									  <div
										class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black"
									  >
									  
									</div>
									</div>
								  {/if}
									<!-- {#if showimage}
										<div
										on:click={(e) => {
											if (e.target === e.currentTarget) {
												showimage = false;
											}
										}}
										class="fixed inset-0 bg-gray-900 bg-opacity-25 backdrop-blur-xs flex items-center justify-center z-50">
										<div class="bg-white rounded-lg shadow-md p-6 mx-4 w-full md:w-1/2 lg:w-1/3">
											<div class="flex justify-end items-center mb-2">
												<button
													on:click={closePopup}
													class="rounded-md hover:bg-slate-200 duration-200"
												>
													<Icon icon="si:close-duotone" class="text-3xl text-red-600" />
												</button>
											</div>
										   <img src="{PUBLIC_IMAGE_URL}/{selectedImage}" 
											onerror="this.src='{PUBLIC_IMAGE_URL}/default.jpg'" 
											alt="image" class="" />
										</div>
									</div>
								    {/if} -->
								</div>
								<div class="ml-2">
									<a href="/products/details/{item.productDetails?.productNumber}" class="text-xs hover:text-primary-500 hover:underline text-black font-semibold">{item?.productDetails?.productNumber}</a>
									<div class="relative cursor-pointer text-gray-800 group text-xs">{item.productDetails?.productName.length >40 ? item.productDetails?.productName.substring(0,40)+"..." : item.productDetails?.productName}
                                       <p class=" absolute bg-white hidden border p-1.5 rounded shadow-md {item.productDetails?.productName.length >40 ? "group-hover:block" :""}  md:w-max top-0">{item.productDetails?.productName}</p>
									</div>
									<p class=" text-gray-800 text-2s font-semibold">{item?.pricing?.break}</p>
									<p class=" {item?.quantity > item?.stockDetails?.stock ? " text-red-500" :" text-green-500"} text-2s ext-red-600 font-semibold">
										{item?.quantity > item?.stockDetails?.stock ? item?.quantity - item?.stockDetails?.stock + " Back Order" : item?.stockDetails?.stock + " In Stock"}
										<span class="{item?.quantity > item?.stockDetails?.stock ? "" : " hidden"} text-green-500 ml-1">{item?.stockDetails?.stock + " In Stock"}</span>
									</p>
									<p class=" text-[10.5px] font-semibold">Order Multiple {item?.stockDetails?.orderMultiple}</p>
								</div>
							</div>
                            <div class=" lg:w-6/12 sm:flex justify-between items-center">
							    
								 <div class=" lg:w-2/6">
									<h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Price</h3>
									<div class="{item?.isCart || item?.isQuote ? " text-green-500" : ""} text-xs flex lg:flex-col lg:gap-0 gap-1 w-full font-semibold text-content">
										{$currencyState === "inr" ? "₹" + item?.currentPrice?.INR?.toLocaleString("en-IN"): "$"+ item?.currentPrice?.USD?.toLocaleString("en-IN")}
										<p class=" {item.isCart || item.isQuote ? "" : "hidden"} text-xs line-through text-slate-300">
										{$currencyState === "inr" ? "₹" + item?.normalPrice?.INR?.toLocaleString("en-IN"): "$"+ item?.normalPrice?.USD?.toLocaleString("en-IN")}
										</p>
									</div>
								 </div>
							
								<div class=" lg:w-2/6">
							        <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Quantity</h3>
							        <div class="flex items-center md:w-2/12">
										<input type="number" bind:value={item.quantity}
										on:input={e=>handleQty(parseInt(e.target.value),item?.stockDetails,item._id,index)}
										class="{tog === index ? "" : "hidden"} border border-gray-200 rounded-md outline-none text-xs p-1 font-medium focus:ring-0 focus:border-primary-400" min="1" max="10000000">
							        	<div class=" {tog === index ? "hidden" : ""} flex items-center border-1 rounded-md">
							        		{#if item.isCart || item.isQuote}
											<button
											class="p-1.5 bg-gray-200 text-white "
											><Icon icon="rivet-icons:minus" class="text-xs" /></button
										     >
										     <button class="w-fit px-3 py-0.5 text-xs font-medium outline-none text-center">
											     {item.quantity === null ? "" : item.quantity}
										     </button>
										     <button
											    class="p-1.5 bg-gray-200 text-white ">
											   <Icon icon="rivet-icons:plus" class="text-xs" />
										      </button>
											{:else}
											<button disabled={selectedId.length && item._id !== selectedId}
							        			on:click={() => decrementQuantity(item.quantity,item?.stockDetails,item._id,index)}
							        			class="p-1.5 disabled:bg-gray-200 disabled:text-white text-primary-500"
							        			><Icon icon="rivet-icons:minus" class="text-xs" /></button
							        		>
							        		<button on:click={()=>{tog = index}} disabled={selectedId.length && item._id !== selectedId} class="w-fit px-3 py-0.5 text-xs font-medium outline-none text-center">
							        			{item.quantity === null ? "" : item.quantity}
							        		</button>
							        		<button disabled={selectedId.length && item._id !== selectedId }
							        			on:click={() => incrementQuantity(item.quantity,item?.stockDetails,item._id,index)}
							        			class="p-1.5 disabled:bg-gray-200 disabled:text-white text-primary-500">
												<Icon icon="rivet-icons:plus" class="text-xs" />
											</button>
											{/if}
							        	</div>
							        </div>
							    </div>
							
								<div class=" lg:w-2/6">
							        <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Total</h3>
							        <div class=" w-full flex justify-between items-center">
							        	<div class="{item?.isCart || item?.isQuote ? " text-green-500" : ""} text-xs flex gap-1 lg:flex-col lg:gap-0 font-semibold">
											{#if $authedUser?.id}
											{$currencyState === "inr" ? "₹" + item?.itemTotalPrice?.totalINR?.toLocaleString("en-IN"): "$"+ item?.itemTotalPrice?.totalUSD?.toLocaleString("en-IN")}
											{:else}
											{$currencyState === "inr" ? "₹" + (item?.normalPrice?.INR*item.quantity)?.toLocaleString("en-IN"): "$"+ (item?.normalPrice?.USD*item.quantity)?.toLocaleString("en-IN")}
											{/if}
										    <p class=" {item.isCart || item.isQuote ? "" : "hidden"} text-xs line-through text-slate-300">
												{$currencyState === "inr" ? "₹" + (item?.normalPrice?.INR*item.quantity)?.toLocaleString("en-IN"): "$"+ (item?.normalPrice?.USD*item.quantity)?.toLocaleString("en-IN")}
											</p>
									    </div>
							        	<button
							        		type="button"
							        		on:click={() => removeItem(item?.productDetails?.productNumber,item._id,index)}
							        		class=" text-lg sm:hidden text-primary-600"
							        	>
							        		<Icon icon="mdi:delete-forever" class=" text-xl" />
							        	</button>
							        </div>
								</div>
								<button
							        type="button" on:click={() => removeItem(item?.productDetails?.productNumber,item._id,index)}
							        class=" text-lg hidden sm:block text-primary-600">
							        <Icon icon="mdi:delete-forever" class=" text-2xl" />
							    </button>
						    </div>
						</li>
					{/each}
				</ul>
			</div>
		
		{/if}

		 <div bind:this={checkout} class="w-full sticky top-0 sm:w-2/4 md:w-2/5 lg:w-2/6 xl:w-1/4 self-end xl:self-start bg-white p-3 rounded-lg shadow">
			<div class=" space-y-2">
				<h2 class=" text-sm lg:text-lg font-bold">Your Order</h2>
				<div class="space-y-2">
					<div class="flex justify-between font-medium text-sm">
						<p>Subtotal</p>
						<p>
							{$currencyState === "inr" ? "₹" + priceINR.toLocaleString("en-IN"): "$"+ priceUSD.toLocaleString("en-IN")}
						</p>
					</div>
					<div class="flex justify-between font-medium text-sm">
						<p>Tax</p>
						<p>charges apply</p>
					</div>
					<div class="flex border-t-1 pt-2 justify-between text-sm font-bold">
						<p>Total</p>
						<p>
							{$currencyState === "inr" ? "₹" + priceINR.toLocaleString("en-IN"): "$"+ priceUSD.toLocaleString("en-IN")}
						</p>
					</div>
				</div>
			</div>
			{#if $cart.length}
				<div class="mt-4 w-full gap-2">
					{#if isLoggedIn}
						<button disabled={checkoutDisabled}
							on:click={()=>goto('/checkout')}
							class="flex w-full text-xs sm:text-sm items-center justify-center gap-2 bg-primary-500 text-white hover:bg-primary-600 py-2 rounded-md font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed">
							Checkout
				        </button>
					{:else}
					<button
							type="button"
							on:click={()=>goto('/signin')}
							class="flex w-full text-xs sm:text-sm items-center justify-center gap-2 bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 py-2 rounded-md font-semibold"
						>
							SignIn to Proceed
						</button>
						<!-- <button
							type="button"
							on:click={()=>goto('/login')}
							class="flex w-full text-xs sm:text-sm items-center justify-center gap-2 bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 py-2 rounded font-semibold"
						>
							Login to Proceed
						</button> -->
					{/if}					
				</div>
			{/if}
		</div>
	 
	</div>
	<div class="" bind:this={checkout}></div>

</div>

{#if isLoggedIn  && filteredGuestCart.length && cartId.length}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click={handleClick}
		class="fixed {addToCartModal ? 'hidden' : ''} inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
	>
		<div bind:this={container} class="bg-white relative p-6 rounded-md shadow-lg w-11/12 sm:w-3/5 md:w-2/5 2xl:w-2/6 space-y-2">
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
			<h1 class=" font-medium pt-2">You have added components to cart before SignIn</h1>
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
						class=" py-2 bg-primary-600 w-full rounded-md text-white font-medium text-sm"
						>Existing Cart</button
					>
				{/if}
				<button
					type="submit"
					formaction="?/newcart"
					class=" py-2 bg-primary-600 w-full rounded-md text-white font-medium text-sm"
					>New Cart</button
				>
			</form>
		</div>
	</div>
{/if}

<RecurrencePopup {recureModal} {recurrence} {cartId} togglePopup={() => (recureModal = !recureModal)} />
	
{#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
		<div class="bg-white p-6 rounded-lg w-full mx-2 md:w-1/3">
			<p class="text-xl font-bold mb-2">Please Log In</p>
			<p class="text-sm mb-4">You need to log in to continue. Click the button below to log in.</p>
			<div class="flex gap-4 justify-between">
				<button
					class=" text-gray-500 border bottom-2 py-2 px-4 rounded-md hover:bg-gray-300"
					on:click={toggleModal}
				>
					Cancel
				</button>
				<a href="/signin" on:click={setRedirectUrl} class="bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-700">
					SignIn
				</a>
				<!-- <a href="/login" on:click={setRedirectUrl} class="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-700">
					Login
				</a> -->
			</div>
		</div>
	</div>

{/if}

{#if showimage}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={(e) => {
	if (e.target === e.currentTarget) {
	showimage = false;}
	}} class="fixed inset-0 bg-black shadow-xl bg-opacity-75 flex items-center justify-center z-50">
	<div class="bg-white rounded-lg shadow-lg p-6 mx-4 w-full md:w-1/2 lg:w-1/3">
	<div class="flex justify-end items-center mb-2">
		<button
		class="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
		on:click={closePopup}>
		<Icon icon="mdi:close" class="text-xl text-red-500 hover:text-red-700" />
	  </button>
   </div>
<img src="{PUBLIC_IMAGE_URL}/{selectedImage}" onerror="this.src='{PUBLIC_IMAGE_URL}/default.jpg'"  alt="" class=" w-72 h-72 md:w-96 md:h-96 mx-auto bject-cover " /></div>
</div>
{/if}

{#if isDeleteAll}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click={(e) => {
			if (e.target === e.currentTarget) {
				isDeleteAll = false;
			}
		}}
		class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
	>
		<div
			class="bg-white py-6 px-4 rounded flex flex-col shadow-lg w-11/12 sm:w-2/4 lg:w-96 space-y-2"
		>
			<p class=" font-medium">Are you sure you want to delete all the products?</p>
			<div class="flex items-center gap-5">
				<button class=" w-full py-1.5 bg-primary-500 text-white rounded" on:click={() => emptyCart()}>Delete</button>
				<button class=" w-full py-1.5 text-primary-500 bg-white border-1 border-primary-500 rounded" on:click={() => (isDeleteAll = false)}>Cancel</button>
			</div>
		</div>
	</div>
{/if}

