<script>
	import { onMount } from 'svelte';

	let currentIndex = 0;
	let logosPerSlide = 4; 
	const logos = [
		{ src: '/image/image-1.jpeg', brand: 'Supelco', id: '57560', name: 'Hybrid', category:'SPE Tube', price: '₹18,535.15', estimatedShipping: '26 October 2024', warehouse: 'Bangalore Non-Bonded Warehouse', volume: '2 mL, pk of 1 ea', sku: '575659-U' },
		{ src: '/image/image-1.jpeg', brand: 'Supelco', id: '57561', name: 'Supliclean', category:'SPE Tube', price: '₹15,000.00', estimatedShipping: '28 October 2024', warehouse: 'Delhi Warehouse', volume: '1 mL, pk of 1 ea', sku: '575660-U' },
		{ src: '/image/image-1.jpeg', brand: 'Supelco', id: '57562', name: ' ENVICarb', category:'SPF Tube', price: '₹20,250.00', estimatedShipping: '30 October 2024', warehouse: 'Mumbai Warehouse', volume: '5 mL, pk of 1 ea', sku: '575661-U' },
		{ src: '/image/image-1.jpeg', brand: 'Supelco', id: '57563', name: ' ENVICarbSP2', category:'SPE Tube', price: '₹12,300.00', estimatedShipping: '29 October 2024', warehouse: 'Bangalore Non-Bonded Warehouse', volume: '10 mL, pk of 1 ea', sku: '575662-U' },
		{ src: '/image/image-1.jpeg', brand: 'Supelco', id: '57564', name: 'SupliPSA', category:'Bulk Packing', price: '₹22,100.00', estimatedShipping: '1 November 2024', warehouse: 'Chennai Warehouse', volume: '20 mL, pk of 1 ea', sku: '575663-U' },
		{ src: '/image/image-1.jpeg', brand: 'Supelco', id: '57565', name: 'SupliSPE', category:'SPF Tube', price: '₹19,000.00', estimatedShipping: '5 November 2024', warehouse: 'Pune Warehouse', volume: '50 mL, pk of 1 ea', sku: '575664-U' }
	];

	const repeatedLogos = [...logos, ...logos];
	let totalSlides;

	let showModal = false;
	let selectedProduct = {};
	let quantity = 1;

	function updateLogosPerSlide() {
		if (window.innerWidth < 640) {
			logosPerSlide = 1;
		} else if (window.innerWidth < 768) {
			logosPerSlide = 2;
		} else {
			logosPerSlide = 4;
		}
		totalSlides = Math.ceil(repeatedLogos.length / logosPerSlide);
		currentIndex = Math.min(currentIndex, totalSlides - 1);
	}

	function prevSlide() {
		currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
	}

	function nextSlide() {
		currentIndex = (currentIndex + 1) % totalSlides;
	}

	function openModal(product) {
		selectedProduct = product;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function updateQuantity(event) {
		quantity = event.target.value;
	}

	onMount(() => {
		updateLogosPerSlide();
		window.addEventListener('resize', updateLogosPerSlide);
		return () => {
			window.removeEventListener('resize', updateLogosPerSlide);
		};
	});
</script>
<style>
	.carousel-slide {
		transition: transform 0.3s ease-in-out;
	}
</style>
<!-- Slider -->
<h2 class="font-bold text-orange-500 mt-4">Related Products</h2>
<div class="relative mt-1">
	<div class="overflow-hidden relative">
		<div
			class="flex transition-transform duration-300"
			style={`transform: translateX(-${(currentIndex * (100 / logosPerSlide))}%)`}
		>
			{#each Array(totalSlides).fill(0) as _, slideIndex}
				<div class="flex-shrink-0 w-full flex gap-4 p-2">
					{#each repeatedLogos.slice(slideIndex * logosPerSlide, (slideIndex + 1) * logosPerSlide) as { src, brand, id, name, category, price, estimatedShipping, warehouse, volume, sku }}
						<div class="flex-1 min-w-[200px] w-full sm:max-w-[calc(50%-16px)] lg:max-w-[calc(25%-16px)]">
							<div class="flex flex-col w-full bg-white rounded-lg shadow-lg overflow-hidden">
								<div class="flex items-center p-2">
									<img src={src} alt={name} class="w-20 h-20 object-contain" />
									<div class="ml-2 text-left flex-1">
										<p class="font-semibold">{brand}</p>
										<p class="text-gray-600 text-sm">{id}</p>
										<p class="text-gray-800">{name}</p>
										<p class="text-gray-800">{category}</p>
									</div>
								</div>
								<div class="flex justify-center">
									<button on:click={() => openModal({ src, brand, id, name, price, estimatedShipping, warehouse, volume, sku })} class="w-3/4 text-orange-500 py-1 rounded border border-orange-500 hover:underline">
										Price & Availability
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<button on:click={prevSlide} class="absolute top-1/2 left-4 transform -translate-y-1/2 text-orange-500 border border-orange-500 p-2 rounded-full bg-transparent hover:bg-orange-400 hover:text-white">‹‹</button>
	<button on:click={nextSlide} class="absolute top-1/2 right-4 transform -translate-y-1/2 text-orange-500 border border-orange-500 p-2 rounded-full bg-transparent hover:bg-orange-400 hover:text-white">››</button>

	<!-- Slide Indicator -->
	<div class="flex justify-center mt-4">
		<p class="text-sm text-gray-600 block md:hidden">
			Slide {currentIndex + 1} of {totalSlides}
		</p>
	</div>

	<div class="flex justify-center mt-2">
		{#each Array(totalSlides).fill(0) as _, slideIndex}
			<button on:click={() => (currentIndex = slideIndex)} class={`w-1.5 h-1.5 rounded-full mx-1 bg-gray-400 hover:bg-gray-600 ${currentIndex === slideIndex ? 'bg-gray-800' : ''}`}></button>
		{/each}
	</div>
</div>

<!-- Modal -->
<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 mt-12">
		<div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-full sm:max-w-lg lg:max-w-2xl w-full relative">
			<button class="absolute top-3 right-3 text-black text-2xl" on:click={closeModal} aria-label="Close">&times;</button>
			<div class="flex flex-col sm:flex-row">
				<img src={selectedProduct.src} alt={selectedProduct.name} class="w-28 h-28 mr-4 sm:mr-6 mb-4 sm:mb-0" />
				<div class="flex-1">
					<p class="text-gray-700 font-semibold">{selectedProduct.brand}</p>
					<h3 class="text-lg font-bold">{selectedProduct.name}</h3>
					<p class="text-gray-600">Volume: {selectedProduct.volume}</p>
					<p class="mt-4 text-sm text-gray-600 border bg-orange-100 p-2">
						<a href="/sign-in" class="text-orange-500 hover:underline">Sign In</a> to view organizational & contact pricing.
					</p>
					<p class="text-lg">SKU</p>
					<hr class="my-2 border-gray-300" />
					<span class="bg-gray-100 rounded-lg p-2 inline-block border border-orange-400">
						<p class="m-0">{selectedProduct.id}</p>
					</span>
					<p class="text-xl font-semibold text-black mt-3">Price: {selectedProduct.price}</p>
					<p class="text-gray-600">Estimated to ship on {selectedProduct.estimatedShipping} from <span class="font-medium">{selectedProduct.warehouse}</span></p>

					<form class="mt-4 flex items-center flex-wrap">
						<label for="quantity" class="block text-sm font-medium mr-2">Quantity:</label>
						<input type="number" id="quantity" value={quantity} min="1" on:input={updateQuantity} class="border border-gray-300 rounded-md shadow-sm p-2 w-20" />
						<button type="submit" class="ml-2 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition">Add to Cart</button>
					</form>

					<a href="/check-availability" class={`mt-2 ${quantity > 1 ? 'text-orange-500' : 'text-gray-500'} hover:underline`}>
						Check Availability
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

