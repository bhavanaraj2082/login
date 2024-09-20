<script>
	export let paginatedProducts = [];
	export let isFavorited = [];
	export let currentQuantities = [];
	export let toggleFavorite;
	export let incrementQuantity;
	export let decrementQuantity;
</script>

<div>
	{#if paginatedProducts.length > 0}
		{#each paginatedProducts as product, index}
			<div
				class="flex flex-col w-[90%] rounded-sm border shadow-md p-4 m-8"
			>
				<div class="flex flex-row-reverse pr-8 font-bold text-blue-500">
					{product.Accreditations}
				</div>

				<div class="text-lg font-bold mb-4 flex">
					<a href={product.link} class="text-blue-600 hover:underline"
						>{product.name}</a
					>
				</div>

				<div class="flex">
					<div class="w-44 h-44 mr-4">
						<img
							src={product.imageUrl}
							alt={product.code}
							class="w-full h-full object-cover rounded-lg border"
						/>
					</div>
					<div class="flex flex-col flex-grow justify-center gap-24">
						<div class="text-sm">
							{#each [{ label: "Product Code", value: product.code }, { label: "CAS Number", value: product.casNumber }, { label: "Brand", value: product.brand }, { label: "Product Type", value: product.productType }, { label: "Product Format", value: product.format }, { label: "API Family", value: product.apiFamily }] as { label, value }}
								<div class="mb-1">
									<span class="m-2">{label}:</span>
									<span class="font-semibold">{value}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
				<hr class="my-2 border-gray-300" />

				<div class="flex items-center justify-between space-x-2">
					<div class="flex flex-col">
						<div class="mb-1 font-semibold">{product.weight}</div>
					</div>
					<div class="flex flex-col">
						<div class="font-semibold">{product.code}</div>
						<div class="font-semibold text-green-800">
							{product.stock}
						</div>
					</div>

					<button
						on:click={() => toggleFavorite(index)}
						class="bg-transparent border-none p-0 mr-2"
						aria-label="Toggle favorite"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="2em"
							height="1.7em"
							viewBox="0 0 48 48"
							fill={isFavorited[index] ? "red" : "none"}
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
						>
							<path
								d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.99 10.99 0 0 0 15 8"
							/>
						</svg>
					</button>

					<div class="flex items-center space-x-1">
						<button
							on:click={() => decrementQuantity(index)}
							class="bg-gray-200 text-gray-600 font-bold hover:bg-gray-100 px-3 py-1 rounded"
							>-</button
						>
						<input
							type="text"
							class="w-10 h-8 text-center border rounded text-base"
							value={currentQuantities[index]}
							readonly
						/>
						<button
							on:click={() => incrementQuantity(index)}
							class="bg-gray-200 text-gray-600 hover:bg-gray-100 px-3 py-1 font-bold rounded"
							>+</button
						>
					</div>

					<div class="mt-2 mx-4 text-center text-base font-semibold">
						<a
							href="/US/en/login"
							class="text-blue-600 hover:underline">Login</a
						>
						<br />
						<a
							href="/US/en/login"
							class="text-blue-600 hover:underline">Register</a
						>
					</div>

					<div class="flex flex-col items-end mt-2">
						<button
							class="bg-blue-500 text-white p-2 rounded text-sm font-bold"
						>
							Add to Cart
						</button>
					</div>
				</div>
			</div>
		{/each}
	{:else}
		<p>No products found.</p>
	{/if}
</div>
