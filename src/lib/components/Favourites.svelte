<script>
    import {enhance,applyAction} from '$app/forms';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment'
    import  Icon from "@iconify/svelte";
    import { toast } from 'svelte-sonner';

    export let data;
 
    let favouriteItems = data.favData.favorite.map(item => ({
        ...item,
        price: item.priceSize ? 
            (typeof item.priceSize.price === 'string' ? item.priceSize.price : `₹${item.priceSize.price}`) : 
            (typeof item.price === 'string' ? item.price : `₹${item.price}`),
        size: item.priceSize ? item.priceSize.size : item.size,
        quantity: parseInt(item.quantity, 10) || 1,
        stock: parseInt(item.stock, 10) || 0
    }));

    let cartItems = [];
    let cart = browser? localStorage.getItem('cart') : []
    console.log('you existing cart',cart);

    const calculateTotalPrice = (price, quantity) => {
        let priceNumber = parseFloat(price.replace('₹', '').replace(',', ''));
        return `₹${(priceNumber * quantity).toLocaleString('en-IN')}`;
    };

    function increaseQuantity(item) {
       if(item.quantity < item.stock) {
        item.quantity += 1;
        favouriteItems = [...favouriteItems]; 
        // toast.success('Quantity increased', { description: `${item.productName} quantity updated` });
        } else {
            toast.warning('Maximum stock reached', { description: `Only ${item.stock} items available` });
        }
    }

    function decreaseQuantity(item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            favouriteItems = [...favouriteItems];
            // toast.success('Quantity decreased', { description: `${item.productName} quantity updated` });
        }
    }

    function addToCart(item) {
    if (!item) {
        toast.error('Invalid Item', { description: 'Cannot add undefined item to cart' });
        return [];
    }

    const safePrice = typeof item.price === 'string' ? 
            parseFloat(item.price.replace(/[^\d.]/g, '')) || 0 : 
            parseFloat(item.price) || 0;

    const safeItem = {
        id: item.id || generateUniqueId(), 
        description: item.productDesc || '',
        imgUrl: item.imgUrl || '',
        productName: item.productName || 'Unnamed Product',
        partNumber: item.productNumber || '',
        priceSize: {
            price: safePrice,
            size: item.size || (item.priceSize ? item.priceSize.size : '0')
        },
        quantity: Math.max(1, item.quantity || 1),
        stock: parseInt(item.stock || 0, 10)
    };

    function generateUniqueId() {
        return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    const cartItem = {
        description: safeItem.description,
        id: safeItem.id,
        image: safeItem.imgUrl,
        name: safeItem.productName,
        partNumber: safeItem.partNumber,
        priceSize: {
            price: safeItem.priceSize.price,
            size: safeItem.priceSize.size
        },
        quantity: safeItem.quantity,
        stock: safeItem.stock,
        addedAt: new Date().toISOString(),
        maxQuantity: safeItem.stock
    };

    const cartManagement = {
        getCart: () => {
            try {
                const existingCart = localStorage.getItem('cart');
                return existingCart ? JSON.parse(existingCart) : [];
            } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
                localStorage.removeItem('cart');
                return [];
            }
        },

        findExistingItem: (items, newItem) => {
            return items.findIndex(existingItem => 
                existingItem.id === newItem.id || 
                (existingItem.partNumber && existingItem.partNumber === newItem.partNumber) ||
                (existingItem.name && existingItem.name === newItem.name)
            );
        },

        mergeItemDetails: (existingItem, newItem) => {
            const mergedItem = { ...existingItem };
            const existingQuantity = existingItem.quantity || 0;
            const newQuantity = newItem.quantity || 0;
            const existingPrice = existingItem.priceSize?.price || 0;
            const newPrice = newItem.priceSize?.price || 0;
            const proposedQuantity = existingQuantity + newQuantity;
            const maxQuantity = existingItem.maxQuantity || proposedQuantity;
            mergedItem.quantity = Math.min(proposedQuantity, maxQuantity);
            mergedItem.priceSize = {
                price: ((existingPrice * existingQuantity) + (newPrice * newQuantity)) / mergedItem.quantity,
                size: existingItem.priceSize?.size || newItem.priceSize?.size
            };

            mergedItem.addedAt = new Date().toISOString();
            
            return mergedItem;
        },

        consolidateCart: (items) => {
            const uniqueItems = new Map();

            items.forEach(item => {
                const existingItem = uniqueItems.get(item.id);
                
                if (existingItem) {
                    const mergedItem = cartManagement.mergeItemDetails(existingItem, item);
                    uniqueItems.set(item.id, mergedItem);
                } else {
                    uniqueItems.set(item.id, item);
                }
            });

            return Array.from(uniqueItems.values());
        },

        updateLocalStorage: (items) => {
            try {
                localStorage.setItem('cart', JSON.stringify(items));
            } catch (error) {
                console.error('Failed to save cart to localStorage:', error);

                if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                    alert('Cart storage is full. Please remove some items.');
                }
            }
        },

        dispatchCartUpdateEvent: (items) => {
            if (typeof window !== 'undefined') {
                try {
                    window.dispatchEvent(new CustomEvent('cartUpdated', { 
                        detail: { 
                            items: items, 
                            totalItems: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
                            totalValue: items.reduce((sum, item) => sum + ((item.priceSize?.price || 0) * (item.quantity || 0)), 0)
                        } 
                    }));
                } catch (error) {
                    console.warn('Failed to dispatch cart update event:', error);
                }
            }
        }
    };
    let cartItems = cartManagement.getCart();

    const existingItemIndex = cartManagement.findExistingItem(cartItems, cartItem);

    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex] = cartManagement.mergeItemDetails(
            cartItems[existingItemIndex], 
            cartItem
        );
    } else {
        cartItems.push(cartItem);
    }

    const finalCartItems = cartManagement.consolidateCart(cartItems);

    cartManagement.updateLocalStorage(finalCartItems);
    cartManagement.dispatchCartUpdateEvent(finalCartItems);
    toast.success('Added to Cart', { description: `${item.productName} added successfully` });
    return finalCartItems;
    }

    function addAllToCart() {
        const availableItems = favouriteItems.filter(item => item.stock > 0);

            if (availableItems.length === 0) {
                toast.info('No Available Items', { description: 'All favourite items are out of stock' });
                return;
            }
        const newCartItems = favouriteItems.map(item => {
            const safeQuantity = Math.min(item.quantity || 1, item.stock);

         return{ description: item.productDesc,
            id: item.id,
            image: item.imgUrl,
            name: item.productName,
            partNumber: item.productNumber,
            priceSize: {
                price: parseFloat(item.price.replace('₹', '').replace(',', '')),
                size: item.size || (item.priceSize ? item.priceSize.size : '0')
            }, 
            quantity: item.quantity || 1,
            stock: parseInt(item.stock, 10),
        };
    });

        cartItems = newCartItems;
        localStorage.setItem('cart', JSON.stringify(newCartItems));

        toast.success('Added to Cart', { description: `${availableItems.length} ${availableItems.length === 1 ? 'item' : 'items'} added from favourites` });
    }
    function handleAddToCart(item) {
        if (item.stock === 0) {
        toast.warning('Out of Stock', { description: `${item.productName} is currently unavailable` });
        return;
        }
        try {
            addToCart(item);
            const itemIndex = favouriteItems.findIndex(favItem => favItem.id === item.id);
            if (itemIndex !== -1) {
                favouriteItems[itemIndex].quantity = 1;
                favouriteItems = [...favouriteItems];
            }
        } catch (error) {
            toast.error('Cart Error', { description: 'Failed to add item to cart' });
        }
    }
    function handleRemoveItem(item) {
        return async ({ result, update }) => {
            await update();
            if (result.type === 'success') {
                favouriteItems = favouriteItems.filter(fav => fav.id !== item.id);
                if (browser) {
                try {
                    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const updatedCart = currentCart.filter(cartItem => 
                        cartItem.id !== item.id && 
                        cartItem.partNumber !== item.productNumber
                    );
                    localStorage.setItem('cart', JSON.stringify(updatedCart));
                    window.dispatchEvent(new CustomEvent('cartUpdated', { 
                        detail: { 
                            items: updatedCart,
                            totalItems: updatedCart.reduce((sum, item) => sum + (item.quantity || 0), 0),
                            totalValue: updatedCart.reduce((sum, item) => 
                                sum + ((item.priceSize?.price || 0) * (item.quantity || 0)), 0)
                        } 
                    }));
                } catch (error) {
                    console.error('Error updating localStorage:', error);
                }
            }

            toast.success('Item removed', { 
                description: `${item.productName} removed from favourites` 
            });
        } else {
            toast.error('Remove Failed', { 
                description: result.data?.message || 'Failed to remove item' 
            });
        }
    };
    }
    function handleClearAll() {
    return async ({ result, update }) => {
        await update();
        
        if (result.type === 'success') {
            favouriteItems = [];
            if (browser) {
                try {
                    localStorage.removeItem('cart');
                    window.dispatchEvent(new CustomEvent('cartUpdated', { 
                        detail: { 
                            items: [],
                            totalItems: 0,
                            totalValue: 0
                        } 
                    }));
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
    onMount(() => {
        const storedCartItems = localStorage.getItem('cart');
        cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
    });

</script>
<div class="p-6 max-w-7xl mx-auto w-11/12">
    <h1 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6">My Favourites</h1>
    {#if favouriteItems.length === 0}
    <div class="flex flex-col items-center justify-center py-12 px-4 border border-primary-200 rounded-lg">
        <Icon icon="mdi:heart-outline" width="64" class="text-primary-300 mb-4" />
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Your favourites list is empty</h2>
        <p class="text-gray-500 text-center mb-6">Browse our products and add items to your favourites to see them here.</p>
        <a href="/products" class="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <Icon icon="game-icons:chemical-tank" width="20" class="mr-2" />
            Browse Products
        </a>
    </div>
    {:else}
    <div class="flex flex-col md:flex-row md:justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div class="text-gray-500 text-base md:text-lg">
            <p>Favourite items ({favouriteItems.length})</p>
        </div>
        <div class="flex space-x-4 items-center text-primary-400 overflow-hidden font-semibold">
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
    </div>
    <div class="space-y-6">
        {#each favouriteItems as item}
            <div class="flex flex-col md:flex-row items-stretch p-2 md:p-6 border border-primary-200 rounded-lg space-y-4 md:space-y-0">
                <div class="flex flex-col md:flex-row items-stretch p-2 md:p-6 rounded-lg space-y-4 md:space-y-0 flex-1">
                    <img 
                        src={item.imgUrl} 
                        alt={item.productName} 
                        class="w-full md:w-24 h-24 object-cover rounded-lg mx-auto md:mx-0" />
                    <div class="flex-1 ml-0 md:ml-6 space-y-2 break-words sm:items-center">
                        <h2 class="text-sm font-semibold text-primary-400">{item.productNumber}</h2>
                        <p class="text-lg font-semibold text-gray-800">{item.productName}</p>
                        <p class="text-sm text-gray-500">{item.productDesc}</p>
                    </div>           
                </div>
                <div class="flex pl-2 justify-start md:w-1/4 sm:items-center sm:justify-center">
                    <p class="font-semibold text-green-600 text-center">
                        <span class="text-gray-500 text-xs">Available Stock:</span> {item.stock}
                    </p>
                </div>
                <div class="flex flex-col justify-between items-start pl-2 md:items-end space-y-4 md:w-1/4">
                    <div class="flex space-x-6 text-primary-400 font-semibold">
                        <button 
                            on:click={() => handleAddToCart(item)} 
                            class="flex items-center space-x-1 text-primary-500 hover:text-primary-600">
                            <span>Add to</span>
                            <Icon icon="heroicons-solid:shopping-cart" width="18" />
                        </button>                       
                        <form 
                            method="POST" 
                            action="?/removeItem"
                            use:enhance={() => handleRemoveItem(item)}>
                            <input type="hidden" name="id" value={item.id} />
                            <button 
                                type="submit" 
                                class="flex items-center space-x-1 text-primary-500 hover:text-primary-600">
                                <span>Remove</span>
                                <Icon icon="mdi:delete" width="18" />
                            </button>
                        </form>
                    </div>
                    <div>
                        {#if item.size}
                            <span class="text-gray-800 text-xs">{item.size}/</span>
                        {/if}
                        <span class="font-semibold text-gray-800 text-xs">
                            {typeof item.price === 'string' ? item.price : `₹${item.price}`}
                        </span>
                    </div>
                    <div class="flex items-center pb-2 space-x-4">
                        <div class="flex items-center border border-primary-200 rounded px-2 py-1 space-x-2">
                            <button 
                                on:click={() => decreaseQuantity(item)} 
                                class="text-primary-500 hover:text-primary-700 disabled:opacity-50" 
                                disabled={item.quantity <= 1}>
                                <Icon icon="ic:outline-minus" width="18" />
                            </button>
                            <span class="text-sm font-medium text-gray-800">{item.quantity}</span>
                            <button 
                                on:click={() => increaseQuantity(item)} 
                                class="text-primary-500 hover:text-primary-700 disabled:opacity-50" 
                                disabled={item.quantity >= item.stock}>
                                <Icon icon="ic:outline-plus" width="18" />
                            </button>
                        </div>
                        <div class="flex flex-col items-start text-xs md:text-sm text-gray-700">
                            <span class="font-semibold text-gray-800">
                                Total: {calculateTotalPrice(item.price, item.quantity)}
                            </span>
                        </div>
                    </div>                        
                </div>
            </div>
        {/each}       
    </div>    
{/if}
</div> 