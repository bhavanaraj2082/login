<script>
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import { cart } from '$lib/stores/cart.js';
	import { sendMessage,generateInvoiceNumber } from '$lib/utils.js';
	import { enhance } from '$app/forms';
	import { authedUser, currencyState,cartTotalComps } from '$lib/stores/mainStores.js';
	import Icon from '@iconify/svelte';
	import { onMount, createEventDispatcher } from 'svelte';
	import { shippingAddress, billingAddress } from '$lib/stores/mainStores.js';
	import AddressForm from '$lib/components/Cart/AddressForm.svelte';
	import * as XLSX from 'xlsx';
	import {PUBLIC_IMAGE_URL} from "$env/static/public"

	export let data;
	$: userData = data.result.profileData;
	$: shipping = userData?.shippingAddress;
	$: billing = userData?.billingAddress;
	let loading = false;
	let priceINR = 0
	let priceUSD = 0
	let isForm = false
	let actionName
	let formData
	let isShowbox = true
	let order = ''
	let taxError = ''
	let gstNumber
	let orderLoad = false
	$:{
	  gstNumber	= userData?.gstNumber || ''
	} 
	let checkout
	let onSubmit = false
	let addressError = false
	let cartdata = data?.cart?.cart[0]?.cartItems || []
	//$:console.log(userData);
	$: isGST = userData.country === "India" ? true : false

	cart.set(cartdata)

	const calculateTotalPrice = (cart)=>{
       priceINR = cart.reduce((sum,crt)=> sum + crt.pricing.INR* (1 + (18 / 100))*crt.quantity,0)
       priceUSD = cart.reduce((sum,crt)=> sum + crt.pricing.USD * (1 + (18 / 100))*crt.quantity,0)
	}

	calculateTotalPrice($cart)

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
        item?.productDetails?.productName,
        item?.mfrDetails?.name,
        item.quantity,
        item.quantity - item?.stockDetails?.stock < 0 ? 0 : item.quantity - item?.stockDetails?.stock,
        $currencyState === "inr" ? "₹ "+item.currentPrice?.INR.toLocaleString("en-IN") : "$ "+item?.currentPrice?.USD.toLocaleString("en-IN"),
        $currencyState === "inr" ? "₹ "+(item?.pricing?.INR * item.quantity).toLocaleString("en-IN") : "$ "+ (item?.pricing?.USD * item.quantity).toLocaleString("en-IN"),
	]);

    // Calculate total price (sum of the last column - 'Extended Price')
    const totalPrice = $cart.reduce((total, item) => {
        return total + ($currencyState === "inr" ? (item?.pricing?.INR * item.quantity) : (item?.pricing?.USD * item.quantity));
    }, 0);

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

	let filteredBillingAddress
     let filteredShippingAddress
     let profileAddress
	 $:{
	 filteredBillingAddress = billing !== null ? billing : undefined
	 filteredShippingAddress = shipping !== null ? shipping : undefined
	// profileAddress = `${profile?.firstname} ${profile?.lastName || ''}, ${profile?.address1}, ${profile?.city}, ${profile?.country}, ${profile?.state}, ${profile?.postalcode}`;
   
	if (filteredBillingAddress !== undefined) {
		const { attentionTo,organizationName, department, street,building, city, state, location, postalCode } =
			filteredBillingAddress;

		$billingAddress = [attentionTo,organizationName, department, street,building, city, state, location, postalCode]
			.filter(Boolean)
			.join(', ');
	} else {
		$billingAddress = '';
	}

	if (filteredShippingAddress !== undefined) {
		const { attentionTo,organizationName, department, street,building, city, state, location, postalCode  } =
			filteredShippingAddress;

		$shippingAddress = [attentionTo,organizationName, department, street,building, city, state, location, postalCode ]
			.filter(Boolean)
			.join(', ');
	} else {
		$shippingAddress = '';
	}
    }
  
	const dispatch = createEventDispatcher();

	function handleCheckout(carts) {
		let products = [];
		let orderdetails = [];
		if (carts?.length === 0) {
			return;
		}
		carts?.map((cart) => {
			products.push(cart.productId);
			let backOrder = cart.quantity > cart.stockDetails.stock ? parseInt(cart.quantity) - parseInt(cart.stockDetails.stock) : 0;
			let price
			if(isGST){
				if($currencyState === "inr"){
				    price = cart.currentPrice.INR * (1 + (18 / 100))
			    }else{
				    price = cart.currentPrice.USD * (1 + (18 / 100))
			    }
			}else{
				if($currencyState === "inr"){
				    price = cart.currentPrice.INR
			    }else{
				    price = cart.currentPrice.USD
			    }
			}
			  
			orderdetails.push({
				backOrder,
				productId: cart.productId,
				extendedPrice: price * parseInt(cart.quantity),
				orderQty: cart.quantity,
				readyToShip: cart.quantity - backOrder,
				distributorId: cart.distributorId,
				manufacturerId: cart.manufacturerId,
				stockId: cart?.stockId,
				unitPrice: price,
				productName:cart.productDetails?.productName,
				productNumber:cart.productDetails?.productNumber,
				manufacturerName:cart?.mfrDetails?.name,
				returnPolicy:cart?.productDetails?.returnPolicy
				//distributorAlias:cart.distributorDetails.aliasname
			});
		});
        console.log('object',gstNumber);
		let order = {
			invoice:generateInvoiceNumber(),
			subtotalprice: $currencyState === "inr" ? priceINR : priceUSD,
			shippingprice: 0,
			totalprice: $currencyState === "inr" ? priceINR : priceUSD,
			products,
			orderdetails,
			billingaddress:$billingAddress,
			shippingaddress:$shippingAddress,
			gstNumber,
			currency: $currencyState === "inr" ? "INR" : "USD",
			profileId:userData._id
		};
		checkout = order;
	}
	$: handleCheckout($cart);

	const handleDispatchEvent =(e)=>{
		console.log(e.detail,"detail");
		//if(e.detail.success){
			invalidate("data:checkout")
		//}
	}

	const handleSubmit = ({cancel})=>{
		orderLoad = true
		onSubmit = true
		taxError = ''
		// if(!gstNumber.length){
		// 	console.log("gst Number",gstNumber);
		// 	taxError = "GST number is required"
		// 	cancel()
		// } 

		if($billingAddress === "" || $shippingAddress === ""){
			addressError = true
			orderLoad =false
			cancel()
		} 
		return async({result})=>{
			orderLoad = false
			console.log(result);
			if(result.data.success){
				localStorage.removeItem("totalCompsChemi")
				cartTotalComps.set(0)
				goto(`checkout/success/${result.data.orderId}?email=${result.data.email}`)
			}else{
				goto('checkout/failure')
			}
		}
	}

	const handlePayment = () => {
		console.log('clicked');
		dispatch('orderData', order);
	};

	const validateTax = (taxNum)=>{
		taxError = ''
		if(!taxNum.length) return
	   !/^[0-9]{2}[A-Za-z]{1}/.test(taxNum) || taxNum.length !== 15 ? taxError = "invalid GST number": taxError = ""
	   gstNumber = taxNum
	   handleCheckout($cart)
	}

