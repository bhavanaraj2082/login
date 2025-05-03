<script>
	import Icon from '@iconify/svelte';
	import InvoiceDatailes from "$lib/components/ReturnStatus/InvoiceDatailes.svelte";
	import SelectItems from "$lib/components/ReturnStatus/SelectItems.svelte";
  
	export let data;
	const authedUser = data?.authedUser;
	const returndata = data?.returndata;
	
	const isUserLoggedIn = !!authedUser; 
	const isOrderDataAvailable = returndata && !returndata.error;
  
	// console.log('Return Data:', returndata);
	// console.log('User:', authedUser);
  
	let errorMessage = '';
	if (!isUserLoggedIn) {
	  errorMessage = "You need to log in to view the return status.";
	} else if (isOrderDataAvailable && returndata.error) {
	  errorMessage = "The order number is Invalid.";
	}
  </script>

<div>
	{#if !isUserLoggedIn}
	<div class="flex flex-col justify-between items-center w-full md:w-11/12 md:mx-auto max-w-7xl px-4 md:px-0">
	<h1 class="text-2xl font-bold mb-6 text-left w-full">Login Required</h1>
	<div class="border-l-8 w-full border-yellow-300 h-48 flex flex-col items-center justify-center p-8 mb-6 rounded-xl shadow transition-all duration-300">
		<div class="flex flex-col items-center text-center py-4">
			<Icon icon="bx:user-x" class="text-5xl mb-4 text-yellow-600 p-2 rounded-full shadow" />
			<p class="text-sm md:text-lg font-medium text-yellow-600">
				You are not logged in. Please log in to access your return status.
			</p>
			<a href="/signin" class="px-6 py-2 text-sm font-medium border border-primary-400 rounded-md mt-4 hover:text-white hover:bg-primary-500 transition-all duration-300">SignIn</a>
		</div>
	</div>
  </div>
 {:else if !isOrderDataAvailable}
 <div class="flex flex-col justify-between items-center w-full md:w-11/12 mx-auto max-w-7xl px-4 md:px-0">
	<h1 class="text-2xl font-bold mb-6 text-left w-full">Order Error</h1>
	<div class="border-l-8 border-red-300 h-48 flex flex-col items-center justify-center p-6 mb-6 rounded-xl shadow transition-all duration-300 w-full">
		<div class="flex flex-col items-center text-center my-4">
			<Icon icon="bx:error" class="text-5xl mb-4 text-red-600 p-2 rounded-full shadow" />
			<p class="font-medium text-sm md:text-lg text-red-600">
				{errorMessage || 'Unable to fetch order data. Please check your information and try again.'}
			</p>
			<a href="/returns" class="px-6 py-2 text-sm font-medium border border-red-600 rounded-md mt-4 hover:text-white hover:bg-red-700 transition-all duration-300">Back to Returns</a>
		</div>
	</div>
</div>
	{:else}
	<InvoiceDatailes {returndata} />
	<SelectItems {data} />
	{/if}
  </div>
    
  <!-- <div>
	{#if !isUserLoggedIn}
	  <div class="max-w-2xl mx-auto p-4 bg-yellow-100 text-yellow-600 border border-yellow-600 rounded-lg shadow-md text-center mb-5">
		You are not logged in. Please log in to see your return status.
	  </div>
	{:else if !isOrderDataAvailable}
	  <div class="w-fll px-2 max-w-2xl mx-auto p-4 bg-red-100 text-red-600 border border-red-600 rounded-lg shadow-md text-center mb-5">
		{errorMessage || "Unable to fetch order data. Please check the provided Proper information and try again."}
	  </div>
	{:else}
	  <InvoiceDatailes {returndata} />
	  <SelectItems {data} />
	{/if}
  </div> -->

<!-- <script>
	import InvoiceDatailes from "$lib/components/ReturnStatus/InvoiceDatailes.svelte";
	import SelectItems from "$lib/components/ReturnStatus/SelectItems.svelte";
  
	export let data;
	const authedUser = data?.authedUser;
	const returndata = data?.returndata;
	
	const isUserLoggedIn = !!authedUser; 
	const isOrderDataAvailable = returndata && !returndata.error;
	const isErrorInOrder = returndata?.error;
  
	let errorMessage = '';
  
	if (!isUserLoggedIn) {
	  if (isErrorInOrder) {
		errorMessage = "The order number is Invalid";
	  }
	} 
	else {
	  if (isErrorInOrder) {
		errorMessage = "The order number is invalid or there was an error fetching the data.";
	  }
	}
  
	console.log('Return Data:', returndata);
	console.log('User:', authedUser);
  </script>
  
  <div>
	{#if !isUserLoggedIn}
	  {#if isOrderDataAvailable}
		<InvoiceDatailes {returndata} />
		<SelectItems {data} />
	  {:else}
		<div class="max-w-2xl mx-auto p-4 bg-red-100 text-red-600 border border-red-600 rounded-lg shadow-md text-center mb-5">
		  {errorMessage || "We couldn't find your order. Kindly review the provided information and try once more."}
		</div>
	  {/if}
	{:else}
	  {#if isOrderDataAvailable}

		<InvoiceDatailes {returndata} />
		<SelectItems {data} />
	  {:else}
		<div class="max-w-2xl mx-auto p-4 bg-red-100 text-red-600 border border-red-600 rounded-lg shadow-md text-center mb-5">
		  {errorMessage || "We couldn't fetch your order details. Please check the order number and try again."}
		</div>
	  {/if}
	{/if}
  </div>
   -->