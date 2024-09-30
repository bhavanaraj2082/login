<script>
	import Icon from '@iconify/svelte';
	import facebookIcon from '@iconify-icons/mdi/facebook';
	import twitterIcon from '@iconify-icons/mdi/twitter';
	import instagramIcon from '@iconify-icons/mdi/instagram';
	import { createEventDispatcher } from 'svelte';
	import { base } from '$app/paths';

	const dispatch = createEventDispatcher();
	let isOpen = false;

	const currentYear = new Date().getFullYear();

	

	const socialLinks = [
		{
			name: 'Facebook',
			icon: facebookIcon,
			href: 'https://facebook.com/chemikart'
		},
		{
			name: 'Twitter',
			icon: twitterIcon,
			href: 'https://twitter.com/chemikart'
		},
		{
			name: 'Instagram',
			icon: instagramIcon,
			href: 'https://instagram.com/chemikart'
		}
	];
</script>

<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700&display=swap" rel="stylesheet">

<div class="w-full bg-blue-500 p-6">
	<div class="lg:w-10/12 mx-auto">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-4">
			<div class="flex flex-col items-center sm:items-start text-center sm:text-left mr-8 lg:mr-12">
				<a href="{base}/" aria-label="Go to homepage" class="text-2xl font-bold text-white font-work-sans">
					Chemikart
				</a>
				<div class="mt-2 text-sm text-white font-work-sans"> 
					No. 206, Vinni Arcade 100<br />
					Feet Ring Road, Kathriguppe<br />
					Main Rd, Bengaluru,<br />
					Karnataka 560085
				</div>
				<div class="mt-4 hidden lg:flex justify-center space-x-4">
					{#each socialLinks as { name, icon, href }}
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center p-2 bg-white rounded-full shadow hover:bg-gray-100 transition transform duration-300 hover:scale-110 hover:shadow-xl hover:animate-pulse"
							aria-label={`Follow us on ${name}`}
						>
							<Icon icon={icon} class="w-6 h-6" style="color: #FE5939;" />
						</a>
					{/each}
				</div>
			</div>

			<div class="flex flex-col items-center sm:items-start text-center sm:text-left mr-8 lg:mr-12">
				<h3 class="font-bold text-lg text-white font-work-sans">About</h3>
				<ul class="mt-2 space-y-2 text-sm text-white font-work-sans"> 
					<li><a href="/how-it-works" class="hover:text-blue-300">How It Works</a></li>
					<li><a href="/featured" class="hover:text-blue-300">Featured</a></li>
					<li><a href="/partnership" class="hover:text-blue-300">Partnership</a></li>
					<li><a href="/businessrelation" class="hover:text-blue-300">Business Relation</a></li>
				</ul>
			</div>

			<div class="flex flex-col items-center sm:items-start text-center sm:text-left mr-8 lg:mr-12">
				<h3 class="font-bold text-lg text-white font-work-sans">Community</h3>
				<ul class="mt-2 space-y-2 text-sm text-white font-work-sans">
					<li><a href="/events" class="hover:text-blue-300">Events</a></li>
					<li><a href="/blog" class="hover:text-blue-300">Blog</a></li>
					<li><a href="/program" class="hover:text-blue-300">Program</a></li>
					<li><a href="/responsibility" class="hover:text-blue-300">Responsibility</a></li>
				</ul>
			</div>

			<div class="flex flex-col items-center sm:items-start text-center sm:text-left mr-8 lg:mr-12">
				<h3 class="font-bold text-lg text-white font-work-sans">Help & Support</h3>
				<ul class="mt-2 space-y-2 text-sm text-white font-work-sans"> 
					<li><a href="/contact" class="hover:text-blue-300 underline">Contact Us</a></li>
					<li><a href="/faqs" class="hover:text-blue-300 underline">FAQs</a></li>
					<li><a href="/delivery" class="hover:text-blue-300 underline">Delivery</a></li>
					<li><a href="/sitemap" class="hover:text-blue-300 underline">Site map</a></li>
				</ul>
			</div>
		</div>

		<div class="mt-4">
			<hr class="border-gray-300 mb-4" />
			<div class="flex flex-col sm:flex-row justify-center sm:justify-between items-center text-gray-200 font-work-sans">
				<p class="text-xs text-center">
					&copy; {currentYear} Chemikart. All Rights Reserved.
				</p>

				<div class="flex flex-col sm:flex-row items-center mt-2 sm:mt-0">
					<a href="/terms" class="hover:text-blue-300 text-xs transition-colors duration-200">Terms & Conditions</a>
					<span class="hidden md:block lg:inline-block footer-separator">|</span>
					<a href="/privacy-policy" class="hover:text-blue-300 text-xs transition-colors duration-200">Privacy Notice</a>
				</div>

				<div class="flex lg:hidden space-x-4 justify-center mt-2 sm:mt-0">
					{#each socialLinks as { name, icon, href }}
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center p-2 bg-white rounded-full shadow hover:bg-gray-100 transition transform duration-300 hover:scale-110 hover:shadow-xl hover:animate-pulse mx-1"
							aria-label={`Follow us on ${name}`}
						>
							<Icon icon={icon} class="w-6 h-6" style="color: #FE5939;" />
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
