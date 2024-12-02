<script>
    import { authedUser } from "$lib/stores/mainStores.js";
    import { enhance, applyAction } from '$app/forms';
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import Icon from "@iconify/svelte";
    import { browser } from '$app/environment';

    export let data;
    const user = $authedUser?.email;
    $: isAuthenticated = !!data?.user?.email;

    let favData = (data?.favData?.favorite || []).map(item => ({
        id: item.id,
        name: item.productName,
        description: item.productDesc,
        partNumber: item.productNumber,
        image: item.imgUrl,
        priceSize: {
            price: item.priceSize.price,
            size: item.priceSize.size
        },
        quantity: parseInt(item.quantity) || 1,
        stock: parseInt(item.stock) || 0
    }));

    let cartItems = [];
    let cart = browser? localStorage.getItem('cart') : []
    // console.log('you existing cart',cart);

    onMount(() => {
        if (browser) {
            try {
                const storedCart = localStorage.getItem("cart");
                cartItems = storedCart ? JSON.parse(storedCart) : [];
            } catch (error) {
                console.error("Error loading cart from localStorage:", error);
                cartItems = [];
            }
        }
    });

    function calculateTotalPrice(price, quantity) {
        const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
        return (numericPrice * quantity).toFixed(2);
    }

    function increaseQuantity(item) {
        if (item.quantity < item.stock) {
            item.quantity += 1;
            favData = [...favData];
        } else {
            toast.warning("Maximum stock reached", { 
                description: `Only ${item.stock} items available` 
            });
        }
    }

    function decreaseQuantity(item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            favData = [...favData];
        }
    }

    function addToCart(item) {
           if (!item || item.stock <= 0) {
        toast.error('Item unavailable', { description: 'This item is out of Stock ' });
        return;
    }
        const cartItem = {
            id: item.id,
            name: item.name,
            description: item.description,
            partNumber: item.partNumber,
            image: item.image,
            priceSize: item.priceSize,
            quantity: Math.min(item.quantity, item.stock),
            stock: item.stock
        };

        try {
            const existingItemIndex = cartItems.findIndex(cart => cart.id === item.id);
            
            if (existingItemIndex !== -1) {
                const existingItem = cartItems[existingItemIndex];
                const newQuantity = Math.min(
                    existingItem.quantity + cartItem.quantity, 
                    cartItem.stock
                );
                cartItems[existingItemIndex] = {
                    ...existingItem,
                    quantity: newQuantity
                };
            } else {
                cartItems.push(cartItem);
            }

            updateCart(cartItems);
            toast.success("Added to Cart", { 
                description: `${item.name} added successfully` 
            });
        } catch (error) {
            console.error("Error updating cart:", error);
            toast.error("Cart Error", { 
                description: "Failed to update cart" 
            });
        }
    }

    function updateCart(updatedCart) {
        try {
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            window.dispatchEvent(new CustomEvent("cartUpdated", {
                detail: {
                    items: updatedCart,
                    totalItems: updatedCart.reduce((sum, i) => sum + i.quantity, 0),
                    totalValue: updatedCart.reduce((sum, i) => {
                        const price = parseFloat(i.priceSize.price.replace(/[^\d.]/g, ''));
                        return sum + (price * i.quantity);
                    }, 0)
                }
            }));
        } catch (error) {
            console.error("Error updating localStorage:", error);
        }
    }

    function addAllToCart() {
    const availableItems = favData.filter(item => item.stock > 0);
    
    if (availableItems.length === 0) {
        toast.info("No Available Items", { 
            description: "All favourite items are out of stock" 
        });
        return;
    }

    const updatedCart = [...cartItems];
    
    availableItems.forEach(item => {
        if (item.stock <= 0) return;

        const existingItemIndex = updatedCart.findIndex(cart => cart.id === item.id);
        const cartItem = {
            id: item.id,
            name: item.name,
            description: item.description,
            partNumber: item.partNumber,
            image: item.image,
            priceSize: item.priceSize,
            quantity: Math.min(item.quantity, item.stock),
            stock: item.stock
        };

        if (existingItemIndex !== -1) {
            updatedCart[existingItemIndex] = {
                ...updatedCart[existingItemIndex],
                quantity: Math.min(
                    updatedCart[existingItemIndex].quantity + item.quantity,
                    item.stock
                )
            };
        } else {
            updatedCart.push(cartItem);
        }
    });
    updateCart(updatedCart);
    cartItems = updatedCart;
    
     toast.success("All available items added to cart", { 
        description: "Added all items that are in stock to your cart" 
        });
    }

    function handleRemoveItem(item) {
        return async ({ result, update  }) => {
            await update();
            if (result.type === 'success') {
                favData = favData.filter(fav => fav.id !== item.id);
                cartItems = cartItems.filter(cart => cart.id !== item.id);
                if (browser) {
                    try {
                        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
                        const updatedCart = currentCart.filter(cartItem => 
                            cartItem.id !== item.id && 
                            cartItem.partNumber !== item.partNumber
                        );
                        updateCart(updatedCart);
                        cartItems = updatedCart;
                    } catch (error) {
                        console.error('Error updating localStorage:', error);
                    }
                }
                toast.success('Item removed', { 
                    description: `${item.name} removed from favourites` 
                });
            } else {
                toast.error('Remove Failed', { 
                    description: result.data?.message || 'Failed to remove item' 
                });
            }
        };
    }

    function handleClearAll() {
        return async ({ result, update  }) => {
            await update();
            if (result.type === 'success') {
                favData = [];
                cartItems = [];
                if (browser) {
                    try {
                        localStorage.removeAllItem('cart');
                        window.dispatchEvent(new CustomEvent('cartUpdated', {
                            detail: {
                                items: [],
                                totalItems: 0,
                                totalValue: 0
                            }
                        }));
                        cartItems = [];
                    } catch (error) {
                        console.error('Error clearing localStorage:', error);
                    }
                }
                toast.success('Favourites cleared', {
                    description: 'All items removed from favourites and cart'
                });
            } else {
                toast.error('Clear Failed', {
                    description: result.data?.message || 'Failed to clear favourites'
                });
            }
        };
    }
