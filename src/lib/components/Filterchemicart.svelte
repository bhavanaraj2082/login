<script>
	import { onMount } from "svelte";
	import Filterproducts from "../components/Fiterwidgets/Filterproducts.svelte";
	import Filterwidget from "../components/Fiterwidgets/Filterwidget.svelte";

	let products = [];
	let filteredProducts = [];
	let isFavorited = [];
	let currentQuantities = [];
	let currentPage = 0;
	const productsPerPage = 5;

	async function fetchProducts() {
		const response = await fetch("src/lib/data/Chemicaldata.json");
		if (response.ok) {
			products = await response.json();
			filteredProducts = [...products];
			isFavorited = Array(products.length).fill(false);
			currentQuantities = Array(products.length).fill(1);
		} else {
			console.error("Failed to fetch products:", response.status);
		}
	}

	onMount(() => {
		fetchProducts();
	});

	function toggleFavorite(index) {
		isFavorited[index] = !isFavorited[index];
	}

	function incrementQuantity(index) {
		currentQuantities[index]++;
	}

	function decrementQuantity(index) {
		if (currentQuantities[index] > 1) {
			currentQuantities[index]--;
		}
	}

	function filterProducts(filters) {
		return products.filter((product) => {
			const productTypeMatch =
				filters[0].size === 0 || filters[0].has(product.productType);
			const brandMatch =
				filters[1].size === 0 || filters[1].has(product.brand);
			const accreditationMatch =
				filters[2].size === 0 || filters[2].has(product.Accreditations);
			const formatMatch =
				filters[3].size === 0 || filters[3].has(product.format);
			const apiFamilyMatch =
				filters[4].length === 0 ||
				filters[4].includes(product.apiFamily);
			return (
				productTypeMatch &&
				brandMatch &&
				accreditationMatch &&
				formatMatch &&
				apiFamilyMatch
			);
		});
	}

	function handleFilterChange(event) {
		const filters = event.detail;
		filteredProducts = filterProducts(filters);
		currentPage = 0;
	}

	function nextPage() {
		if ((currentPage + 1) * productsPerPage < filteredProducts.length) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	$: paginatedProducts = filteredProducts.slice(
		currentPage * productsPerPage,
		(currentPage + 1) * productsPerPage,
	);
</script>

<div class="flex flex-col md:flex-row">
	<Filterwidget {products} on:filterChange={handleFilterChange} />

	<div class="flex-1 mt-4 md:mt-0">
		<Filterproducts
			{paginatedProducts}
			{isFavorited}
			{currentQuantities}
			{toggleFavorite}
			{incrementQuantity}
			{decrementQuantity}
		/>
	</div>
</div>

<div class="flex justify-center mt-4 mb-8">
	<button
		on:click={prevPage}
		disabled={currentPage === 0}
		class="bg-primary-400 text-white px-4 py-2 rounded-l">Previous</button
	>
	<span class="mx-2 pt-2">
		Page {currentPage + 1} of {Math.ceil(
			filteredProducts.length / productsPerPage,
		)}
	</span>
	<button
		on:click={nextPage}
		disabled={(currentPage + 1) * productsPerPage >=
			filteredProducts.length}
		class="bg-primary-400 text-white px-4 py-2 rounded-r">Next</button
	>
</div>
