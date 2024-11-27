<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { authedUser } from '$lib/stores/mainStores.js';
	import Icon from '@iconify/svelte';
	import { onMount, createEventDispatcher } from 'svelte';
	import { cartState,updateCartState } from '$lib/stores/cartStores.js';
	import jsPDF from 'jspdf'
	import { toast } from 'svelte-sonner';
	import 'jspdf-autotable';
    
	const dispatch = createEventDispatcher()


	let timestamp
	let loading = true
	$: cartItems = $cartState;
	let subtotal = 0;
	let tax = 0;
	let total = 0;
	let totalPrice = 0
	let order = ''

	$: if(!$cartState.length){
		subtotal = 0
		totalPrice =0
		tax = 0
		total = 0
		subtotal = 0
	}

const generatePDFDocument = () => {
    const total = $cartState.reduce((sum, item) => sum + parseFloat(item.priceSize.price.replace(/[^\d.-]/g, '')) * item.quantity, 0);
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Chemikart Cart Summary', 14, 20);

    doc.setFont('helvetica'); 

    const tableColumns = ['Products', 'Price', 'Quantity', 'Total'];
    const tableData = $cartState.map(item => [
        `${item.partNumber}\n${item.name}\n${item.priceSize.size}`,
        `${parseFloat(item.priceSize.price.replace(/[^\d.-]/g, ''))}`, // Use the ₹ symbol here
        `${item.quantity}`,
        `${parseFloat(item.priceSize.price.replace(/[^\d.-]/g, '')) * item.quantity}`, // Use the ₹ symbol for total as well
    ]);

    tableData.push([
        'Total Price',
        '', 
        '', 
        `${total}`, 
    ]);

    doc.autoTable({
        head: [tableColumns],
        body: tableData,
        startY: 30,
        margin: { top: 10 },
        styles: {
            fontSize: 12,
            cellPadding: 5,
            halign: 'left',
            lineWidth: 0, 
        },
        headStyles: {
            fillColor: [255, 229, 204], 
            textColor: [0, 0, 0], 
            fontSize: 12,  
            cellPadding: 5,
        },
        theme: 'striped', 
        tableLineWidth: 0, 
        tableLineColor: [255, 255, 255], 
        rowStyles: (rowIndex) => ({
            fillColor: rowIndex % 2 === 0 ? [245, 245, 245] : [255, 255, 255], 
        }),
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


	const functionDispatch = ()=>{
    let expireTime = 12*60*60*1000
	if(!$cartState.length){
		console.log('cart empty');
		return
	}
    if(browser){
		timestamp = browser ? JSON.parse(localStorage.getItem("cartTimeStamp")) : null
    
	  if(timestamp === null){
		timestamp = Date.now()
		localStorage.setItem("cartTimeStamp",timestamp)
	  }
		if(Date.now()>timestamp + expireTime){
			console.log("items has expired");
            dispatch("onCart",{isExpired:true})
		}else{
            dispatch("onCart",{isExpired:false})
			console.log("item is still valid");
		}
	}
    }

	const calculateTotals = () => {
		subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.priceSize.price.replace(/[^\d.-]/g, '')) * parseInt(item.quantity), 0);
		    tax = subtotal * 0;
		    total = subtotal + tax;

		let ordernumber = Math.floor(Math.random() * 900000) + 100000
		let products = []
		let orderdetails = cartItems.map(item=>{
            const {_id,name,partNumber,quantity,priceSize,stock} = item
			const parsedPrice = parseFloat(priceSize.price.replace(/[^\d.-]/g, ''))
			const parsedQty = parseInt(quantity)
			const parsedStock = parseInt(stock)

			products.push(_id)
			totalPrice = parsedQty * parsedPrice
			let backOrder = parsedQty > stock ? parsedQty - parsedStock : 0;
			let readyToShip = parsedQty < stock ? parsedQty : stock;
			return {
				productId:_id,
				productName:name,
				productNumber:partNumber,
				orderQty:parsedQty,
				unitPrice:parsedPrice,
				backOrder,
				extendedPrice:totalPrice,
				readyToShip,
				supplierId:"",
				availableStock:parsedStock
			}
		})
	 order = {
			ordernumber,
			invoice:0,
			totalprice:total,
			subtotalprice:subtotal,
			shippingprice:tax,
			products,
			orderdetails,
			status:"pending",
			dashuserprofileid:"6746cc82aa1141b2ca728ad4"
		}

	};

	const incrementQuantity = (size,id) => {
		const index = cartItems.findIndex((item) => item.priceSize.size === size && item.id === id);
		if (index !== -1) {
			cartItems[index].quantity += 1;
			cartItems = [...cartItems];
			updateCartState(cartItems)
			calculateTotals();
		}
	};

	const decrementQuantity = (size,id) => {
		const index = cartItems.findIndex((item) => item.priceSize.size === size && item.id === id);
		if (index !== -1 && cartItems[index].quantity > 1) {
			cartItems[index].quantity -= 1;
			cartItems = [...cartItems];
			updateCartState(cartItems)
			calculateTotals();
		}
	};

	const removeItem = (size,id) => {
		cartItems = cartItems.filter((item) =>!(item.id === id && item.priceSize.size === size));
		console.log("remove item",cartItems);
		updateCartState(cartItems)
		calculateTotals();
	};

	const emptyCart = () => {
		cartItems = [];
		subtotal = 0
		totalPrice =0
		tax = 0
		total = 0
		subtotal = 0
		updateCartState(cartItems)
	};

	const handleSubmit = () =>{
		return async ({result,update})=>{
			console.log(result);
			if(result.type === "success"){
				if(result.data.success){
					toast.success('',{description:result.data.message})
				}else{
					toast.error('',{description:result.data.message})
				}
			}
			updateCartState([])
			subtotal = 0
			totalPrice =0
			tax = 0
			total = 0
			subtotal = 0
			await update()
		}
	}

	onMount(() => {
		calculateTotals();
		functionDispatch()
		loading = false
	});
</script>

<div class="min-h-screen mx-auto max-w-7xl bg-gray-100 p-4 sm:p-6">
	<!-- Main Cart Section -->
	<div class=" flex flex-col xl:flex-row justify-between gap-6">
          {#if loading}
		  <div class="w-full h-72 flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white p-4 rounded shadow-md ">
			<p class=" font-medium text-lg md:text-xl  xl:text-2xl">Loading...</p>
		</div>
		<!-- Left Side: Cart Items -->
		 {:else if !$cartState.length || $cartState === null}
		   <div class="w-full h-72 flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white p-4 rounded shadow-md ">
			   <Icon icon="typcn:shopping-cart" class="text-5xl text-primary-500 md:text-8xl" />
			   <p class=" font-bold text-lg md:text-xl  xl:text-2xl">Cart is Empty</p>
		   </div>
		{:else}
		<div class="w-full lg:w-4/4 xl:w-3/4 bg-white p-4 rounded-lg shadow-md h-fit ">
			<h2 class="text-xl mb-3 font-bold">
				Cart Items <span class="text-red-500">({cartItems.length})</span>
			</h2>

			<div
				class="hidden lg:flex text-gray-500 font-semibold mb-2"
			>
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
						<p class="text-md w-full md:w-2/12 font-semibold text-content">{item.priceSize.price}</p>

						<!-- Quantity Control -->
						<h3 class=" lg:hidden mt-3 font-medium text-sm">Quantity</h3>
						<div class="flex items-center w-60 md:w-2/12">
							<div class="flex items-center border-1 rounded">
								<button on:click={() => decrementQuantity(item.priceSize.size,item.id)} class=" border-r-1 p-2.5 text-primary-500"
									><Icon icon="rivet-icons:minus" class="text-sm"/></button
								>
								<p class="w-fit mx-3 text-sm font-medium outline-none text-center">{item.quantity}</p>
								<button on:click={() => incrementQuantity(item.priceSize.size,item.id)} class=" border-l-1 p-2.5 text-primary-500"
									><Icon icon="rivet-icons:plus" class="text-sm"/></button
								>
							</div>
						</div>

						<!-- Total Price & Delete Icon -->
						<h3 class=" lg:hidden mt-3 text-sm">Total</h3>
						 <div class=" w-full lg:w-2/12 flex justify-between items-center">
							<p class="text-md font-semibold">
								₹{(parseFloat(item.priceSize.price.replace(/[^\d.-]/g, '')) * item.quantity).toFixed(2)}
							</p>
							<button type="button" on:click={() => removeItem(item.priceSize.size,item.id)} class=" text-lg text-primary-600">
								<Icon icon="fluent-mdl2:delete" class=" text-2xl"/>
							</button>
						 </div>
					</li>
				{/each}
			</ul>
			<button type="button" on:click={emptyCart} class="mt-4 text-sm w-32 sm:w-36 md:w-40 lg:w-48 py-2 rounded text-white bg-primary-500 hover:bg-primary-600 font-semibold">Clear Cart</button>
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
				{#if $authedUser.profileId}
				<form method="POST" action="?/checkout" use:enhance={handleSubmit} class=" col-span-2">
					<input type="hidden" name="order" value={JSON.stringify(order)}>
					<button type="submit"
					class="mt-4 w-full bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600"
				>
					Checkout
				</button>
				</form>
				{:else}
				<button type="button" on:click={()=>goto('/login')}
				class="flex col-span-2 items-center justify-center gap-2 bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 py-2 rounded font-semibold"
			>
				Login to Checkout
			</button>
				{/if}

				<!-- Download Button -->
				<button type="button" on:click={downloadPDF}
					class="flex items-center justify-center gap-2 bg-white text-primary-500 border border-primary-500 py-2 rounded font-semibold hover:bg-primary-100"
				>
					Download
				</button>

				<!-- Print Button -->
				<button type="button" on:click={printPDF}
					class="flex items-center justify-center gap-2 bg-white text-primary-500 border border-primary-500 py-2 rounded font-semibold hover:bg-primary-100"
				>
					Print
				</button>
			</div>
			{/if}
			
		</div>
	</div>
</div>
