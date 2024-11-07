<script>
    import { onMount } from "svelte";
    import cartData from '$lib/data/cart.json'; 
  
    let cartOpen = false;
    let cartItems = [];
    let subtotal = 0;
  
    onMount(() => {
        cartItems = cartData.map(item => ({
            ...item,
            quantity: item.quantity || 1,  
            price: item.price || 50        
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
        cartItems = [...cartItems];
        calculateSubtotal();
        updateLocalStorage();
      }
    };
  
    const decrementQuantity = (id) => {
      const index = cartItems.findIndex(item => item.id === id);
      if (index !== -1 && cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
        cartItems = [...cartItems];
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
  
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" rel="stylesheet">
  
  <button on:click={toggleCart} class="bg-indigo-600 text-white px-4 py-2">Open Cart</button>
  
  {#if cartOpen}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div class="pointer-events-auto w-screen max-w-xl">
                    <div class="flex h-full flex-col bg-white shadow-xl">
                        <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                            <div class="flex justify-between items-center pb-4 border-b">
                                <h1 class="text-xl font-semibold">CART ITEMS <span class="text-red-500">({cartItems.length})</span></h1>
                                <button class="text-orange-600" on:click={toggleCart}>
                                  <i class="fa-solid fa-xmark fa-xl" style="color: #ff8000;"></i>
                                </button>
                              </div>
                            <div class="mt-8">
                                <div class="flow-root">
                                    <ul role="list" class="-my-6 divide-y divide-gray-200">
    {#each cartItems as item (item.id)}
      <div class="flex items-center py-4 border-b">
  <div class="flex flex-col space-y-4">
    <div class="flex items-start justify-between">
        <div class="relative bg-orange-200 p-2 rounded-lg h-20 w-24">
            <img src={item.image} alt={item.name} class="w-40 h-20 relative right-2 top-2 rounded-md">
        </div>
  
        <div class="ml-4 flex-1 flex justify-between">
            <div>
                <p class="text-sm text-red-500 font-semibold">{item.code}</p>
                <p class="font-semibold text-gray-800">{item.name}</p>
                <p class="text-sm text-gray-500 mr-32">{item.description}</p>
            </div>
  
            <button class="ml-4 text-orange-600" on:click={() => removeItem(item.id)}>
              <i class="fa-regular fa-trash-can fa-xl" style="color: #ff8040;"></i>
            </button>
        </div>
    </div>
  
    <div class="flex items-center justify-between ml-32 mt-3">
        <p class="flex-1 text-lg font-bold">₹{item.price.toFixed(2)}</p>
  
        <div class="flex items-center border border-gray-300 rounded-sm px-2">
            <button on:click={() => decrementQuantity(item.id)} class="text-2xl text-orange-500">-</button>
            <p class="px-6">{item.quantity}</p>
            <button on:click={() => incrementQuantity(item.id)} class="text-2xl text-orange-500">+</button>
        </div>
  
        <p class="flex-1 text-base font-semibold text-gray-800 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
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
            <button class="bg-orange-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-orange-600">
              VIEW CART
            </button>
            <button on:click={emptyCart} class="bg-white text-orange-500 border border-orange-500 text-center py-3 rounded-lg font-semibold hover:bg-orange-100">
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