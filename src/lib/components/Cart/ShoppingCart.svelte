<script>
    import { onMount } from "svelte";
    import cartData from '../../data/cart.json';
  
    let cartItems = [];
    let subtotal = 0;
    let tax = 0;
    let total = 0;
  
    onMount(() => {
        cartItems = cartData.map(item => ({
            ...item,
            quantity: item.quantity || 1,
            price: item.price || 50
        }));
        calculateTotals();
    });
  
    const calculateTotals = () => {
        subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        tax = subtotal * 0.12; 
        total = subtotal + tax;
    };
  
    const updateLocalStorage = () => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    };
  
    const incrementQuantity = (id) => {
        const index = cartItems.findIndex(item => item.id === id);
        if (index !== -1) {
            cartItems[index].quantity += 1;
            cartItems = [...cartItems];
            calculateTotals();
            updateLocalStorage();
        }
    };
  
    const decrementQuantity = (id) => {
        const index = cartItems.findIndex(item => item.id === id);
        if (index !== -1 && cartItems[index].quantity > 1) {
            cartItems[index].quantity -= 1;
            cartItems = [...cartItems];
            calculateTotals();
            updateLocalStorage();
        }
    };
  
    const removeItem = (id) => {
        cartItems = cartItems.filter(item => item.id !== id);
        calculateTotals();
        updateLocalStorage();
    };
  
    const emptyCart = () => {
        cartItems = [];
        subtotal = 0;
        tax = 0;
        total = 0;
        updateLocalStorage();
    };
  </script>
  
  <div class="min-h-screen bg-gray-100 p-6">
      <!-- Main Cart Section -->
      <div class="flex justify-between gap-6">
          <!-- Left Side: Cart Items -->
          <div class="w-2/3 bg-white p-4 rounded-lg shadow-md">
              <h2 class="text-xl font-bold mb-4">Cart Items <span class="text-red-500">({cartItems.length})</span></h2>
  
              
              <div class="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-gray-500 font-semibold mb-2">
                  <p>Product</p>
                  <p class="text-center">Price</p>
                  <p class="text-center">Quantity</p>
                  <p class="text-center">Total</p>
              </div>
  
              <ul class="space-y-4 divide-y divide-gray-200">
                  {#each cartItems as item (item.id)}
                      <li class="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center py-4">
                          <!-- Product Image and Details -->
                          <div class="flex items-center">
                              <img src={item.image} alt={item.name} class="w-16 h-16 object-cover rounded-md">
                              <div class="ml-2">
                                  <p class="text-sm text-red-500 font-semibold">{item.code}</p>
                                  <p class="font-semibold text-gray-800">{item.name}</p>
                              </div>
                          </div>
  
                          <!-- Price -->
                          <p class="text-lg font-semibold text-center text-gray-900">₹{item.price.toFixed(2)}</p>
  
                          <!-- Quantity Control -->
                          <div class="flex items-center justify-center">
                              <div class="flex items-center border border-gray-300 rounded-sm px-2">
                                  <button on:click={() => decrementQuantity(item.id)} class="text-lg text-orange-500">-</button>
                                  <p class="mx-2">{item.quantity}</p>
                                  <button on:click={() => incrementQuantity(item.id)} class="text-lg text-orange-500">+</button>
                              </div>
                          </div>
  
                          <!-- Total Price & Delete Icon -->
                          <div class="flex justify-between items-center">
                              <p class="text-lg font-semibold text-center text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                              <button on:click={() => removeItem(item.id)} class="ml-4 text-lg text-orange-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" class="w-6 h-6">
                                      <path fill="currentColor" d="M96 472a23.82 23.82 0 0 0 23.579 24h272.842A23.82 23.82 0 0 0 416 472V152H96Zm32-288h256v280H128Z"/>
                                      <path fill="currentColor" d="M168 216h32v200h-32zm72 0h32v200h-32zm72 0h32v200h-32zm16-128V40c0-13.458-9.488-24-21.6-24H205.6C193.488 16 184 26.542 184 40v48H64v32h384V88ZM216 48h80v40h-80Z"/>
                                  </svg>
                              </button>
                          </div>
                      </li>
                  {/each}
              </ul>
  
              <button on:click={emptyCart} class="mt-4 text-orange-500 font-semibold underline">Empty Cart</button>
          </div>
  
          <!-- Right Side: Order Summary -->
          <div class="w-1/3 bg-white p-4 rounded-lg shadow-md">
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
  
                  <button class="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600">
                      Checkout
                  </button>
              </div>
  
              
              <div class="mt-4 grid grid-cols-2 gap-2">
                  <!-- Save Cart Button -->
                  <button class="flex items-center justify-center gap-2 bg-white text-orange-500 border border-orange-500 py-2 rounded-lg font-semibold hover:bg-orange-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5 6.5h12.5l-1.586 5.55a2 2 0 0 1-1.923 1.45h-6.7a2 2 0 0 1-1.989-1.78L4.5 4.5h-2"/><g fill="currentColor" transform="translate(2 4)"><circle cx="5" cy="12" r="1"/><circle cx="13" cy="12" r="1"/></g></g></svg>
                      Save Cart
                  </button>
  
                  <!-- Email Button -->
                  <button class="flex items-center justify-center gap-2 bg-white text-orange-500 border border-orange-500 py-2 rounded-lg font-semibold hover:bg-orange-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M15.5 4A2.5 2.5 0 0 1 18 6.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4.5 14.5v-8A2.5 2.5 0 0 1 6.5 4zM17 7.961l-6.746 3.97a.5.5 0 0 1-.426.038l-.082-.038L3 7.963V14.5A1.5 1.5 0 0 0 4.5 16h11a1.5 1.5 0 0 0 1.5-1.5zM6.5 5A1.5 1.5 0 0 0 5 6.5v.302l7 4.118l7-4.12v-.3A1.5 1.5 0 0 0 15.5 5z"/></svg>
                      Email
                  </button>
  
                  <!-- Download Button -->
                  <button class="flex items-center justify-center gap-2 bg-white text-orange-500 border border-orange-500 py-2 rounded-lg font-semibold hover:bg-orange-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 15.577l-3.539-3.538l.708-.72L11.5 13.65V5h1v8.65l2.33-2.33l.709.719zM6.616 19q-.691 0-1.153-.462T5 17.384v-2.423h1v2.423q0 .231.192.424t.423.192h10.77q.23 0 .423-.192t.192-.424v-2.423h1v2.423q0 .691-.462 1.153T17.384 19z"/></svg>
                      Download
                  </button>
  
                  <!-- Print Button -->
                  <button class="flex items-center justify-center gap-2 bg-white text-orange-500 border border-orange-500 py-2 rounded-lg font-semibold hover:bg-orange-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M5 4.5A1.5 1.5 0 0 1 6.5 3h7A1.5 1.5 0 0 1 15 4.5V5h.5A2.5 2.5 0 0 1 18 7.5v5a1.5 1.5 0 0 1-1.5 1.5H15v1.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 5 15.5V14H3.5A1.5 1.5 0 0 1 2 12.5v-5A2.5 2.5 0 0 1 4.5 5H5zM6 5h8v-.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zm-1 8v-1.5A1.5 1.5 0 0 1 6.5 10h7a1.5 1.5 0 0 1 1.5 1.5V13h1.5a.5.5 0 0 0 .5-.5v-5A1.5 1.5 0 0 0 15.5 6h-11A1.5 1.5 0 0 0 3 7.5v5a.5.5 0 0 0 .5.5zm1.5-2a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5z"/></svg>
                      Print
                  </button>
              </div>
          </div>
      </div>
  </div>
  
  
  