<script>
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { authedUser,currencyState } from '$lib/stores/mainStores.js'

    export let data
    let cartData = data.cart.cart[0]
    console.log(data);
    let extendDate = ''
    let month
    let isToggle = false
    let response,oldDate,recurringDate,filtered,maxDate,recurrence
    let cartId = cartData?.cartId || ""
    let currentDate = new Date().toISOString().split('T')[0]

    if(cartData?.recurrence){
        recurringDate = cartData?.recurrence?.recurringDate || ""
        oldDate = new Date(cartData?.recurrence?.recurringDate).toISOString().split('T')[0];
        filtered = cartData?.cartItems.find(x=>x.isQuote === true || x.isBom === true || x.isOffered === true)
        extendDate = new Date(cartData?.recurrence?.recurringDate).toISOString().split('T')[0];
        const date = new Date(cartData?.recurrence?.recurringDate)
        date.setDate(date.getDate()+30)
        maxDate = date.toISOString().split('T')[0]
        if(cartData?.recurrence?.recurring === 1){
           month = "Monthly"
	    }else if(cartData?.recurrence?.recurring === 3){
          month = "Quarterly"
	    }else if(cartData?.recurrence?.recurring === 6){
           month = "Semi Annual"
	    }else if(cartData?.recurrence?.recurring === 12){
           month = "Annual"
	    }else{
	    	month = cartData?.recurrence?.recurring + "Months"
	    }
    
        recurrence = new Date(cartData?.recurrence?.recurringDate); 
	    recurrence.setMonth(recurrence.getMonth() + cartData?.recurrence?.recurring)
}
    
    let originalPrice
    let normalPrice
    $: if($currencyState === "inr"){
        originalPrice = cartData?.cartItems.reduce((sum, crt) => sum + (crt.currentPrice.INR*crt.quantity), 0)
        normalPrice = cartData?.cartItems.reduce((sum, crt) => sum + (crt.normalPrice.INR*crt.quantity), 0)
    }else{
        originalPrice = cartData?.cartItems.reduce((sum, crt) => sum + (crt.currentPrice.USD*crt.quantity), 0)
        normalPrice = cartData?.cartItems.reduce((sum, crt) => sum + (crt.normalPrice.USD*crt.quantity), 0)
    }

	
    function formatDate(isoString) {
       if( isoString === undefined) return "NA"
       const [date, time] = isoString.split('T');
       const [year, month, day] = date.split('-');
       return `${day}/${month}/${year}`;
    }

    const handleResponse =() => {
       return async({result})=>{
         if(result.data?.success){
            response = result.data
         }
       }
    }
    
    const handleSubmit =() => {
       return async({result})=>{
         if(result.data?.success){
            response = result.data
         }
       }
    }
</script>

