<script>
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { authedUser } from '$lib/stores/mainStores.js';
	import Icon from '@iconify/svelte';
	import { onMount, createEventDispatcher } from 'svelte';
	import { viewedCart,updateCartState } from '$lib/stores/alsoViewedProducts_Store.js';
	import jsPDF from 'jspdf'
	import { toast } from 'svelte-sonner';
    
	const dispatch = createEventDispatcher()

	let timestamp
	let loading = true
	let cartItems = $viewedCart;
	let subtotal = 0;
	let tax = 0;
	let total = 0;
	let totalPrice = 0
	let order = ''
	let successMessage = ''

  import 'jspdf-autotable';

// Helper function to generate the PDF document
const generatePDFDocument = () => {
    const total = $viewedCart.reduce((sum, item) => sum + parseFloat(item.priceSize.price.replace(/[^\d.-]/g, '')) * item.quantity, 0);
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Chemikart Cart Summary', 14, 20);

    doc.setFont('helvetica'); 

    const tableColumns = ['Products', 'Price', 'Quantity', 'Total'];
    const tableData = $viewedCart.map(item => [
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


// Function to download the PDF
const downloadPDF = () => {
  const doc = generatePDFDocument();
  doc.save('cart-summary.pdf');
};

// Function to print the PDF
const printPDF = () => {
  const doc = generatePDFDocument();
  doc.autoPrint();
  window.open(doc.output('bloburl'), '_blank');
};


	const functionDispatch = ()=>{
    let expireTime = 12*60*60*1000
	if(!$viewedCart.length){
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
            const {id,name,partNumber,quantity,priceSize,stock} = item
			const parsedPrice = parseFloat(priceSize.price.replace(/[^\d.-]/g, ''))
			const parsedQty = parseInt(quantity)
			const parsedStock = parseInt(stock)

			products.push(id)
			totalPrice = parsedQty * parsedPrice
			let backOrder = parsedQty > stock ? parsedQty - parsedStock : 0;
			let readyToShip = parsedQty < stock ? parsedQty : stock;
			return {
				productId:id,
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
			totalprice:total,
			subtotalprice:subtotal,
			shippingprice:tax,
			products,
			orderdetails,
			status:"pending",
			dashuserprofileid:$authedUser.profileId
		}

	};

	const incrementQuantity = (id) => {
		const index = cartItems.findIndex((item) => item.id === id);
		if (index !== -1) {
			cartItems[index].quantity += 1;
			cartItems = [...cartItems];
			updateCartState(cartItems)
			calculateTotals();
		}
	};

	const decrementQuantity = (id) => {
		const index = cartItems.findIndex((item) => item.id === id);
		if (index !== -1 && cartItems[index].quantity > 1) {
			cartItems[index].quantity -= 1;
			cartItems = [...cartItems];
			updateCartState(cartItems)
			calculateTotals();
		}
	};

	const removeItem = (id) => {
		cartItems = cartItems.filter((item) => item.id !== id);
		updateCartState(cartItems)
		calculateTotals();
	};

	const emptyCart = () => {
		cartItems = [];
		subtotal = 0;
		tax = 0;
		total = 0;
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
			await update()
			setTimeout(()=>successMessage = '',4000)
		}
	}

	onMount(() => {
		calculateTotals();
		functionDispatch()
		loading = false
	});
</script>

<div class="min-h-screen mx-auto max-w-7xl bg-gray-100 p-4 sm:p-6">
	{#if successMessage.length !== 0}
	<div class=" absolute right-10 bottom-10 w-64 md:w-1/3 h-14 border rounded-sm text-xs md:text-sm font-medium flex items-center justify-center  {successMessage.success ? " text-green-600 bg-green-100 border-green-600" : "text-red-600 bg-red-100 border-red-600"}">{successMessage.message}</div>
	{/if}
	<!-- Main Cart Section -->
	<div class=" flex flex-col xl:flex-row justify-between gap-6">
          {#if loading}
		  <div class="w-full h-72 flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white p-4 rounded shadow-md ">
			<p class=" font-medium text-lg md:text-xl  xl:text-2xl">Loading...</p>
		</div>
		<!-- Left Side: Cart Items -->
		 {:else if !$viewedCart.length || $viewedCart === null}
		   <div class="w-full h-72 flex flex-col gap-2 items-center justify-center lg:w-4/4 xl:w-3/4 bg-white p-4 rounded shadow-md ">
			   <Icon icon="typcn:shopping-cart" class="text-5xl text-primary-500 md:text-8xl" />
			   <p class=" font-bold text-lg md:text-xl  xl:text-2xl">Cart is Empty</p>
		   </div>
		{:else}
		<div class="w-full lg:w-4/4 xl:w-3/4 bg-white p-4 rounded-lg shadow-md h-fit ">
			<h2 class="text-xl font-bold">
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
				{#each cartItems as item (item.id)}
					<li class="flex flex-col lg:flex-row lg:items-center py-3 lg:py-5 border-b-1">
						<!-- Product Image and Details -->
						<h3 class=" lg:hidden mt-3 font-medium text-sm">Product</h3>
						<div class="flex items-center w-full md:w-6/12">
							<img src={item.image} alt={item.name} class="w-16 h-16 object-cover rounded-md" />
							<div class="ml-2">
								<p class="text-sm text-red-500 font-semibold">{item.partNumber}</p>
								<p class=" text-gray-800">{item.name}</p>
								<p class=" text-gray-800 text-sm">{item.priceSize.size}</p>
							</div>
						</div>

						<!-- Price -->
						<h3 class=" lg:hidden mt-3 font-medium text-sm">Price</h3>
						<p class="text-md w-full md:w-2/12 font-semibold text-content">{item.priceSize.price}</p>

						<!-- Quantity Control -->
						<h3 class=" lg:hidden mt-3 font-medium text-sm">Quantity</h3>
						<div class="flex items-center w-60 md:w-2/12">
							<div class="flex items-center border-1 rounded">
								<button on:click={() => decrementQuantity(item.id)} class=" border-r-1 p-2.5 text-primary-500"
									><Icon icon="rivet-icons:minus" class="text-sm"/></button
								>
								<p class="w-fit mx-3 text-sm font-medium outline-none text-center">{item.quantity}</p>
								<button on:click={() => incrementQuantity(item.id)} class=" border-l-1 p-2.5 text-primary-500"
									><Icon icon="rivet-icons:plus" class="text-sm"/></button
								>
							</div>
						</div>

						<!-- Total Price & Delete Icon -->
						<h3 class=" lg:hidden mt-3 text-sm">Total</h3>
						 <div class=" w-full lg:w-2/12 flex justify-between items-center">
							<p class="text-md font-medium text-content">
								₹{(parseFloat(item.priceSize.price.replace(/[^\d.-]/g, '')) * item.quantity).toFixed(2)}
							</p>
							<button type="button" on:click={() => removeItem(item.id)} class=" text-lg text-primary-600">
								<Icon icon="mdi:delete" class=" text-3xl"/>
							</button>
						 </div>
					</li>
				{/each}
			</ul>
			<button type="button" on:click={emptyCart} class="mt-4 text-sm w-32 sm:w-36 md:w-40 lg:w-48 py-2 rounded text-white bg-primary-500 hover:bg-primary-600 font-semibold">Clear cart</button>
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
			{#if $viewedCart.length}
			<div class="mt-4 grid grid-cols-2 gap-2">
				<form method="POST" action="?/checkout" use:enhance={handleSubmit} class=" col-span-2">
					<input type="hidden" name="order" value={JSON.stringify(order)}>
					<button type="submit"
					class="mt-4 w-full bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600"
				>
					Checkout
				</button>
				</form>
				
				<!-- Save Cart Button -->
				<button type="button"
					class="flex items-center justify-center gap-2 col-span-2 bg-white text-primary-500 border border-primary-500 py-2 rounded font-semibold hover:bg-primary-100"
				>
					Save Cart
				</button>

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
