<script>
	import Icon from '@iconify/svelte';
	const currentYear = new Date().getFullYear();
</script>

<link
	href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
	rel="stylesheet"
/>

<footer class="w-full bg-primary-400 p-6">
	<div class="lg:w-10/12 mx-auto w-10/12">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mt-4">
			<div class="flex flex-col items-center md:items-start text-center md:text-left">
				<a href="/" aria-label="Go to homepage" class="text-2xl font-bold text-gray-50">
					Chemikart
				</a>
				<div class="mt-2 text-sm text-gray-50">
					No. 206, Vinni Arcade 100<br />
					Feet Ring Road, Kathriguppe<br />
					Main Rd, Bengaluru,<br />
					Karnataka 560085
				</div>
				<div class="mt-4">
					<h3 class="font-bold text-lg text-gray-50">Follow us</h3>
					<div class="my-2 flex justify-center space-x-4">
						<a
							href="https://facebook.com/chemikart"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded-full hover:bg-primary-300 hover:text-gray-50"
							aria-label="Follow us on Facebook"
						>
							<Icon icon="ri:facebook-fill" width="1.2em" height="1.2em" />
						</a>
						<a
							href="https://twitter.com/chemikart"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded-full hover:bg-primary-300 hover:text-gray-50"
							aria-label="Follow us on Twitter"
						>
							<Icon icon="ri:twitter-x-fill" width="1.2em" height="1.2em" />
						</a>
						<a
							href="https://instagram.com/chemikart"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded-full hover:bg-primary-300 hover:text-gray-50"
							aria-label="Follow us on Instagram"
						>
							<Icon icon="typcn:social-instagram" width="1.2em" height="1.2em" />
						</a>
						<a
							href="https://linkedin.com/chemikart"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center p-2 bg-gray-50 text-primary-400 rounded-full hover:bg-primary-300 hover:text-gray-50"
							aria-label="Follow us on LinkedIn"
						>
							<Icon icon="ant-design:linkedin-outlined" width="1.2em" height="1.2em" />
						</a>
					</div>
				</div>
			</div>

			<div class="flex flex-col items-center md:items-start text-center md:text-left">
				<h3 class="font-bold text-lg text-gray-50">Information</h3>
				<ul class="mt-2 space-y-2 text-sm text-gray-50">
					<li><a href="/about-us" class="hover:underline">About Us</a></li>
					<li><a href="/sitemap" class="hover:underline">Site Map</a></li>
				</ul>
			</div>

			<div class="flex flex-col items-center md:items-start text-center md:text-left">
				<h3 class="font-bold text-lg text-gray-50">Help & Support</h3>
				<ul class="mt-2 space-y-2 text-sm text-gray-50">
					<li><a href="/contact-us" class="hover:underline">Contact Us</a></li>
					<li><a href="/customer-support" class="hover:underline">Customer Support</a></li>
					<li><a href="/faq" class="hover:underline">FAQs</a></li>
				</ul>
			</div>

			<div class="flex flex-col items-center md:items-start text-center md:text-left lg:mr-12">
				<h3 class="font-bold text-lg text-gray-50">Orders</h3>
				<ul class="mt-2 space-y-2 text-sm text-gray-50">
					<li><a href="/ecom-solutions" class="hover:underline">Chemikart Solutions</a></li>
					<li><a href="/quick-order" class="hover:underline">Quick Order</a></li>
					<li><a href="/quotes" class="hover:underline">Quotes</a></li>

				</ul>
			</div>
		</div>
	</div>
	<div class="md:w-10/12 mx-auto w-full mt-4">
		<hr class="border-gray-50 mb-4" />
		<div
			class="flex flex-col md:flex-row justify-center md:justify-between items-center text-gray-50"
		>
			<p class="text-xs text-center font-medium">
				&copy; {currentYear} Chemikart. All Rights Reserved.
			</p>
			<div
				class="flex flex-col md:flex-row items-center gap-0 md:gap-4 lg:gap-6 mt-2 md:mt-0 space-y-1 md:space-y-0"
			>
				<a href="/cookies-settings" class="hover:underline text-xs font-medium">Cookies Settings</a>
				<span class="hidden md:block lg:inline-block footer-separator">|</span>
				<a href="/terms" class="hover:underline text-xs font-medium">Privacy Notice</a>
				<span class="hidden md:block lg:inline-block footer-separator">|</span>
				<a href="/terms" class="hover:underline text-xs font-medium">Terms & Conditions</a>
			</div>
		</div>
	</div>
</footer>
