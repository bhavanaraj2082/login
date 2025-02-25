<script>
	import SearchSection from '$lib/components/HeaderDropdownCart/SearchSection.svelte';
	import { goto } from '$app/navigation';
	export let data;
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	// console.log(data);
	let errorMessage = '';
	let isLoading = false;
	let successMessage = '';
	let emailSubmitted = '';
	
	let components, categories, subcategories, manufacturers;
	$: {
		components = data?.result?.components || [];
		categories = data?.result?.categories || [];
		subcategories = data?.result?.subcategories || [];
	}
	const redirectPage = () => {
		goto(`/products`);
	};
</script>

<section class="mx-auto pt-3">
	<div class="w-full p-5 space-y-6">
		{#if components?.length > 0 || categories?.length > 0 || subcategories?.length > 0 || manufacturers?.length > 0}
			<h3 class="text-2xl font-semibold mb-4">Matched Results</h3>
		{:else}
		{#if !emailSubmitted}
		<div class="lg:w-8/12 w-full mx-auto md:p-5 rounded-md text-center">
			<p class="text-lg mb-2 font-semibold text-heading">
				The product you're looking for is not currently in our database.
			</p>
			<p class="text-sm mb-4 text-heading">
				Please enter your Email, and we'll contact you when it's available.
			</p>

			<form
				method="POST"
				action="?/noresults"
				class="space-y-3 w-full md:w-8/12 mx-auto"
				use:enhance={() => {
					return async ({ result }) => {
						isLoading = false;
						if (result.data.status === 200) {
							successMessage = 'Thank you! We will contact you once the product is available.';
							errorMessage = '';
							emailSubmitted = true;
							setTimeout(() => {
								redirectPage();
							}, 2000);
						} else {
							errorMessage = 'Something went wrong. Please try again later.';
							successMessage = '';
							setTimeout(() => {
								redirectPage();
							}, 2000);
						}
					};
				}}
				on:submit={() => {
					isLoading = true;
				}}
			>
				<input type="text" hidden name="query" value={data?.result?.search} />

				<input
					type="email"
					name="email"
					placeholder="Enter your email"
					value={data?.token?.email ?? ''}
					class="p-2 w-full border rounded-md"
					required
				/>

				<button
					type="submit"
					class="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 flex justify-center items-center"
					disabled={isLoading}
				>
					{#if isLoading}
						<Icon icon="line-md:loading-alt-loop" class="w-4 h-4 mr-2 animate-spin" />
						<span>Submitting...</span>
					{:else}
						<span>Submit</span>
					{/if}
				</button>
			</form>
		</div>
	{/if}

	{#if emailSubmitted}
		{#if successMessage}
			<div class="mt-4 p-4 bg-green-100 text-green-800 border rounded">
				{successMessage}
			</div>
		{:else if errorMessage}
			<div class="mt-4 p-4 bg-red-100 text-red-800 border rounded">
				{errorMessage}
			</div>
		{/if}
	{/if}
		{/if}

		{#if components && components.length > 0}
			<h3 class="text-xl font-bold">Products</h3>
			<section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{#each components as item}
					<a href="/products/{item?.category?.urlName}/{item?.subCategory?.urlName}/{item?.productNumber}" class="block">
						<div
							class="flex gap-3 border rounded p-4 cursor-pointer hover:border-gray-400"
						>
							<img
								src={item?.imageSrc}
								class="w-20 h-20 object-cover rounded-md text-sm"
								alt={item?.productName}
							/>
							<div class="">
								<p class="text-sm font-medium">{item?.productName}</p>
								<p class="text-sm">{item?.productNumber}</p>
							</div>
						</div>
					</a>
				{/each}
			</section>
		{/if}

		<SearchSection
			title="Categories"
			items={categories}
			linkPrefix="/products/"
			isSubcategory={false}
		/>
		<SearchSection
			title="Sub Categories"
			items={subcategories}
			linkPrefix="/products/"
			isSubcategory={true}
		/>
	</div>
</section>
