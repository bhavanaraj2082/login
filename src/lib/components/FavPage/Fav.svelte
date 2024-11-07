<script>
    import { onMount } from 'svelte';
    import favouritesData from '$lib/data/favourites.json'; 
    export let favouriteItems = []; 

    let cartItems = []; 

    
    const calculateTotalPrice = (price, quantity) => {
        let priceNumber = parseFloat(price.replace('₹', '').replace(',', ''));
        return `₹${(priceNumber * quantity).toLocaleString('en-IN')}`;
    };

  
    function increaseQuantity(item) {
        item.quantity += 1;
        favouriteItems = [...favouriteItems];
    }

    
    function decreaseQuantity(item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            favouriteItems = [...favouriteItems];
        }
    }

  
    function removeItem(index) {
        favouriteItems = favouriteItems.filter((_, i) => i !== index);
        localStorage.setItem('favouriteItems', JSON.stringify(favouriteItems)); 
    }

    
    function addToCart(item) {
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
        if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += item.quantity;
        } else {
            cartItems.push({ ...item });
        }
        alert(`${item.productName} added to cart!`);
    }

    function addAllToCart() {
        favouriteItems.forEach(item => addToCart(item));
        alert("All items added to cart!");
    }

    function clearAll() {
        favouriteItems = [];
        localStorage.removeItem('favouriteItems');
    }

    
    onMount(() => {
        
        favouriteItems = favouritesData; 
        console.log('Favourite Items:', favouriteItems); 
    });
</script>

<div class="p-6 max-w-6xl mx-auto">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <h1 class="text-3xl font-bold mb-6">My Favourites</h1>

    <div class="flex justify-between items-center mb-8">
        <span class="text-gray-500 text-lg">Favourite items ({favouriteItems.length})</span>
        <div class="space-x-4 text-primary-400 font-semibold">
            <button on:click={addAllToCart} class="hover:underline">Add all to cart</button>
            <button on:click={clearAll} class="hover:underline">Clear all</button>
        </div>
    </div>

    <div class="space-y-6">
        {#each favouriteItems as item, index}
            <div class="flex items-start p-6 border border-primary-200 rounded-lg">
                <img src={item.image} alt={item.productName} class="w-24 h-24 object-cover rounded-lg" />

                <div class="ml-6 flex-1 space-y-2">
                    <h2 class="text-sm font-semibold text-primary-400">{item.productNumber}</h2>
                    <p class="text-lg font-semibold text-gray-800">{item.productName}</p>
                    <p class="text-sm text-gray-500">{item.description}</p>
                </div>

                <div class="flex flex-col items-end space-y-4">
                    <div class="flex items-center space-x-6 text-primary-400 font-semibold">
                        <button on:click={() => addToCart(item)} class="hover:underline flex items-center space-x-1">
                            <span>Add to cart</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.61-1 1.03-1.75 1.03H8.1l-.9 1.63l-.03.12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.09-.68.24-.96l1.36-2.45L3 4H1zm6 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5z"/></svg>
                        </button>
                        <button on:click={() => removeItem(index)} class="hover:underline flex items-center space-x-1">
                            <span>remove</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                        </button>
                    </div>

                    <div class="flex items-center space-x-4 mt-2">
                        <span class="font-semibold text-gray-800 text-lg">{item.price}</span>
                        <div class="flex items-center border rounded-lg px-2 py-1 space-x-2">
                            <button on:click={() => decreaseQuantity(item)} class="px-2 text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="0.5em" height="0.5em" viewBox="0 0 24 24"><path d="M19 12.998H5v-2h14z"/></svg>
                            </button>
                            <span class="text-lg">{item.quantity}</span>
                            <button on:click={() => increaseQuantity(item)} class="px-2 text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" ><path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg>
                            </button>
                        </div>
                        <span class="font-semibold text-gray-800 text-lg">{calculateTotalPrice(item.price, item.quantity)}</span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
