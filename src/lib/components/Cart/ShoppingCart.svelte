<script>
    import { onMount } from "svelte";
    import cartData from '$lib/data/cart.json';
    import { viewedCart } from "$lib/stores/alsoViewedProducts_Store";

    let cartItems = [];
    let subtotal = 0;
    let tax = 0;
    let total = 0;
    let viewedCartItems = [];

    onMount(() => {
        const unsubscribe = viewedCart.subscribe(items =>{
        viewedCartItems = items;
        cartItems = [...cartData, ...viewedCartItems].map((item, index) => ({
            ...item,
            id: item.id || `item-${index}`,
            quantity: item.quantity || 1,
            price: item.price || 50,
            name: item.name1 && item.name2 ? `${item.name1} & ${item.name2}` : item.name1 || item.name2 || item.name
        }));
        calculateTotals();
    });
    return () => unsubscribe();
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

<div class="min-h-screen bg-gray-100 p-4 sm:p-6">
    <!-- Main Cart Section -->
    <div class="flex flex-col lg:flex-row justify-between gap-6">
        <!-- Left Side: Cart Items -->
        <div class="w-full lg:w-2/3 bg-white p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4">Cart Items <span class="text-red-500">({cartItems.length})</span></h2>

            <div class="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-gray-500 font-semibold mb-2">
                <p>Product</p>
                <p class="text-center">Price</p>
                <p class="text-center">Quantity</p>
                <p class="text-center">Total</p>
            </div>

            <ul class="space-y-4 divide-y divide-gray-200">
                {#each cartItems as item (item.id)}
                    <li class="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center py-4">
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
        <div class="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow-md">
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
                    Save Cart
                </button>

                <!-- Email Button -->
                <button class="flex items-center justify-center gap-2 bg-white text-orange-500 border border-orange-500 py-2 rounded-lg font-semibold hover:bg-orange-100">
                    Email
                </button>

                <!-- Download Button -->
                <button class="flex items-center justify-center gap-2 bg-white text-orange-500 border border-orange-500 py-2 rounded-lg font-semibold hover:bg-orange-100">
                    Download
                </button>

                <!-- Print Button -->
                <button class="flex items-center justify-center gap-2 bg-white text-orange-500 border border-orange-500 py-2 rounded-lg font-semibold hover:bg-orange-100">
                    Print
                </button>
            </div>
        </div>
    </div>
</div>
