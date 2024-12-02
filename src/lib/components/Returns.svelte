<script>
	import { fade } from 'svelte/transition';
	import { enhance, applyAction } from '$app/forms';
	import { goto } from '$app/navigation';
	import policyData from '$lib/data/returnReasons.json';

	let email = '';
	let invoiceNumber = '';
	let error = {};
	let formError = '';
	let formSuccess = '';
	let { reasons, returnPolicy } = policyData;

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	function scrollToForm() {
		showFormReturn = true;
		requestAnimationFrame(() => {
			document.getElementById('formReturn')?.scrollIntoView({ behavior: 'smooth' });
		});
	}
	const validateForm = () => {
		error = {};
		if (!email || !emailPattern.test(email)) {
			error.email = '*required and must be valid';
		}
		if (!invoiceNumber) {
			error.invoiceNumber = '*required Invoice number';
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
		}
		return async ({ result }) => {
			console.log(result);
			if (result.type === 'redirect') {
				await applyAction(result);
			} else if (result.type === 'success') {
				if (result.data?.error === 'invalid_invoice') {
					formError = 'Invalid Invoice Number. Please check and try again.';
				} else if (result.data?.error === 'order_not_found') {
					formError = 'Order not found in the database.';
				} else if (result.data?.order?.invoiceNumber) {
					goto(`/returns/${result.data?.order?.invoiceNumber}`);
				}
			} else {
				formError = 'An unexpected error occurred. Please try again.';
			}
		};
	};
</script>
<section class="w-full md:w-11/12 mx-auto px-4 max-w-7xl">
	<div class="bg-white border rounded flex justify-center items-center py-4">
		<div class="flex flex-col md:flex-row w-full items-center">
			<img
				class="p-4 w-36 h-36 md:w-48 md:h-48"
				src="/return1.jpg"
				alt="Return Order Issue"
			/>
			<h2 class="text-2xl font-bold mb-4 md:mb-0 ml-4 text-center md:text-left text-heading">
				Have an issue with an order? Start here!
			</h2>
		</div>
	</div>
	<section class="mt-16">
		<h2 class="text-lg sm:text-xl md:text-2xl font-bold text-heading text-center md:text-left">
			Issue with an order you have received:
		</h2>
		<div class="bg-white border rounded mt-4 flex flex-col md:flex-row items-center md:items-start p-4 sm:p-6">
			<div class="w-full md:w-1/2 p-4 sm:p-6">
				<ul class="space-y-2 sm:space-y-3 pl-4 sm:pl-6">
					{#each reasons as reason}
						<li class="flex items-center text-gray-description text-sm sm:text-base">
							<span class="bg-primary-400 w-3 h-3 mr-2 rounded-full"></span>{reason}
						</li>
					{/each}
				</ul>
				<div class="pl-4 sm:pl-6 mt-6 sm:mt-8">
					<button
						on:click={scrollToForm}
						class="bg-primary-400 hover:bg-primary-600 text-white text-sm sm:text-base py-2 px-4 rounded">
						Start Here
					</button>
				</div>
			</div>
			<div class="flex-none w-full md:w-1/2 h-auto flex items-center justify-center mt-6 md:mt-0">
				<img
					class="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain"
					src="/return3.png"
					alt="Return page visual"/>
			</div>
		</div>
	</section>
	<section class="mt-16">
		<h2 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 text-center md:text-left">
			Chemikart Return Policy At A Glance
		</h2>
		<div class="bg-white border rounded mt-4 flex flex-col md:flex-row items-center md:items-start p-4 sm:p-6">
			<div class="flex-none w-full md:w-1/3 h-auto flex items-center justify-center mb-4 md:mb-0">
				<img
					class="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain"
					src="/return2.jpg"
					alt="Policy illustration"
				/>
			</div>
			<div class="p-4 sm:p-6 text-gray-600 text-center md:text-left md:w-2/3">
				<p class="text-sm sm:text-base md:text-lg leading-relaxed">
					{truncateText(returnPolicy.policy1)}
				</p>
				<p class="mt-2 text-sm sm:text-base md:text-lg pt-4 leading-relaxed">
					{truncateText(returnPolicy.policy2)}
				</p>
			</div>
		</div>
	</section>
	<section id="formReturn" class="bg-white border rounded m-10 p-6 mx-auto">
		<h2 class="text-xl font-bold mt-2">Request a return or resolve an order issue</h2>
		<p class="text-description p-2 mb-6">
			Enter the email , invoice number associated with the shipment.
		</p>
		<form
			method="POST"
			action="?/returns"
			use:enhance={handleSubmit}
			class="w-full md:flex gap-4 pt-4">
			<input
				type="email"
				name="email"
				bind:value={email}
				class="w-full sm:w-1/3 p-2 m-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400"
				required
				placeholder="Email"
			/>
			<input
				type="text"
				name="invoiceNumber"
				bind:value={invoiceNumber}
				class="w-full sm:w-1/3 p-2 m-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400"
				required
				placeholder="Invoice Number"
			/>
			<button
				type="submit"
				class="bg-primary-400 text-white py-2 m-2 px-6 rounded border border-primary hover:bg-primary-600 transition">
				Continue
			</button>
		</form>
	</section>
	{#if formError}
		<div
			class="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50"
			role="alert"
			transition:fade>
			<p>{formError}</p>
		</div>
	{/if}
</section>