</script>
{#if !isAuthenticated}
<div class="p-6 max-w-7xl mx-auto w-11/12">
    <div class="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-lg shadow-sm">
        <div class="flex items-center">
            <div class="ml-4">
                <h3 class="text-lg font-medium text-primary-800">
                    Login Required
                </h3>
                <p class="mt-1 text-sm text-primary-600">
                    Please login to view and manage your favorites list.
                </p>
                <div class="mt-4">
                    <a href="/login?redirectTo=/my-favourite"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                        Login to continue
                    </a>
                </div>
            </div>
        </div>
    </div>
</div> 
{:else}
<div class="p-6 max-w-7xl mx-auto w-11/12">
    <h1 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6">My Favourites</h1>
    {#if favData.length > 0}
        <div class="flex space-x-4 items-center text-primary-400 overflow-hidden font-semibold mb-6">
            <button 
                on:click={addAllToCart} 
                class="flex items-center space-x-1 text-primary-500 hover:text-primary-600">
                <span>Add all to</span>
                <Icon icon="heroicons-solid:shopping-cart" width="18" />
            </button>
            <form 
                method="POST" 
                action="?/removeAllItem"
                use:enhance={handleClearAll}>
                <button 
                    type="submit" 
                    class="flex items-center space-x-1 pr-6 text-primary-500 hover:text-primary-600">
                    <span>Clear all</span>
                    <Icon icon="mdi:delete" width="18" />
                </button>
            </form>   
        </div>
        <div class="space-y-6">
            {#each favData as item (item.id)}
                <div class="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-200 rounded-lg w-full shadow">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        class="w-32 h-32 object-cover rounded-md mb-4 md:mb-0 md:mr-6"/>
                    <div class="flex-1 text-center md:text-left space-y-2">
                        <h2 class="text-lg font-bold text-gray-800">{item.name}</h2>
                        <p class="text-sm">{item.description}</p>
                        <p class="text-sm font-semibold">
                            Price: <span class="text-black">{item.priceSize.price}</span>
                        </p>
                        <p class="text-xs">Size: {item.priceSize.size}</p>
                    </div>
                    <div class="flex pl-2 justify-start md:w-1/4 sm:items-center m-1 p-2 rounded sm:justify-center">
                        <p class="font-semibold text-center" 
                           class:text-green-600={item.stock > 0} 
                           class:text-red-600={item.stock === 0}>
                            <span class="text-gray-500 text-xs">Available Stock:</span> {item.stock}
                        </p>
                    </div>
                    <div class="flex flex-col md:items-end items-center mt-4 md:mt-0 space-y-4">
                        <div class="flex space-x-4 relative">
                            <button 
                                on:click={() => addToCart(item)} 
                                class="flex items-center space-x-1 text-primary-500 hover:text-primary-600 relative group">
                                <span class="hidden md:inline">Add to</span>
                                <Icon 
                                    icon="heroicons-solid:shopping-cart" 
                                    class="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6" 
                                    aria-label="Add to Cart Icon" />
                                <span class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs bg-primary-200 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden">
                                    Add to Cart
                                </span>
                            </button>  
                            <form 
                                method="POST" 
                                action="?/removeItem"
                                use:enhance={() => handleRemoveItem(item)}
                                class="relative group">
                                <input type="hidden" name="itemId" value={item.id} />
                                <button 
                                    type="submit" 
                                    class="flex items-center space-x-1 text-primary-500 hover:text-primary-600 relative group">
                                    <span class="hidden md:inline">Remove</span>
                                    <Icon 
                                        icon="mdi:delete" 
                                        class="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6" 
                                        aria-label="Remove Icon" />
                                    <span class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden">
                                        Remove Item
                                    </span>
                                </button>
                            </form>
                        </div>
                        
                        <div class="flex items-center justify-center md:justify-start space-x-4">
                            <button 
                                on:click={() => decreaseQuantity(item)} 
                                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                disabled={item.quantity <= 1}>
                                -
                            </button>
                            <span class="text-sm font-medium">{item.quantity}</span>
                            <button 
                                on:click={() => increaseQuantity(item)} 
                                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                disabled={item.quantity >= item.stock}>
                                +
                            </button>
                        </div>
                        <p class="text-sm font-semibold text-gray-800">
                            Total: {calculateTotalPrice(item.priceSize.price, item.quantity)}
                        </p>
                    </div>
                </div> 
            {/each}
        </div>
    {:else}
        <div class="flex flex-col items-center justify-center py-12 px-4 border border-primary-200 rounded-lg">
            <Icon icon="mdi:heart-outline" width="64" class="text-primary-300 mb-4" />
            <h2 class="text-xl font-semibold text-gray-700 mb-2">Your favourites list is empty</h2>
            <p class="text-gray-500 text-center mb-6">Browse our products and add items to your favourites to see them here.</p>
            <a href="/products" class="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                <Icon icon="game-icons:chemical-tank" width="20" class="mr-2" />
                Browse Products
            </a>
        </div>
    {/if}
</div>
{/if}