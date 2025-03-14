<script>
  import { onMount } from "svelte";

  let cartOpen = false;
  let cartItems = [];
  let subtotal = 0;

  onMount(async () => {
    try {
      const response = await fetch('src/lib/data/cart.json');
      if (response.ok) {
        const data = await response.json();
        cartItems = data.map(item => ({
          ...item,
          quantity: item.quantity || 1,
          price: item.price || 50
        }));
        calculateSubtotal();
      } else {
        console.error('Failed to fetch cart data from JSON');
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
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
</script>

<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">


<button on:click={toggleCart} class="bg-indigo-600 text-white px-4 py-2">Open Cart</button>

{#if cartOpen}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  <div class="fixed inset-0 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div class="pointer-events-auto w-screen max-w-md">
          <div class="flex h-full flex-col bg-white shadow-xl">
            <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div class="flex items-start justify-between">
                <h2 class="text-lg font-medium text-gray-900">Product Cart</h2>
                <div class="ml-3 flex h-7 items-center">
                  <button type="button" on:click={toggleCart} class="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                    <span class="sr-only">Close panel</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              
              <div class="mt-8">
                <div class="flow-root">
                  <ul role="list" class="-my-6 divide-y divide-gray-200">
                    {#each cartItems as item (item.id)}
                      <li class="flex py-6" key={item.id}>
                        <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img src={item.image} alt={item.description} class="h-full w-full object-cover object-center" />
                        </div>

                        <div class="ml-4 flex flex-1 flex-col">
                          <div class="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p class="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>

                          
                          <div class="flex items-center mt-2">
                            <button on:click={() => decrementQuantity(item.id)} class="px-2 py-1 bg-gray-200 rounded">-</button>
                            <p class="px-4">{item.quantity}</p>
                            <button on:click={() => incrementQuantity(item.id)} class="px-2 py-1 bg-gray-200 rounded">+</button>
                          </div>

                          
                          <div class="flex mt-2">
                            <button on:click={() => removeItem(item.id)} class="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                          </div>
                        </div>
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
            </div>

           
            <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div class="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div class="mt-6">
                <a href="/" class="flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700">Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
