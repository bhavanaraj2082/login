<script>
	import {onMount}  from 'svelte';
	import { page } from '$app/stores';

	import Icon from '@iconify/svelte';
	let showPopup = false;
	let popupMessage = '';
    let logInPopup=false;
    function clearStorage() {
		logInPopup = true
	}
	
	onMount(() => {
		const currentUrl = $page.url.href;
		document.cookie = `redirectUrl=${encodeURIComponent(currentUrl)}; path=/; max-age=30`;
		
	});

</script>

{#if showPopup}
	<div class="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">
		{popupMessage}
	</div>
{/if}

<div class="w-full lg:w-11/12 mx-auto max-w-7xl mb-10">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 mx-2">
		<div class="space-y-6 sm:p-4 p-2">
			<h1 class="text-2xl font-extrabold text-gray-800">My Quote</h1>
			<p class="text-gray-600 text-sm md:text-base max-w-lg">
				Create a Quote, Become one of the thousands
				of customers that have incorporated MyLists into their purchasing process.
			</p>
			<div class="flex flex-col md:flex-row gap-4 mt-4">
				<button
					on:click={clearStorage}
					class=" sm:w-auto border w-full lg:w-auto border-primary-600 text-primary-600 px-4 py-2 rounded text-sm font-medium shadow hover:bg-primary-600 hover:text-white transition-colors duration-300 ease-in-out flex justify-center items-center">
					<Icon icon="mdi:add" class="mr-1 text-xl" />
					New Quote
				</button>
			</div>
		</div>
		<div class="flex justify-center items-center rounded-md shadow">
			<img src="/Quotes.webp" alt="MyList Illustration" class="w-64 h-auto" />
		</div>
	</div>
	<div class="text-center mb-16 mx-2">
		<h2 class="text-2xl font-extrabold text-gray-800 mb-6">Advanced Features</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each [{ icon: 'ph:test-tube-fill', title: 'Select custom solution type', desc: 'Customers can choose the specific type of solution that fits their needs. By this customers can tailor their choices based on their unique requirements.' }, { icon: 'wpf:edit-file', title: 'Select custom format', desc: 'You can actively choose your preferences between a pure substance or a solvent substance. ' }, { icon: 'hugeicons:test-tube', title: 'Configure custom solution', desc: 'Easily upload file format (XLSX) , download example XLSX and create your quote.' }, { icon: 'arcticons:youdao-note', title: 'Additional notes', desc: 'You can describe your preferences with more detail under additional notes.' }, { icon: 'ph:user-list', title: 'Customer details', desc: 'A customer can fill in their details, which helps personalization and ensure smooth communication.' }, { icon: 'material-symbols-light:delivery-truck-speed-outline', title: 'Delivery information', desc: 'Customers can provide their delivery details to ensure accurate shipping, timely updates, and a seamless order fulfillment process..' }] as feature}
				<div
					class="flex flex-col items-center text-center border rounded-md p-6 shadow hover:shadow-md transition-shadow">
					<Icon icon={feature.icon} class="text-primary-300 text-5xl mb-4" />
					<h3 class="md:text-lg text-md font-bold text-gray-700">{feature.title}</h3>
					<p class="sm:text-sm text-xs text-gray-500 mt-2">{feature.desc}</p>
				</div>
			{/each}
		</div>
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-3 mx-2">
		<div class="flex justify-center rounded-md shadow p-6">
			<img src="/QLogin.webp" alt="Registered Users Illustration" class="w-64 h-auto" />
		</div>
		<div class="space-y-6">
			<h2 class="md:text-xl text-sm font-bold text-gray-800">Registered Users Get these Benefit</h2>
			<ul class="md:list-disc list-inside text-gray-600 md:text-sm text-xs space-y-2">
                <li><strong>Create a Quote:</strong> Customer can create a Quote</li>
                <li><strong>Customer Details:</strong> Can enter personal info and invoice number</li>
                <li><strong>Delivery Information:</strong> Can provide address, postal code, and GST</li>
            </ul>
			<p class="md:text-sm text-xs">
				<a href="/signin" class="text-primary-600 hover:underline underline-offset-2">Login</a> or
				<a href="/signup" class="text-primary-600 hover:underline underline-offset-2">Register</a> to access all the features
				of My Quote.
			</p>
		</div>
	</div>
</div>

{#if logInPopup}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 bg-gray-400 bg-opacity-50"
		on:click={(e) => {
			if (e.target === e.currentTarget) {
				logInPopup = false;
			}
		}}>
	<div class="bg-white p-10 rounded-md shadow-md relative mx-2">
		<h2 class="md:text-2xl text-xl font-semibold mb-4">Create a Quote</h2>
		<p class="md:text-sm text-xs font-medium text-gray-700 mb-2">We love having you here!</p>
		<h3 class="md:text-sm text-xs font-medium mb-6">
			To Create a Quote, you need to be registered. Please 
			<a href="/signin" class="text-primary-700 hover:underline underline-offset-2">Login</a> 
			or 
			<a href="/signup" class="text-primary-700 hover:underline underline-offset-2">Register</a>.
		</h3>
		<button
			on:click={() => (logInPopup = false)}
			class="absolute bottom-6 right-8 bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300">
			Close
		</button>
	</div>
	
	</div>
{/if}
