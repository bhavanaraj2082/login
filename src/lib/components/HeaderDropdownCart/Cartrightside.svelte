<script>
  import { onMount } from "svelte";
  import Icon from '@iconify/svelte';  
  import cartData from '../data/cart.json';

  let cartOpen = false;
  let cartItems = [];
  let subtotal = 0;

  onMount(() => {
    cartItems = cartData.map(item => ({
      ...item,
      quantity: item.quantity || 1, 
    }));
    calculateSubtotal();
  });

  const toggleCart = () => {
    cartOpen = !cartOpen;
  };

  const updateLocalStorage = () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  const calculateSubtotal = () => {
    subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const incrementQuantity = (id) => {
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
      cartItems[index].quantity += 1;
      calculateSubtotal();
      updateLocalStorage();
    }
  };

  const decrementQuantity = (id) => {
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1 && cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
      calculateSubtotal();
      updateLocalStorage();
    }
  };

  const removeItem = (id) => {
    cartItems = cartItems.filter(item => item.id !== id);
    calculateSubtotal();
    updateLocalStorage();
  };

  const emptyCart = () => {
    cartItems = [];
    subtotal = 0;
    updateLocalStorage();
  };
</script>
<button on:click={toggleCart} class=" space-x-4 text-gray-600"> 
  <span class="flex items-center space-x-1">
    <Icon icon="eva:shopping-cart-fill" class="md:w-5 md:h-5 sm:w-7 sm:h-7 lg:w-7 lg:h-7 w-7 h-7 mb-2 text-gray-800 sm:ml-3 hover:text-primary-400" />
    <span class="hover:text-primary-400 font-semibold text-xs lg:text-base mb-3 hidden lg:block">Cart</span>
  </span>
</button>

{#if cartOpen}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  <div class="fixed inset-0 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div class="pointer-events-auto w-screen max-w-xl sm:max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div class="flex h-full flex-col bg-white shadow-xl">
            <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div class="flex justify-between items-center pb-4 border-b">
                <h1 class="text-xl font-semibold">CART ITEMS <span class="text-primary-400">({cartItems.length})</span></h1>
                <button class="text-primary-400" on:click={toggleCart}>
                  <Icon icon="cuida:x-outline" style="color: #ff8000; font-size: 24px;" />
                </button>
              </div>
              <div class="mt-8">
                <div class="flow-root">
                  <ul role="list" class="-my-6 divide-y divide-gray-200">
                    {#each cartItems as item}
                      <div class="flex items-center py-4 border-b">
                        <div class="flex flex-col space-y-4">
                          <div class="flex items-center justify-between max-sm:flex-col max-sm:items-center">
                            <img src={item.image} alt={item.name} class="w-32 h-24 max-sm:w-24 rounded-md">
                            <div class="ml-4 flex-1 flex justify-between max-sm:ml-0 max-sm:justify-center">
                              <div class="max-sm:w-full">
                                <p class="text-sm text-primary-400 font-semibold">{item.code}</p>
                                <p class="font-semibold text-gray-800">{item.name}</p>
                                <p class="text-sm text-gray-500">{item.description}</p>
                              </div>
                              <button class="ml-4 max-sm:mt-2 text-primary-400" on:click={() => removeItem(item.id)}>
                                <Icon icon="codicon:trash" style="color: #ff8040; font-size: 24px;"/>
                              </button>
                            </div>
                          </div>
                          <div class="flex items-center justify-between ml-32 mt-3 max-sm:ml-0 max-sm:flex-row max-sm:items-center">
                            <p class="flex-1 text-lg max-sm:text-sm max-sm:mr-0.5 font-bold max-sm:text-center">₹{item.price.toFixed(2)}</p>

                            <div class="flex items-center border border-gray-300 rounded-sm px-2 max-sm:mt-2">
                              <button on:click={() => decrementQuantity(item.id)} class="text-2xl text-primary-500">-</button>
                              <p class="px-6 max-sm:px-2">{item.quantity}</p>
                              <button on:click={() => incrementQuantity(item.id)} class="text-2xl text-primary-500">+</button>
                            </div>

                            <p class="flex-1 text-base font-semibold text-gray-800 max-sm:text-sm text-right max-sm:text-center mt-2 max-sm:ml-0.5 max-sm:w-full">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    {/each}
                  </ul>
                </div>
              </div>
            </div>
            <div class="p-4 mt-4 border-t">
              <div class="flex justify-between items-center mb-6">
                <p class="text-gray-600 font-semibold">Estimated Total Amount</p>
                <p class="font-bold text-lg">₹{subtotal.toFixed(2)}</p>
              </div>
              <div class="flex flex-col space-y-4">
                <button class="bg-primary-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-600"><a href="/cart">VIEW CART</a></button>
                <button on:click={emptyCart} class="bg-white text-primary-500 border border-primary-500 text-center py-3 rounded-lg font-semibold hover:bg-primary-100">
                  EMPTY CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}