</script>


{#if isForm}
	<AddressForm
	on:onSubmit={handleDispatchEvent}
	formdata={formData}
	handlePopupAddress = {()=>isForm = false}
	{actionName}
	firstname={userData?.firstName} 
	lastname={userData?.lastName} 
	{isShowbox}
	/>
{/if}

<section class=" mx-auto mb-4 w-11/12 sm:flex gap-4 sm:items-start space-y-4 sm:space-y-0 max-w-7xl">
	<div class="p-3 lg:p-4 sm:w-1/2 md:w-3/5 lg:w-3/4 bg-white shadow-sm rounded">
		<!-- <h3 class="text-md font-semibold text-gray-600">Address Selection</h3> -->
		 <div class=" flex flex-col md:flex-row gap-4 mb-1">
			<div class=" w-full font-medium text-sm text-gray-600">
				<label for="" >Email</label><br>
			    <input value={$authedUser.email} disabled class="mt-2 w-full outline-none rounded border-gray-200 focus:ring-0 border-1 focus:border-primary-500 p-1.5 text-sm" type="text">
			</div>
			<div class=" w-full font-medium text-sm text-gray-600">
				<div class=" flex items-center justify-between">
					GST Number
					<button on:click={()=>{}}
				    class=" p-1 hidden bg-gray-200 hover:text-white hover:bg-primary-500 rounded">
					    <Icon icon="ic:round-mode-edit" class=" text-md" />
					</button>
				</div>
				<input value={gstNumber} on:input={e=>validateTax(e.target.value)} class="mt-2 w-full uppercase outline-none rounded border-gray-200 focus:ring-0 border-1 focus:border-primary-500 p-1.5 text-sm" type="text">
		        <p class="{taxError.length ? "": "hidden text-green-400"} text-xs font-normal text-red-500 ">{taxError}</p>
			</div>
		 </div>
		<div class=" lg:flex gap-4">
			<div class=" w-full ">
				<div class="flex justify-between items-center my-1.5">
					<label for="billing-address" class="block font-medium text-sm text-gray-600">Billing Address</label>
					<button on:click={()=>{
						formData ={}
				        isForm = true
				        actionName = "billingaddress"
				        let address = filteredBillingAddress === undefined ? '' : filteredBillingAddress
				        formData = {userId:userData?._id,addAlternate:billing !== null ? false : true,...address}
				    }} 
				    class=" p-1 bg-gray-200 hover:text-white hover:bg-primary-500 rounded">
					    <Icon icon="ic:round-mode-edit" class=" text-md" />
					</button>
				</div>
				<textarea
					id="billing-address"
					disabled
					class="w-full p-2 h-16 lg:h-20 text-sm rounded border-gray-200 border focus:ring-0 focus:border-primary-500"
					placeholder=""
					bind:value={$billingAddress}
				/>
				<p class="{addressError && $billingAddress === '' ? "" :"hidden"} text-xs text-red-500">Please add billing address</p>
			</div>
			<div class="w-full ">
				<div class=" flex justify-between items-center my-1.5">
				    <label for="shipping-address" class="block font-medium text-sm text-gray-600">Shipping Address</label>
				    <button on:click={()=>{
						formData ={}
				        isForm = true
				        actionName = "shippingaddress"
				        let address = filteredShippingAddress === undefined ? '' : filteredShippingAddress
				        formData = {userId:userData?._id,addAlternate:shipping !== null ? false : true,...address}
				    }} 
					class="  p-1 bg-gray-200 hover:text-white hover:bg-primary-500 rounded">
					    <Icon icon="ic:round-mode-edit" class=" text-md" />
					</button>
				</div>
				<textarea
					id="shipping-address"
					disabled
					class="w-full p-2 h-16 lg:h-20 text-sm rounded border-gray-200 border focus:ring-0 focus:border-primary-500"
					placeholder=""
					bind:value={$shippingAddress}
				/>
				<p class="{addressError && $shippingAddress === '' ? "" :"hidden"} text-xs text-red-500">Please add shipping address</p>
			</div>
		</div>
	</div>
   
	<div class="w-full sm:w-1/2 md:w-2/5 lg:w-1/4">
		<div class=" bg-white mx-auto p-4 rounded shadow-sm ">
			<div class=" space-y-2">
				<h2 class=" text-lg lg:text-xl font-bold">Your Order</h2>
				<div class="space-y-2">
					<div class="flex justify-between font-medium text-sm">
						<p>Subtotal</p>
						<div class=" flex flex-col items-end">
						<p class=" font-semibold">{$currencyState === "inr" ? "₹" + priceINR.toLocaleString("en-IN"): "$"+ priceUSD.toLocaleString("en-IN")}</p>
                         <span class=" text-xs">including GST</span>
						</div>
					</div>
					<div class="flex justify-between font-medium text-sm">
						<p>Tax</p>
						<p class=" text-2s">charges apply</p>
					</div>
					<div class="flex border-t-1 pt-2 justify-between text-sm font-bold">
						<p>Total</p>
						<p>{$currencyState === "inr" ? "₹" + priceINR.toLocaleString("en-IN"): "$"+ priceUSD.toLocaleString("en-IN")}</p>
					</div>
				</div>
			</div>
			{#if $cart.length}
				<div class=" mt-4 grid grid-cols-2 gap-2">
					{#if $authedUser.email}
						<form method="POST" action="?/checkout" use:enhance={handleSubmit} class=" col-span-2">
							<input type="hidden" name="order" value={JSON.stringify(checkout)}/>
							{#if orderLoad}
							<button type="button" class="flex w-full text-xs sm:text-sm items-center justify-center gap-2 bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 py-1.5 rounded font-semibold ">
								<Icon icon="line-md:loading-loop" class=" text-xl"/>
							</button>
							{:else}
							<button
								type="submit" disabled={onSubmit || taxError.length}
								class="flex w-full text-xs sm:text-sm items-center justify-center gap-2 bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 py-2 rounded font-semibold "
							>
								Proceed to Order
							</button>
							{/if}
							
						</form>
					{/if}
				</div>
			{/if}
		</div>
	</div>

</section>

<div class="mx-auto w-11/12 mb-5 max-w-7xl">
	<div class=" w-full space-y-4">
		{#if loading}
			<div
				class="w-full h-72 flex flex-col gap-2 items-center justify-center bg-white p-4 rounded shadow-sm"
			>
				<p class=" font-medium text-lg md:text-xl xl:text-2xl">Loading...</p>
			</div>
		{:else if !$cart.length}
			<div class="w-full flex flex-col gap-2 items-center justify-center bg-white py-5 rounded shadow-sm">
				<Icon icon="ic:outline-shopping-cart" class="text-5xl text-primary-400 md:text-6xl" />
				<p class=" font-bold text-lg md:text-xl">Cart is Empty</p>
			</div>
		{:else}
			<div class="w-full bg-white p-3 sm:px-4 sm:py-3 rounded shadow-sm h-fit">
				<div class=" w-full flex items-center justify-between mb-4">
					<h2 class=" text-sm sm:text-lg lg:mb-3 font-semibold">
						Cart Items <span class="text-red-500">({$cart.length})</span>
					</h2>
					<div class="flex items-center gap-2">
						<button
					        type="button"
					        on:click={downloadExcel}
					        class=" text-2s sm:text-xs w-fit flex justify-center items-center gap-1 p-1.5 sm:px-4 md:py-2 rounded text-white bg-primary-500 hover:bg-primary-600 font-medium">
							<Icon icon="mdi:file-download" class="text-lg sm:text-xl rounded text-white"/>
					        <span class="hidden sm:block">Download</span>
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
				<img src="{PUBLIC_IMAGE_URL}/{item?.productDetails?.image}" onerror="this.src='{PUBLIC_IMAGE_URL}/default.jpg'"  alt={item?.productDetails?.productName} class="w-20 h-20 shrink-0 object-cover rounded-md" />
								<div class="ml-2">
									<p class="text-sm text-black font-semibold">{item?.productDetails?.productNumber}</p>
									<p class=" text-gray-800 text-xs lg:text-3s font-medium">{item?.productDetails?.productName}</p>
									<p class=" text-gray-600 text-xs font-semibold">{item?.pricing?.break}</p>
									<p class=" {item.quantity > item?.stockDetails?.stock ? " text-red-500" :" text-green-500"} text-xs font-semibold">
										{item.quantity > item?.stockDetails?.stock ? item.quantity - item?.stockDetails?.stock + " Back Order" : item?.stockDetails?.stock + " In Stock"}
										<span class="{item.quantity > item?.stockDetails?.stock ? "" : " hidden"} text-green-500 ml-1">{item?.stockDetails?.stock + " In Stock"}</span>
									</p>
								</div>
							</div>
                            <div class=" lg:w-6/12 sm:flex justify-between items-center">
							    
								 <div class=" lg:w-2/6">
									<h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Price</h3>
									<div class="{item.isCart || item.isQuote ? " text-green-500" : ""} text-xs gap-1 w-full font-semibold">
										<div class=" flex gap-2 sm:block">
									        {$currencyState === "inr" ? "₹" + (item?.currentPrice?.INR * (1 + (18 / 100))).toLocaleString("en-IN"): "$"+ (item?.currentPrice?.USD * (1 + (18 / 100))).toLocaleString("en-IN")} with GST
										    <p class=" {item.isCart || item.isQuote ? "" : "hidden"} line-through text-slate-300">
										    {$currencyState === "inr" ? "₹" + (item?.normalPrice?.INR * (1 + (18 / 100))).toLocaleString("en-IN"): "$"+ (item?.normalPrice?.USD * (1 + (18 / 100))).toLocaleString("en-IN")} with GST
										    </p>
									    </div>
									<div class=" text-2s text-gray-400 flex gap-2 sm:block">
										{$currencyState === "inr" ? "₹" + item?.currentPrice?.INR.toLocaleString("en-IN"): "$"+ item?.currentPrice?.USD.toLocaleString("en-IN")} without GST
										<p class=" {item.isCart || item.isQuote ? "" : "hidden"} line-through text-slate-300">
										{$currencyState === "inr" ? "₹" + item?.normalPrice?.INR.toLocaleString("en-IN"): "$"+ item.normalPrice?.USD.toLocaleString("en-IN")} without GST
										</p>
									</div>
									</div>
									<!-- <div class="text-xs w-full font-semibold">
									    <p>₹{(item.pricing.INR * (1 + (18 / 100))).toLocaleString("en-IN")} with GST</p>
									 
									</div> -->
								
							    </div>
								<div class=" lg:w-2/6">
							        <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Quantity</h3>
							        	<div class="flex items-center rounded">
							        		<!-- <button
							        			on:click={() => decrementQuantity(item.quantity,item.stockDetails.stock,item._id,index)}
							        			class=" border-r-1 p-1.5 text-primary-500"
							        			><Icon icon="rivet-icons:minus" class="text-xs" /></button
							        		> -->
							        		<p class="w-fit text-sm font-medium outline-none text-center">
							        			{item.quantity}
							        		</p>
							        		<!-- <button
							        			on:click={() => incrementQuantity(item.quantity,item.stockDetails.stock,item._id,index)}
							        			class=" border-l-1 p-1.5  text-primary-500">
												<Icon icon="rivet-icons:plus" class="text-xs" />
											</button> -->
							        	</div>
							        </div>
								<div class=" lg:w-2/6">
							        <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Total</h3>
							        <div class=" w-full flex justify-start items-center">
									<div class=" {item.isCart || item.isQuote ? " text-green-500" : ""} text-xs w-full font-semibold">
										<div class=" flex gap-2 sm:block">
											{$currencyState === "inr" ? "₹" + (item?.currentPrice?.INR * (1 + (18 / 100)) * item.quantity).toLocaleString("en-IN"): "$"+ (item?.currentPrice?.USD * (1 + (18 / 100)) * item.quantity).toLocaleString("en-IN")} with GST
										    <p class=" {item.isCart || item.isQuote ? "" : "hidden"} line-through text-slate-300">
										    {$currencyState === "inr" ? "₹" + (item?.normalPrice?.INR * (1 + (18 / 100)) * item.quantity).toLocaleString("en-IN"): "$"+ (item?.normalPrice?.USD * (1 + (18 / 100)) * item.quantity).toLocaleString("en-IN")} with GST
										    </p>
										</div>
										<div class="  text-gray-400 text-2s flex gap-2 sm:block">
											{$currencyState === "inr" ? "₹" + (item?.currentPrice?.INR * item.quantity).toLocaleString("en-IN"): "$"+ (item?.currentPrice?.USD * item.quantity).toLocaleString("en-IN")} without GST
											<p class=" {item.isCart || item.isQuote ? "" : "hidden"} line-through text-slate-300">
											{$currencyState === "inr" ? "₹" + (item?.normalPrice?.INR * item.quantity).toLocaleString("en-IN"): "$"+ (item?.normalPrice?.USD * item.quantity).toLocaleString("en-IN")} without GST
											</p>
									    </div>
										</div>
							        	<div class="text-xs font-semibold">
							        		
										</div>
							        </div>
								</div>
						    </div>
						</li>
					{/each}
				</ul>
			</div>
		
		{/if}


	</div>
	
</div>