{#if !cartData?.recurrence || cartData?.userId !== $authedUser.id || currentDate !== oldDate}
<div class=" h-80 flex justify-center items-center">
    <p class=" text-lg font-medium text-gray-500">The page you are trying to access is available only for specific use cases</p>
</div>
{:else}
 {#if response === undefined}
<div class=" w-full md:w-11/12 mx-auto bg-white p-4 md:p-6">
    <h1 class="text-xl font-bold text-gray-800 mb-2">Recurring Order</h1>
    <div class="">
        <div class="border-b-1 border-gray-300 pb-4 flex flex-col sm:flex-row sm:justify-between">
            <p class=" text-sm font-medium text-Black">Cart Name: <span class=" text-gray-600 uppercase">{cartData?.cartName}</span></p>
            <!-- <p class=" text-sm font-medium text-black">Customer: <span class=" text-gray-600 font-normal uppercase"> {$authedUser.firstname} {$authedUser.lastname} </span></p> -->
            <p class=" text-sm font-medium text-black">Recurring: <span class=" text-gray-600 font-normal"> {month} </span></p>
            <p class=" text-sm font-medium text-black">Recurring Order Date: <span class=" text-gray-600 font-normal"> {formatDate(cartData?.recurrence?.recurringDate)} </span></p>
            <p class=" text-sm font-medium text-black">Next Recurring Date: <span class=" text-gray-600 font-normal"> {formatDate(recurrence?.toISOString())}</span> </p>
        </div> 
        <div class="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center py-3">
            <div class=" w-full sm:w-2/3 flex items-center gap-3 md:gap-5">
                <p class=" font-bold text-md md:text-xl"><span class=" text-xs text-gray-500 font-semibold mr-1">Items Count </span>{cartData?.cartItems?.length}</p>
                <p class=" font-bold text-md md:text-xl {filtered !== undefined ? "text-green-600": ""}"><span class=" text-xs text-gray-500 font-semibold mr-1">Total </span>{$currencyState === "inr" ? "₹": "$"}{originalPrice.toLocaleString("en-IN")} <span class="{filtered !== undefined ? "": "hidden"} text-sm font-semibold text-gray-400 line-through">{$currencyState === "inr" ? "₹": "$"}{normalPrice.toLocaleString("en-IN")}</span></p>
            </div>
            {#if !isToggle}
            <form method="POST" use:enhance={handleSubmit} class=" w-full flex space-x-1.5 text-xs sm:text-sm sm:space-x-4 sm:justify-end">
                <input type="hidden" name="cartId" value={cartId}>
                <input type="hidden" name="recurringDate" value={recurringDate}>
                <button formaction="?/activeCart" type="submit" on:click={()=>setTimeout(()=>goto('/checkout'),1000)} class="bg-green-600 border-1 border-green-600 font-medium font-roboto text-white px-3.5 md:px-6 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">Checkout</button>
                <button type="button" on:click={()=>isToggle = true} class="bg-primary-500 border-1 border-primary-500 font-medium font-roboto text-white px-3.5 md:px-6 py-2 rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500">Extend Date</button>
                <button formaction="?/recurrenceReject" type="submit" class="bg-red-600 border-1 border-red-600 font-medium font-roboto text-white px-3.5 md:px-6 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">Reject</button>
            </form>
        {:else}  
            <div class=" flex items-center justify-end">
                <button class=" px-5 py-1.5 text-sm text-primary-500 font-medium border-1 rounded border-primary-500 hover:bg-primary-500 hover:text-white outline-none" on:click={()=>isToggle = false}>Cancel</button>
            </div>
        {/if}
        </div>
        
        <form method="POST" action="?/newRecurrenceDate" use:enhance={handleResponse} class="py-4 {isToggle ? "flex" : "hidden"} flex-col sm:flex-row justify-between gap-3 items-center">
            <p class=" w-full font-medium text-sm text-gray-600">Select New Recurring Date (MM/DD/YYYY)</p>
            <input type="hidden" name="cartId" value={cartId}>
            <div class=" flex items-center w-full relative">
                <input type="date" bind:value={extendDate} max={maxDate} name="newDate" class=" full-width-input p-0 text-sm border border-gray-300 rounded w-full sm:w-96 md:w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <Icon icon="uis:calender" class=" shrink-0 text-xl absolute right-3 " />
            </div>
             <button type="submit" disabled={extendDate === "" || extendDate === oldDate} variant="hover" class=" rounded w-full py-1 z-0 sm:w-96 md:w-full bg-primary-500 text-white outline-none font-medium border-1 border-primary-500 hover:bg-primary-600">Submit New Date</button>
        </form>
    </div>

    <div class="w-full bg-white rounded-lg h-fit">
       <p class=" font-semibold flex items-center text-xs pb-1"> <span class=" text-xl text-red-500">*</span>Excluding GST price</p>
        <div class="hidden lg:flex text-gray-500 text-sm pb-2 font-semibold">
            <p class=" w-6/12">Product</p>
            <p class=" w-2/12">Price</p>
            <p class=" w-2/12">Quantity</p>
            <p class=" w-2/12">Total</p>
        </div>

        <ul class="">
            {#each cartData?.cartItems as item,index}
                <li class="flex flex-col lg:flex-row lg:items-center py-2 border-t-1">
            
                    <h3 class=" lg:hidden font-medium text-xs sm:text-sm">Product</h3>
                    <div class="flex items-center w-full md:w-6/12 md:pr-2">
                        <div>
                            <img src={item.productDetails.imageSrc} alt={item.productDetails.productName} class=" cursor-pointer w-20 h-20 object-contain rounded-md" />
                        </div>
                        <div class="ml-2">
                            <p class="text-xs text-black font-semibold">{item.productDetails.productNumber}</p>
                            <p class=" text-gray-800 text-xs">{item.productDetails.productName}</p>
                            <p class=" text-gray-800 text-2s font-semibold">{item.pricing.break}</p>
                            <p class=" {item.quantity > item.stockDetails.stock ? " text-red-500" :" text-green-500"} text-2s ext-red-600 font-semibold">
                                {item.quantity > item.stockDetails.stock ? item.quantity - item.stockDetails.stock + " Back Order" : item.quantity + " In Stock"}
                                <span class="{item.quantity > item.stockDetails.stock ? "" : " hidden"} text-green-500 ml-1">{item.stockDetails.stock + " In Stock"}</span>
                            </p>
                        </div>
                    </div>
                    <div class=" lg:w-6/12 sm:flex justify-between items-center">
                        
                         <div class=" lg:w-2/6">
                            <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Price</h3>
                            <div class="{item.isCart || item.isQuote ? " text-green-500" : ""} text-xs flex lg:flex-col lg:gap-0 gap-1 w-full font-semibold text-content">
                                {$currencyState === "inr" ? "₹" + item.currentPrice.INR.toLocaleString("en-IN"): "$"+ item.currentPrice.USD.toLocaleString("en-IN")}
                                <p class=" {item.isCart || item.isQuote ? "" : "hidden"} text-xs line-through text-slate-300">
                                {$currencyState === "inr" ? "₹" + item.normalPrice.INR.toLocaleString("en-IN"): "$"+ item.normalPrice.USD.toLocaleString("en-IN")}
                                </p>
                            </div>
                         </div>
                    
                        <div class=" lg:w-2/6">
                            <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Quantity</h3>
                            <div class="flex items-center md:w-2/12">
                            <div class=" text-sm font-medium">
                                {item.quantity}
                            </div>
                            </div>
                        </div>
                    
                        <div class=" lg:w-2/6">
                            <h3 class=" lg:hidden mt-3 font-medium text-xs sm:text-sm">Total</h3>
                            <div class=" w-full flex justify-between items-center">
                                <div class="{item.isCart || item.isQuote ? " text-green-500" : ""} text-xs flex gap-1 lg:flex-col lg:gap-0 font-semibold">
                                    {$currencyState === "inr" ? "₹" + item.itemTotalPrice.totalINR .toLocaleString("en-IN"): "$"+ item.itemTotalPrice.totalUSD.toLocaleString("en-IN")}
                                    <p class=" {item.isCart || item.isQuote ? "" : "hidden"} text-xs line-through text-slate-300">
                                        {$currencyState === "inr" ? "₹" + (item.normalPrice.INR*item.quantity).toLocaleString("en-IN"): "$"+ (item.normalPrice.USD*item.quantity).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
</div> 

{:else}
<div class=" h-96 flex flex-col justify-center items-center gap-2">
    <Icon icon={response?.success ? "ep:success-filled" : "material-symbols:cancel-rounded"} class=" text-4xl lg:text-6xl shrink-0 {response?.success ? " text-green-600" : " text-red-600"}"/>
    <p class=" font-medium text-sm lg:text-lg  {response?.success ? " text-green-600" : " text-red-600"}">{response.message}</p>
</div>
{/if}
{/if}

<style>
    .full-width-input {
    position: relative;
    width: 100%; 
   padding: 8px 12px;
  font-size: 15px;  
  appearance:auto;  
  -webkit-appearance: auto;
  -moz-appearance: auto; 
}

.full-width-input::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    opacity: 0;
    cursor: pointer;
    height: 32.5px;
    width: 100%;
}
</style>
