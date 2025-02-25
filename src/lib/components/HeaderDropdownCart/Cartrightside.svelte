<script>
	import { sendMessage } from '$lib/utils.js';
	import { cart,guestCart,removeFromCart } from '$lib/stores/cart.js';
	import { goto,invalidate } from '$app/navigation';

	export let cartId
	// import { updateCartState } from '$lib/stores/cart.js';
	import { onMount, onDestroy } from 'svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import {authedUser} from '$lib/stores/mainStores.js'
  
	let cartOpen = false;
	let cartItems = [];
	let subtotal = 0;
	let priceINR = 0
	let priceUSD = 0

	let isLoggedIn = $authedUser?.id ? true : false
  
	function formatPriceToNumber(priceString) {
	  if (!priceString) return 0;
	  const formattedPrice = String(priceString)
		.replace(/[^\d.-]/g, '')
		.trim();
	  return parseFloat(formattedPrice) || 0;
	}
  
	const loadCartFromLocalStorage = () => {
	  if (typeof window !== 'undefined' && window.localStorage) {
		const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
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
	  if (typeof window !== 'undefined' && window.localStorage) {
		localStorage.setItem('cart', JSON.stringify(cartItems));
	  }
	};
  
	
	const handleStorageChange = (event) => {
	  if (event.key === 'cart') {
		loadCartFromLocalStorage();
	  }
	};

	const calculateTotalPrice = (cart)=>{
       priceINR = cart.reduce((sum,crt)=> sum + crt.pricing.INR*crt.quantity,0)
       priceUSD = cart.reduce((sum,crt)=> sum + crt.pricing.USD*crt.quantity,0)
	}

    $: calculateTotalPrice($cart)

	let timeout
	const incrementQuantity = (stock,_id,indx) => {
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
		  sendMessage("/cart?/updateQty",formdata,async(result)=>{
			console.log(result);
			calculateTotalPrice($cart)
		  })
	  },1000)

	};

	const decrementQuantity = (stock,_id,indx) => {
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
		  sendMessage("/cart?/updateQty",formdata,async(result)=>{
			calculateTotalPrice($cart)
			console.log(result);
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
	    sendMessage("/cart?/deleteOne",formdata,async(result)=>{
			if(result.success){
				toast.success(result.message)
			}else{
				toast.error(result.message)
			}
			invalidate("/")

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
	    sendMessage("/cart?/deleteAll",formdata,async(result)=>{
			if(result.success){
				toast.success(result.message)
			}else{
				toast.error(result.message)
			}
			invalidate("/")

		})
	};
  
	const observeLocalStorage = () => {
	  let originalSetItem = localStorage.setItem;
	  localStorage.setItem = function (key, value) {
		originalSetItem.apply(this, arguments);
		if (key === 'cart') {
		  loadCartFromLocalStorage();
		}
	  };
	};
  
	const toggleCart = () => {
	  cartOpen = !cartOpen;
	};

    const visitcart =() =>
	{
		goto('/cart')
		cartOpen = !cartOpen;
		
	}
  
	onMount(() => {
	//   loadCartFromLocalStorage();
	  observeLocalStorage();
	  if (typeof window !== 'undefined') {
		window.addEventListener('storage', handleStorageChange);
	  }
	});

	loadCartFromLocalStorage();
	updateLocalStorage();
	// observeLocalStorage();
  
	onDestroy(() => {
	  if (typeof window !== 'undefined') {
		window.removeEventListener('storage', handleStorageChange);
	  }
	});


	function getFullPath(partNumber) {
    const basePath = '/products/analytical-chemistry/analytical-chromatography';
    
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith(basePath)) {
        return `${basePath}/${encodeURIComponent(partNumber)}`;
      }
    }
    return `${basePath}/${encodeURIComponent(partNumber)}`;
  }
  </script>

<button on:click={toggleCart} class=" space-x-4 text-gray-600 pr-0 sm:pr-2">
	<span class="flex items-center space-x-1">
		<!-- Wrapper for Icon with Badge -->
		<div class="relative inline-block">
			<!-- Shopping Cart Icon -->
			<Icon
				icon="eva:shopping-cart-fill"
				class=" text-lg sm:text-2xl hover:text-primary-400 shrink-0"
			/>
			<!-- Badge -->
			<span
				class="absolute top-1 right-0 transform translate-x-1/2 -translate-y-1/2 {$cart.length === 0 ? "hidden" : "bg-primary-500 text-white"} text-2s font-medium rounded-full w-4 h-4 flex items-center justify-center"
			>
			{$cart.length}
			</span>
		</div>
	</span>
	
</button>

{#if cartOpen}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"></div>
  <div class="fixed top-0 right-0 h-full w-full sm:w-1/2 md:w-2/4 lg:w-2/6 z-50">
    <div class="w-full h-full bg-white shadow-lg flex flex-col">
      <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
        <h1 class="text-md font-semibold">
          CART ITEMS <span class="text-primary-400">({$cart.length})</span>
        </h1>
        <button class="text-primary-400" on:click={toggleCart}>
          <Icon icon="cuida:x-outline" class="text-2xl" />
        </button>
      </div>
      <div class="px-2 py-2 overflow-y-auto scroll flex-1">
		{#if !$cart.length}
		<div class="w-full h-full flex flex-col gap-2 items-center justify-center">
			<Icon icon="typcn:shopping-cart" class="text-5xl text-primary-500 md:text-8xl" />
			<p class=" font-bold text-lg md:text-xl  xl:text-2xl">Cart is Empty</p>
		</div>
		{:else}
        {#each $cart as item,index}
          <div class="flex flex-col py-4 border-b">
            <div class="flex items-center space-x-1.5">
              <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-stone-300 rounded-md overflow-hidden">
                <img src={item.productDetails.imageSrc} alt="img" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
				<p class=" font-semibold text-sm">{item.productDetails.productNumber}</p>
                <p class="font-medium text-xs text-gray-800">{item.productDetails.productName}</p>
                <p class="text-xs text-gray-500">{item.pricing.break}</p>
              </div>
              <button type="button"
                class="text-primary-400"
                on:click={() => removeItem(item.productDetails.productNumber,item._id,index)}
              >
                <Icon icon="codicon:trash" class="text-xl sm:text-2xl hover:scale-105" />
              </button>
            </div>

            <div class="flex items-center justify-between mt-3">
              <p class="text-sm font-semibold text-gray-600">₹{item.pricing.INR.toFixed(2)}</p>
              <div class="flex items-center border border-gray-300 rounded-sm">
                <button
                  on:click={() => decrementQuantity(item.stockDetails.stock,item._id,index)}
                  class="text-2xl border-r-1 px-2 text-primary-400">-</button>
                <p class="px-3">{item.quantity}</p>
                <button
                  on:click={() => incrementQuantity(item.stockDetails.stock,item._id,index)}
                  class="text-2xl border-l-1 px-2 text-primary-400">+</button>
              </div>
              <p class="text-sm font-semibold text-gray-600">
                ₹{(item.pricing.INR * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        {/each}
		{/if}
      </div>
      <div class="p-2 border-t mt-4 sticky bottom-0 bg-white z-10">
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-600 text-sm font-semibold">Estimated Total</p>
          <p class="font-bold text-lg">₹{priceINR.toLocaleString('en-IN')}</p>
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