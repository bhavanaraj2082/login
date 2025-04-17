<script>
	import { enhance, applyAction } from '$app/forms';
	import { fade } from 'svelte/transition';
	// import { goto } from '$app/navigation';
	import { authedUser } from '$lib/stores/mainStores.js';
	import policyData from '$lib/data/returnReasons.json';
	import { toast, Toaster } from 'svelte-sonner';

	const user = $authedUser?.email;
	let email = user;
	let invoiceNumber = '';
	let error = {};
	let formError = '';
	let formSuccess = '';
	let { reasons, returnPolicy } = policyData;

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	function scrollToForm() {
		requestAnimationFrame(() => {
			const formElement = document.getElementById('formReturn');
			if (formElement) {
				formElement.scrollIntoView({ behavior: 'smooth' });
			}
		});
	}
	const validateForm = () => {
		error = {};
		if (!email) {
			error.email = '*Email is required';
		} else if (!emailPattern.test(email)) {
			error.email = '*Invalid email format';
		}
		if (!invoiceNumber) {
			error.invoiceNumber = '* Invoice number is required';
		}
		return Object.keys(error).length === 0;
	};
	
	$: if (formSuccess || formError) {
		setTimeout(() => {
			formSuccess = '';
			formError = '';
		}, 5000);
	}

	const truncateText = (text, maxLength = 350) => 
        text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

	const handleSubmit = ({ cancel }) => {
		if (!validateForm()) {
			cancel();
			if (error.email) {
				toast.error(error.email);
				setTimeout(() => {
					if (error.invoiceNumber) {
						toast.error(error.invoiceNumber); 
					}
				}, 5000);
			} else if (error.invoiceNumber) {
				toast.error("Invoice Number is required. Please provide a valid Invoice Number.");
			}
			return false;
		}
		// if (!validateForm()) {
		// 	cancel();
		// }
		return async ({ result }) => {
			console.log(result);
			if (result.type === 'redirect') {
				window.location.href = result.location;
				// await applyAction(result);
				toast.success('Order found! Redirecting to your return request page...');  
				return;
			 } else {
				formError = 'Invalid Email address OR Invoice Number. Please check and try again';
				toast.error(formError);  
			}
			// else if (result.type === 'success') {
			// 	if (result.data?.error === 'invalid_invoice') {
			// 		formError = 'Invalid Invoice Number. Please check and try again.';
			// 	} else if (result.data?.error === 'order_not_found') {
			// 		formError = 'Order not found in the database.';
			// 	} else if (result.data?.order?.invoiceNumber) {
			// 		goto(`/returns/${result.data?.order?.invoiceNumber}`);
			// 	}
			// } else {
			// 	formError = 'An unexpected error occurred. Please try again.';
			// }
		};
	};

</script>
<section class="w-full mx-auto max-w-7xl">
	<div class="bg-white shadow rounded-md flex justify-center items-center py-4">
		<div class="flex flex-col md:flex-row w-full items-center">
			<img
				class="p-4 w-36 h-36 md:w-48 md:h-48"
				src="/return1.webp"
				alt="Return Order Issue"/>
			<h2 class="sm:text-2xl text-xl font-bold mb-4 md:mb-0 ml-4 text-left text-heading">
				Have an issue with an order? Start here!
			</h2>
		</div>
	</div>
	<section class="mt-10">
		<h2 class="text-lg md:text-2xl font-bold text-heading text-left">
			Issue with an order you have received:
		</h2>
		<div class="bg-white rounded-lg shadow mt-4 flex flex-col md:flex-row items-center md:items-start p-4 sm:p-6">
			<div class="w-full md:w-1/2 p-4 sm:p-6">
				<ul class="space-y-2 sm:space-y-3 sm:pl-6">
					{#each reasons as reason}
						<li class="flex items-center text-gray-description text-xs sm:text-base">
							<span class="bg-primary-400 w-3 h-3 mr-2 rounded-full overflow-hidden whitespace-nowrap"></span>{reason}
						</li>
					{/each}
				</ul>
				<div class="pl-4 sm:pl-6 mt-6 sm:mt-8">
					<button
						on:click={scrollToForm}
						class="bg-primary-400 hover:bg-primary-500 text-white text-sm sm:text-base py-2 px-4 rounded-md transition-all duration-300">
						Start Here
					</button>
				</div>
			</div>
			<div class="flex-none w-full md:w-1/2 h-auto flex items-center justify-center mt-6 md:mt-0">
				<img
					class="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain"
					src="/return3.webp"
					alt="Return page visual"/>
			</div>
		</div>
	</section>
	<section class="mt-10 ">
		<h2 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 text-left">
			Chemikart Return Policy At A Glance
		</h2>
		<div class="bg-white rounded-lg shadow mt-4 flex flex-col md:flex-row items-center md:items-start p-4 sm:p-6">
			<div class="flex-none w-full md:w-1/3 h-auto flex items-center justify-center mb-4 md:mb-0">
				<img
					class="w-48 h-48 md:w-60 md:h-60 object-contain"
					src="/return2.webp"
					alt="Policy illustration"/>
			</div>
			<div class="p-4 sm:p-6 text-gray-600 text-center md:text-left md:w-2/3">
				<p class="text-xs sm:text-sm md:text-base leading-relaxed text-justify">
					{truncateText(returnPolicy.policy1)}
				</p>
				<p class="mt-2 text-xs sm:text-md md:text-base pt-4 leading-relaxed text-justify">
					{truncateText(returnPolicy.policy2)}
				</p>
			</div>
		</div>
	</section>
	<section id="formReturn" class="bg-white rounded-lg shadow m-10 p-8 mx-auto">
		<h2 class="md:text-xl text-lg font-bold mt-2">Request a return or resolve an order issue</h2>
		<p class="text-description py-2 mb-4">
			Enter the email , invoice number associated with the shipment.
		</p>
		<form
			method="POST"
			action="?/returns"
			use:enhance={handleSubmit}
			class="w-full md:flex gap-4 py-3">
			<div class="flex flex-col w-full md:w-1/3"> 
				<label for="email" class="mb-1 text-sm font-medium text-gray-700">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					on:input={(e) => {
						e.target.value = e.target.value.replace(/^\s+/, '');
						email = e.target.value;
											}}
					class="w-full p-1.5 border-1 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400"/>
			</div>
			<div class="flex flex-col w-full md:w-1/3 mt-4 sm:mt-0">
				<label for="invoiceNumber" class="mb-1 text-sm font-medium text-gray-700">Invoice Number</label>
				<input
					type="text"
					name="invoiceNumber"
					bind:value={invoiceNumber}
					on:input={(e) => {
						e.target.value = e.target.value.replace(/^\s+/, '');
						invoiceNumber = e.target.value;
											}}
					class="w-full p-1.5 border-1 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400"/>
			</div>
			<div class="flex flex-col w-full sm:w-auto mt-6">
				<button
					type="submit"
					class="bg-primary-400 text-white py-2 md:w-40 sm:w-auto rounded-md hover:bg-primary-500 transition-all duration-300">
					Continue
				</button>
			</div>
		</form>
	</section>
	<Toaster position="bottom-right" richColors />
	<!-- {#if formError}
		<div
			class="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50"
			role="alert"
			transition:fade>
			<p>{formError}</p>
		</div>
	{/if} -->
</section>
