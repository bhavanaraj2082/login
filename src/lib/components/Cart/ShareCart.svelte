
<script>
 import { toast } from 'svelte-sonner';
 import { goto } from '$app/navigation';
 import { enhance } from '$app/forms';
 import Icon from '@iconify/svelte';
 export let cartData
 console.log(cartData);
 let imgUrl
 let isImgPopup = false


 const handleShareCart = ({cancel})=>{
		return async ({result})=>{
			if(result.type === "success" && result.data.success){
				toast.success("Shared cart is added successfully")
				setTimeout(() => {
				goto('/cart')
				}, 1300);
			}else{
				toast.error("something went wrong while adding")
			}
		}
	}

	function imagePopup(img){
        imgUrl = img
		isImgPopup = true
	}
</script>

{#if cartData[0]?.cartItems.length === 0 || cartData.length === 0 || cartData === null || cartData === undefined}
  <div class=" h-80 flex py-20 justify-center bg-gray-50 lg:w-11/12 mx-auto max-w-7xl">
       <a href="/products" class="w-full">
        <div class="border-l-8 border-yellow-500 h-40 flex flex-col items-center justify-center text-yellow-700 p-6 mb-6 rounded-xl shadow hover:bg-yellow-50 transition-all duration-300">
          <div class="flex flex-col items-center text-center">
            <Icon icon="ic:baseline-remove-shopping-cart" class="text-4xl mb-4"/>
            <p class="font-semibold text-xs md:text-xl text-yellow-700 hover:text-yellow-800">
				Shared cart data is not found
            </p>
          </div>
        </div>
      </a>
  </div>
{:else}
<div class="w-full bg-white p-3 sm:px-6 lg:px-10 sm:py-3 h-fit">
    <div class=" flex items-center justify-between sticky top-0 bg-white z-10 mb-2">
        <h1 class=" font-semibold">Shared Cart</h1>
        <form action="?/sharecart" method="POST" use:enhance={handleShareCart} class=" flex items-center gap-2">
            <input type="hidden" name="cartId" value={cartData[0].cartId}>
            <button type="submit" class=" w-fit px-5 py-2 rounded text-xs font-medium flex items-center justify-center bg-primary-500 text-white"><Icon icon="mdi:cart-plus" width="20" height="20" class="mr-2" /> Add Cart</button>
            <button type="buttom" eventFunction={()=>goto('/cart')} class=" w-fit px-5 py-2 rounded text-xs font-medium flex items-center justify-center bg-primary-500 text-white"><Icon icon="mdi:cart-remove" width="20" height="20" class="mr-2" />Discard Cart</button>
        </form>
    </div>
    <div class="hidden lg:flex border-b-1 text-gray-500 text-sm pb-2 font-semibold">
        <p class=" w-6/12">Product</p>
        <p class=" w-2/12">Price</p>
        <p class=" w-2/12">Quantity</p>
        <p class=" w-2/12">Total</p>
    </div>

    <ul class="">
        {#each cartData[0].cartItems as item,index}
            <li class="flex flex-col lg:flex-row lg:items-center py-2 border-b-1">
        
                <h3 class=" lg:hidden font-medium text-xs sm:text-sm">Product</h3>
                <div class="flex items-center w-full md:w-6/12 md:pr-2">
                    <img src={item.productDetails.imageSrc} alt={item.productDetails.productName} class="w-20 h-20 shrink-0 object-cover rounded-md" />
                    <div class="ml-2">
                        <p class="text-xs text-black font-semibold">{item.productDetails?.productNumber}</p>
                        <p class=" text-gray-800 text-xs">{item.productDetails.productName}</p>
                        <p class=" text-gray-800 text-2s font-semibold">{item.pricing.break}</p>
                        <p class=" {item.quantity > item.stockDetails.stock ? " text-red-500" :" text-green-500"} text-2s ext-red-600 font-semibold">
                            {item.quantity > item.stockDetails.stock ? item.quantity - item.stockDetails.stock + " Back Order" : item.stockDetails.stock + " In Stock"}
                            <span class="{item.quantity > item.stockDetails.stock ? "" : " hidden"} text-green-500 ml-1">{item.stockDetails.stock + " In Stock"}</span>
                        </p>
                    </div>
                </div>
                <div class=" lg:w-6/12 sm:flex justify-between items-center">
                    
                     <div class=" lg:w-2/6">
                        <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Price</h3>
                        <div class="{item.isCart || item.isQuote ? " text-green-500" : ""} text-xs flex lg:flex-col lg:gap-0 gap-1 w-full font-semibold text-content">
                            {#if item.isCart}
                            ₹{item.cartOfferPrice.INR.toLocaleString("en-IN")}
                            {:else if item.isQuote}
                            ₹{item.QuoteOfferPrice.INR.toLocaleString("en-IN")}
                            {:else}
                            ₹{item.pricing.INR.toLocaleString("en-IN")}
                            {/if}
                            <p class=" {item.isCart || item.isQuote ? "" : "hidden"} text-xs line-through text-slate-300">₹{item.pricing.INR.toLocaleString("en-IN")}</p>
                            
                        </div>
                     </div>
                
                    <div class=" lg:w-2/6">
                        <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Quantity</h3>
                        <div class="flex items-center md:w-2/12">
                                <p class=" text-xs font-medium">
                                    {item.quantity}
                                </p>
                        </div>
                    </div>
                
                    <div class=" lg:w-2/6">
                        <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Total</h3>
                        <div class=" w-full flex justify-between items-center">
                            <div class="{item.isCart || item.isQuote ? " text-green-500" : ""} text-xs flex gap-1 lg:flex-col lg:gap-0 font-semibold">
                                ₹{item.itemTotalPrice.totalINR.toLocaleString("en-IN")}
                                <p class=" {item.isCart || item.isQuote ? "" : "hidden"} text-xs line-through text-slate-300">₹{(item.pricing.INR*item.quantity).toLocaleString("en-IN")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        {/each}
    </ul>
</div>
{/if}
