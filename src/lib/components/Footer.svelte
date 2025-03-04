<script>
	import Icon from '@iconify/svelte';
	import CookiesPopup from "$lib/components/CookiesPopup.svelte";
	import Scroller from '$lib/components/Scroller.svelte';
	import Helpsection from '$lib/components/Helpsection.svelte';
	import Helpsection1 from '$lib/components/Helpsection1.svelte';
	import Helpsection2 from '$lib/components/Helpsection2.svelte';
	import { page } from '$app/stores';
	let currentUrl;
	$: {
  currentUrl = $page.url.pathname;
//   console.log("currentUrl",currentUrl);
}

	let isPopupOpen = false;

	const togglePopup = (event) => {
		event.preventDefault();  
		isPopupOpen = !isPopupOpen; 
	};

	const closePopup = () => {
		isPopupOpen = false;
	};

	const currentYear = new Date().getFullYear();
	let footer;
</script>
{#if currentUrl !== "/feedback"}
<Helpsection1 />
<Helpsection2 />
{/if}
<footer class="w-full bg-primary-400 p-6 font-workSans" bind:this={footer}>
	{#if currentUrl !== "/feedback" && currentUrl !== "/order-status"}
	<Helpsection {footer} />
	{/if}

	<div class="mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-4 w-11/12 mx-auto max-w-7xl">
			<div class="md:block hidden">
			<div class="flex flex-col items-center md:items-start text-center md:text-left">
				<a href="/" aria-label="Go to homepage" class="text-white font-bold sm:text-xl text-lg uppercase">
					Chemikart
				</a>
				<div class="mt-2 font-medium sm:text-sm text-xs text-gray-50">
					No. 206, Vinni Arcade 100<br />
					Feet Ring Road, Kathriguppe<br /> 
					Main Rd, Bengaluru,<br />
					Karnataka 560085
				</div>
				<div class="mt-4">
					<p class="text-white font-semibold sm:text-md text-sm uppercase">Follow us</p>
					<div class="my-2 flex justify-center space-x-4">
						<a
							href="https://facebook.com/chemikart"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded hover:bg-primary-300 hover:text-gray-50"
							aria-label="Follow us on Facebook">
							<Icon icon="ri:facebook-fill" width="1.2em" height="1.2em" />
						</a>
						<a
							href="https://twitter.com/chemikart"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded hover:bg-primary-300 hover:text-gray-50"
							aria-label="Follow us on Twitter">
							<Icon icon="ri:twitter-x-fill" width="1.2em" height="1.2em" />
						</a>
						<a
							href="https://instagram.com/chemikart"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded hover:bg-primary-300 hover:text-gray-50"
							aria-label="Follow us on Instagram">
							<Icon icon="typcn:social-instagram" width="1.2em" height="1.2em" />
						</a>
						<a
							href="https://linkedin.com/chemikart"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded hover:bg-primary-300 hover:text-gray-50"
							aria-label="Follow us on LinkedIn">
							<Icon icon="ant-design:linkedin-outlined" width="1.2em" height="1.2em" />
						</a>
					</div>
				</div>
			</div>
		</div>
			<div class="flex flex-col items-center md:items-start text-center md:text-left">
				<p class="text-white font-semibold sm:text-lg text-md uppercase">Information</p>
				<ul class="mt-2 space-y-2 text-sm text-gray-50">
					<li><a href="/about-us" class="font-medium sm:text-sm text-xs hover:underline">About Us</a></li>
					<li><a href="/sitemap" class="font-medium sm:text-sm text-xs hover:underline">Site Map</a></li>
					<li><a href="/copy-consent" class="font-medium sm:text-sm text-xs hover:underline">Copyright Consent</a></li>
				</ul>
			</div>
			<div class="flex flex-col items-center md:items-start text-center md:text-left">
				<p class="text-white font-semibold sm:text-lg text-md uppercase">Help & Support</p>
				<ul class="mt-2 space-y-2 text-sm text-gray-50">
					<li><a href="/contact-us" class="font-medium sm:text-sm text-xs hover:underline">Contact Us</a></li>
					<li><a href="/help-support" class="font-medium sm:text-sm text-xs hover:underline">Customer Support</a></li>
					<li><a href="/faq" class="font-medium sm:text-sm text-xs hover:underline">FAQs</a></li>
				</ul>
			</div>
			<div class="flex flex-col items-center md:items-start text-center md:text-left lg:mr-12">
				<p class="text-white font-semibold sm:text-lg text-md uppercase">Orders</p>
				<ul class="mt-2 space-y-2 text-sm text-gray-50">
					<li><a href="/ecom-solutions" class="font-medium sm:text-sm text-xs hover:underline">Chemikart Solutions</a></li>
					<li><a href="/quick-order" class="font-medium sm:text-sm text-xs hover:underline">Quick Order</a></li>
					<li><a href="/quotes" class="font-medium sm:text-sm text-xs hover:underline">Quotes</a></li>
					<li><a href="/returns" class="font-medium sm:text-sm text-xs hover:underline">Returns & its Status</a></li>
				</ul>
				<div class="sm:hidden block">
					<Scroller />
				</div>
			</div>
			<div class="md:hidden block">
				<div class="flex flex-col items-center md:items-start text-center md:text-left">
					<a href="/" aria-label="Go to homepage" class="text-white font-bold sm:text-xl text-lg uppercase">
						Chemikart
					</a>
					<div class="mt-2 font-medium sm:text-sm text-xs text-gray-50">
						No. 206, Vinni Arcade 100<br />
						Feet Ring Road, Kathriguppe<br /> 
						Main Rd, Bengaluru,<br />
						Karnataka 560085
					</div>
					<div class="mt-4">
						<p class="text-white font-semibold sm:text-md text-sm uppercase">Follow us</p>
						<div class="my-2 flex justify-center space-x-4">
							<a
								href="https://facebook.com/chemikart"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded hover:bg-primary-300 hover:text-gray-50"
								aria-label="Follow us on Facebook">
								<Icon icon="ri:facebook-fill" width="1.2em" height="1.2em" />
							</a>
							<a
								href="https://twitter.com/chemikart"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded hover:bg-primary-300 hover:text-gray-50"
								aria-label="Follow us on Twitter">
								<Icon icon="ri:twitter-x-fill" width="1.2em" height="1.2em" />
							</a>
							<a
								href="https://instagram.com/chemikart"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded hover:bg-primary-300 hover:text-gray-50"
								aria-label="Follow us on Instagram">
								<Icon icon="typcn:social-instagram" width="1.2em" height="1.2em" />
							</a>
							<a
								href="https://linkedin.com/chemikart"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded hover:bg-primary-300 hover:text-gray-50"
								aria-label="Follow us on LinkedIn">
								<Icon icon="ant-design:linkedin-outlined" width="1.2em" height="1.2em" />
							</a>
						</div>
					</div>
				</div>
				<!-- <Scroller /> -->
			</div>
			

			
		</div>
		<div class="w-full">
			<hr class="border-gray-50 m-4 border-1" />
			<div
				class="flex flex-col md:flex-row justify-center md:justify-between items-center text-gray-50 mx-auto w-11/12 mt-4 max-w-7xl">
				<p class="text-xs text-start font-medium">
					&copy; {currentYear} Chemikart. <span class="md:block lg:inline">All Rights Reserved.</span>
				</p>
				<div class="flex flex-col md:flex-row items-center gap-0 md:gap-4 lg:gap-6 mt-2 md:mt-0 space-y-1 md:space-y-0">
					<a href="/" class="hover:text-primary-100 transition-colors duration-200 font-medium sm:text-sm text-xs" on:click={togglePopup}>Cookies Settings</a>
					<span class="hidden md:block lg:inline-block footer-separator">|</span>
					<a href="/terms/privacy-notice" class="hover:text-primary-100 transition-colors duration-200 font-medium sm:text-sm text-xs">Privacy Notice</a>
					<span class="hidden md:block lg:inline-block footer-separator">|</span>
					<a href="/safety" class="hover:text-primary-100 transition-colors duration-200 font-medium sm:text-sm text-xs">Product Safety</a>
					<span class="hidden md:block lg:inline-block footer-separator">|</span>
					<a href="/terms/site-and-terms" class="hover:text-primary-100 transition-colors duration-200 font-medium sm:text-sm text-xs">Site-Terms</a>
					<!-- <span class="hidden md:block lg:inline-block footer-separator">|</span>
					<a href="/terms/conditions" class="hover:underline text-xs font-medium">General Terms and Conditions</a> -->
					
				</div>
			</div>
		</div>
	</div>	
	{#if isPopupOpen}
		<CookiesPopup isOpen={isPopupOpen} closePopup={closePopup} />
	{/if}
</footer>
