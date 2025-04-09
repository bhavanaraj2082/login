<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { authedUser } from '$lib/stores/mainStores.js';
	import {onMount} from "svelte";
	import { page } from "$app/stores";

	onMount(() => {
		const currentUrl = $page.url.href;
		document.cookie = `redirectUrl=${encodeURIComponent(currentUrl)}; path=/; max-age=30`;
		
	});

	const user = $authedUser?.email;
	let email = user;
	let orderNumber = '';
	let error = {};
	let showErrorPopup = false;

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const validateForm = () => {
		error = {};
		if (!email || !emailPattern.test(email)) {
			error.email = '*required and must be valid';
		}
		if (!orderNumber) {
			error.orderNumber = '*required order number';
		}
		return Object.keys(error).length === 0;
	};

	const handleSubmit = ({ cancel }) => {
		if (!validateForm()) {
			cancel();
		}
		return async ({ result }) => {
			if (result.type === 'success' && result.data.success) {
				let email = result?.data?.order?.userEmail || '';
				let url = `/order-status/${result.data?.order?.orderid}`;
				if (email) {
					url += `?email=${encodeURIComponent(email)}`;
				}
				goto(url);
			} else {
				showErrorPopup = true;
			}
		};
	};
</script>

<div class="flex items-center justify-center pb-6">
	<div class="container mx-auto sm:py-6 p-6 max-w-7xl lg:w-11/12 rounded-lg">
		<div class="flex items-center flex-col md:flex-row gap-8 rounded-md bg-white w-full shadow mb-10">
			<img src="/OrderStatus.webp" alt="Order Status Banner" class="w-48 h-48 ml-5 m-4" />
			<h2 class="font-semibold text-2xl md:text-3xl text-description mb-6">Order Status</h2>
		</div>
		<!-- <h2 class="text-2xl font-bold">Order Status</h2> -->
		<p class="text-lg md:text-base sm:text-sm mb-4">
			Please enter your order details below to check the status
		</p>
		<div class="bg-white px-6 py-3 rounded-md shadow text-center">
			<form method="post" action="?/orderStatus" use:enhance={handleSubmit}>
				<div class="flex flex-col md:flex-row md:space-x-4 mb-4 p-4 rounded">
					<div class="flex-1 mb-4 md:mb-0">
						<label for="email" class="block text-sm font-medium text-gray-700 text-start">
							Enter Email
							{#if error.email}
								<span class="text-red-500 text-xs">{error.email}</span>
							{/if}
						</label>
						<input
							type="text"
							id="email"
							name="email"
							bind:value={email}
							class="mt-1 p-2 border-1 border-gray-200 rounded-md w-full focus:ring-0 focus:outline-none focus:border-primary-500"/>
					</div>
					<div class="flex-1">
						<label for="orderNumber" class="block text-sm font-medium text-gray-700 text-start">
							Enter Order Number
							{#if error.orderNumber}
								<span class="text-red-500 text-xs">{error.orderNumber}</span>
							{/if}
						</label>
						<input
							type="text"
							id="orderNumber"
							name="orderNumber"
							bind:value={orderNumber}
							class="mt-1 p-2 border-1 border-gray-200 rounded-md w-full focus:outline-none focus:ring-0 focus:border-primary-500"/>
					</div>
				</div>

				<div class="flex justify-start mb-3">
					<button
						type="submit"
						class="sm:w-1/2 w-full md:w-1/4 px-4 py-2 ml-4 bg-primary-400 hover:bg-primary-500 text-white rounded-md mt-5">
						View Order Status
					</button>
				</div>
			</form>
		</div>
		{#if showErrorPopup}
			<div class="fixed inset-0 bg-gray-400 bg-opacity-50 flex backdrop-blur-sm items-center justify-center z-50">
				<div class="bg-white rounded-md p-5 shadow-lg w-80">
					<h2 class="text-lg text-heading font-semibold">Error</h2>
					<p class="mt-2 text-sm text-description">The order was not located.</p>
					<p class="mt-1 text-sm text-description">Please check the details and try again.</p>
					<button
						on:click={() => (showErrorPopup = false)}
						class="mt-4 bg-primary-500 text-white rounded px-4 py-2 float-right">
						Close
					</button>
				</div>
			</div>
		{/if}
		{#if !user}
			<div class="flex flex-col items-start w-full my-10 p-6 bg-white rounded-md shadow">
				<p class="text-base text-heading font-semibold mb-3">A Benefit For Chemikart Users</p>
				<p class="mb-5 text-xs md:text-sm lg:text-sm sm:text-sm leading-normal text-description">
					If you do not have your order information handy, registered users visit Order History to
					check an order status and access invoices.
				</p>
				<a href="/signin">
					<button
						type="button"
						class="py-2 px-10 text-sm font-medium text-white rounded bg-primary-400 hover:bg-primary-500">
						Sign In
					</button>
				</a>
			</div>
		{/if}
	</div>
</div>
