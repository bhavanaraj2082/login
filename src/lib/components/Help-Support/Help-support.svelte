<script>
	import Icon from '@iconify/svelte';
	import Quotes from '$lib/components/Help-Support/Quotes.svelte';
	import Invoice from '$lib/components/Help-Support/Invoice.svelte';
	import OrderStatus from '$lib/components/Help-Support/Order-Status.svelte';
	import OrderConfiguration from '$lib/components/Help-Support/Order-configuration.svelte';
	import ReturnExchangeItems from '$lib/components/Help-Support/Return-exchange-items.svelte';
	import OtherIssues from '$lib/components/Help-Support/Other-issues.svelte';
	import UpdateBilling from '$lib/components/Help-Support/update-billing.svelte';
	import ShippingInfo from '$lib/components/Help-Support/shipping-info.svelte';
	import PasswordReset from '$lib/components/Help-Support/password-reset.svelte';
	import UpdateEmail from '$lib/components/Help-Support/update-email.svelte';
	import OtherAccountIssues from '$lib/components/Help-Support/other-account-issues.svelte';
	import PricingAvailability from '$lib/components/Help-Support/pricing-availability.svelte';
	import ProductDocumentation from '$lib/components/Help-Support/product-documentation.svelte';
	import ProductTechnicalIssues from '$lib/components/Help-Support/product-technical-issues.svelte';

	import TechnicalProblems from '$lib/components/Help-Support/technical-problems.svelte';
	import OtherWebsiteIssues from '$lib/components/Help-Support/other-website-issues.svelte';
	import ReportProductIssues from '$lib/components/Help-Support/Report-product-issues.svelte';
	// import ContactInfo1 from "./Contact-info1.svelte";
	let components = {};
	let Mainimage = '/images/Help&Support.JPG';
	let clickedButton = '';
	export let data;
	console.log(data,"help support");
	

	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	// Async handleClick function
	async function handleClick(buttonValue) {
		clickedButton = buttonValue;

		// Wait for the component to render
		await delay(0);

		// Scroll to the respective component
		if (components[buttonValue]) {
			components[buttonValue].scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<div class="main-container mx-auto w-11/12 max-w-7xl lg:px-3 md:px-2 sm:px-8 px-3 bg-gray-50 pb-10">
	<h3 class="mb-6 text-heading font-bold text-lg md:text-2xl">Help & Support</h3>

	<div
		class="flex flex-col justify-evenly items-center lg:flex-row lg:mb-8 bg-white border p-6 rounded"
	>
		<img src={Mainimage} alt="MainImAGE" class="w-80" />
		<div class="lg:w-1/3 my-2 lg:my-0 p-4">
			<h1 class="text-primary-400 font-semibold text-xl pb-2">What do you need help with?</h1>
			<p class="text-sm">
				Please select an option below and complete the form to contact our support specialists. For
				a better experience and access to your account details and order information, please <span>
					<!-- <a href="./login">Sign In.</a> -->
					<a href="/signin">Sign In.</a>
				</span>
			</p>
		</div>
	</div>

	<!-- card container -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 py-4 bg-gray-50 rounded-lg">
		<!-- card1 -->
		<div class="  rounded flex flex-col text-center border bg-white p-4">
			<h2
				class=" flex items-center justify-center text-base font-semibold mb-2 text-white bg-primary-400 px-4 py-2 rounded"
			>
				<span class="flex-1 text-center">ORDER</span>
				<span><Icon icon="radix-icons:double-arrow-down" class="w-8 h-5 text-white" /></span>
			</h2>
			<div class="flex flex-col text-sm bg-primary-50 rounded-lg h-full">
				<!-- <button
					on:click={() => handleClick('invoice')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Invoice
				</button> -->
				<button
    on:click={() => window.location.href = '/quotes'}
    class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
>
    Quotes
</button>
				<!-- <button
					on:click={() => handleClick('order-status')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
				
				</button> -->
				<button
				on:click={() => window.location.href = '/order-status'}
				class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
			>
			Order Status
			</button>
				<button
					on:click={() => handleClick('order-configuration')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Order Configuration
				</button>
				<button
					on:click={() => handleClick('return-exchange-items')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Return & Exchange Items
				</button>
				<button
					on:click={() => handleClick('other-issues')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Other Issues
				</button>
			</div>
		</div>
		<!-- card2 -->
		<div class="  rounded flex flex-col text-center border bg-white p-4">
			<h2
				class=" flex items-center justify-center text-base font-semibold mb-2 text-white bg-primary-400 px-4 py-2 rounded"
			>
				<span class="flex-1 text-center">ACCOUNT</span>
				<span><Icon icon="radix-icons:double-arrow-down" class="w-8 h-5 text-white" /></span>
			</h2>
			<div class="flex flex-col text-sm bg-primary-50 rounded-lg h-full">
				<!-- <button
					on:click={() => handleClick('update-billing')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Update Billing
				</button> -->
				<!-- <button
					on:click={() => handleClick('shipping-info')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Shipping info
				</button> -->
				<button
				on:click={() => {
					if (data && data?.profile?.email) {
						window.location.href = '/reset-password';
					} else {
				
						window.location.href = '/forgot';
					}
				}}
				class="px-4 py-2 rounded m-2 hover:font-semibold shadow"
			>
				Password reset
			</button>
				<!-- <button
					on:click={() => handleClick('update-email')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Update Email
				</button> -->
				<button
					on:click={() => handleClick('Other-account-issues')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Other Account issues
				</button>
			</div>
		</div>
		<!-- card3 -->
		<div class="  rounded flex flex-col text-center border bg-white p-4">
			<h2
				class=" flex items-center justify-center text-base font-semibold mb-2 text-white bg-primary-400 px-4 py-2 rounded"
			>
				<span class="flex-1 text-center">PRODUCT</span>
				<span><Icon icon="radix-icons:double-arrow-down" class="w-8 h-5 text-white " /></span>
			</h2>
			<div class="flex flex-col text-sm bg-primary-50 rounded-lg h-full">
				<button
					on:click={() => handleClick('pricing-availability')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Pricing & Availability
				</button>
				<!-- <button
					on:click={() => handleClick('product-documentation')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Product Documentation
				</button> -->
				<button
				on:click={() => window.location.href = '/documents'}
				class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
			>
			Product Documentation
			</button>
				<button
					on:click={() => handleClick('product-technical-issues')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Product technical Issues
				</button>
				<button
					on:click={() => handleClick('report-product-issues')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Report Product Issues
				</button>
			</div>
		</div>
		<!-- card4 -->
		<div class="  rounded flex flex-col text-center border bg-white p-4">
			<h2
				class=" flex items-center justify-center text-base font-semibold mb-2 text-white bg-primary-400 px-4 py-2 rounded"
			>
				<span class="flex-1 text-center">WEBSITE</span>
				<span><Icon icon="radix-icons:double-arrow-down" class="w-8 h-5 text-white" /></span>
			</h2>
			<div class="flex flex-col text-sm bg-primary-50 rounded-lg h-full">
				<button
					on:click={() => handleClick('technical-problem')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Technical Problem
				</button>
				<button
					on:click={() => handleClick('other-website-issues')}
					class=" px-4 py-2 rounded m-2 hover:font-semibold shadow"
				>
					Other Website Issues
				</button>
			</div>
		</div>
	</div>
	<div bind:this={components['invoice']}>
		{#if clickedButton === 'invoice'}<Invoice {data}/>{/if}
	</div>
	<div bind:this={components['quotes']}>
		{#if clickedButton === 'quotes'}<Quotes {data} />{/if}
	</div>
	<div bind:this={components['order-status']}>
		{#if clickedButton === 'order-status'}<OrderStatus {data} />{/if}
	</div>
	<div bind:this={components['order-configuration']}>
		{#if clickedButton === 'order-configuration'}<OrderConfiguration {data} />{/if}
	</div>
	<div bind:this={components['return-exchange-items']}>
		{#if clickedButton === 'return-exchange-items'}<ReturnExchangeItems {data} />{/if}
	</div>
	<div bind:this={components['other-issues']}>
		{#if clickedButton === 'other-issues'}<OtherIssues {data}/>{/if}
	</div>
	<div bind:this={components['update-billing']}>
		{#if clickedButton === 'update-billing'}<UpdateBilling {data} />{/if}
	</div>
	<div bind:this={components['shipping-info']}>
		{#if clickedButton === 'shipping-info'}<ShippingInfo {data} />{/if}
	</div>
	<div bind:this={components['password-reset']}>
		{#if clickedButton === 'password-reset'}<PasswordReset {data} />{/if}
	</div>
	<div bind:this={components['update-email']}>
		{#if clickedButton === 'update-email'}<UpdateEmail {data} />{/if}
	</div>
	<div bind:this={components['Other-account-issues']}>
		{#if clickedButton === 'Other-account-issues'}<OtherAccountIssues {data} />{/if}
	</div>
	<div bind:this={components['pricing-availability']}>
		{#if clickedButton === 'pricing-availability'}<PricingAvailability {data} />{/if}
	</div>
	<div bind:this={components['product-documentation']}>
		{#if clickedButton === 'product-documentation'}<ProductDocumentation {data} />{/if}
	</div>
	<div bind:this={components['product-technical-issues']}>
		{#if clickedButton === 'product-technical-issues'}<ProductTechnicalIssues {data} />{/if}
	</div>
	<div bind:this={components['report-product-issues']}>
		{#if clickedButton === 'report-product-issues'}<ReportProductIssues {data} />{/if}
	</div>
	<div bind:this={components['technical-problem']}>
		{#if clickedButton === 'technical-problem'}<TechnicalProblems {data} />{/if}
	</div>
	<div bind:this={components['other-website-issues']}>
		{#if clickedButton === 'other-website-issues'}<OtherWebsiteIssues {data} />{/if}
	</div>

	<!-- If you require user to contact u directly send there contact details to email uncomment the below svelte file and use it -->
	<!-- <ContactInfo1 /> -->
</div>

<style>
	button {
		color: rgb(254, 124, 98);
		background-color: #ffffff;
		transition: all 0.4s ease;
	}
	button:hover {
		background-color: rgb(247, 166, 149);
		color: #ffffff;
		font-size: medium;
	}
</style>
