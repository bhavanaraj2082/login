<script>
	import { onMount, onDestroy } from 'svelte';
	import Icon from '@iconify/svelte';

	let cartOpen = false; 
	let cartItems = [];
	let subtotal = 0; 

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
				price: formatPriceToNumber(item.price),
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

	const incrementQuantity = (id) => {
		const index = cartItems.findIndex((item) => item.id === id);
		if (index !== -1) {
			cartItems[index].quantity += 1;
			calculateSubtotal();
			updateLocalStorage();
		}
	};

	const decrementQuantity = (id) => {
		const index = cartItems.findIndex((item) => item.id === id);
		if (index !== -1 && cartItems[index].quantity > 1) {
			cartItems[index].quantity -= 1;
			calculateSubtotal();
			updateLocalStorage();
		}
	};

	const removeItem = (id) => {
		cartItems = cartItems.filter((item) => item.id !== id);
		calculateSubtotal();
		updateLocalStorage();
	};

	const emptyCart = () => {
		cartItems = [];
		subtotal = 0;
		updateLocalStorage();
	};

	const handleStorageChange = (event) => {
		if (event.key === 'cart') {
			loadCartFromLocalStorage();
		}
	};

	onMount(() => {
		loadCartFromLocalStorage();
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', handleStorageChange);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('storage', handleStorageChange);
		}
	});

	const toggleCart = () => {
		cartOpen = !cartOpen;
	};
</script>

<button on:click={toggleCart} class=" space-x-4 text-gray-600">
	<span class="flex items-center space-x-1">
		<Icon
			icon="eva:shopping-cart-fill"
			class="md:w-5 md:h-5 sm:w-7 sm:h-7 lg:w-7 lg:h-7 w-7 h-7 mb-2 text-gray-800 sm:ml-3 hover:text-primary-400"
		/>
		<span class="hover:text-primary-400 font-semibold text-xs lg:text-sm mb-3 hidden lg:block"
			>Cart</span
		>
	</span>
</button>

{#if cartOpen}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"></div>
  <div class="fixed top-0 right-0 h-full w-full sm:w-1/2 lg:w-2/5 z-50">
    <div class="w-full h-full bg-white shadow-lg flex flex-col">
      <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
        <h1 class="text-xl font-semibold">
          CART ITEMS <span class="text-primary-400">({cartItems.length})</span>
        </h1>
        <button class="text-primary-400" on:click={toggleCart}>
          <Icon icon="cuida:x-outline" class="text-2xl" />
        </button>
      </div>
      <div class="px-4 py-2 overflow-y-auto scroll flex-1">
        {#each cartItems as item}
          <div class="flex flex-col py-4 border-b">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0 w-28 h-28 bg-stone-300 rounded-md overflow-hidden">
                <img src={item.imageSrc} alt="img" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <p class="text-sm text-primary-400 font-semibold">{item.partNumber}</p>
                <p class="font-semibold text-gray-800">{item.name}</p>
                <p class="text-sm text-gray-500">{item.description}</p>
              </div>
              <button
                class="text-primary-400"
                on:click={() => removeItem(item.id)}
              >
                <Icon icon="codicon:trash" class="text-2xl hover:scale-105" />
              </button>
            </div>

            <div class="flex items-center justify-between mt-3">
              <p class="text-base font-semibold text-gray-600">₹{item.price.toFixed(2)}</p>
              <div class="flex items-center border border-gray-300 rounded-sm px-2">
                <button
                  on:click={() => decrementQuantity(item.id)}
                  class="text-2xl text-primary-400">-</button>
                <p class="px-4">{item.quantity}</p>
                <button
                  on:click={() => incrementQuantity(item.id)}
                  class="text-2xl text-primary-400">+</button>
              </div>
              <p class="text-base font-semibold text-gray-600">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        {/each}
      </div>
      <div class="p-4 border-t mt-4 sticky bottom-0 bg-white z-10">
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-600 font-semibold">Estimated Total</p>
          <p class="font-bold text-lg">₹{subtotal.toFixed(2)}</p>
        </div>

        <div class="flex flex-col space-y-4">
          <button
            on:click={toggleCart}
            class="bg-primary-400 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-500"
          >
            <a href="/cart">VIEW CART</a>
          </button>
          <button
            on:click={emptyCart}
            class="bg-white text-primary-400 border border-primary-400 text-center py-3 rounded-lg font-semibold hover:bg-primary-400 hover:text-white"
          >
            EMPTY CART
          </button>
        </div>
      </div>

    </div>
  </div>
{/if}