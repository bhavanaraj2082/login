<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { toast, Toaster } from 'svelte-sonner';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';
	import Icon from '@iconify/svelte';
	import Calender from '$lib/components/Calender.svelte';

	export let data;

	console.log("mycartdata====>",data)
	let cartItems = data?.userData?.cart?.filter((cart) => !cart.isDeleted) || [];
	// console.log("Initial cartItems:", cartItems);
	let isLoading = false;
	let calendarComponent;
	let newCartpopup = false;
	let isCreatingCart = false;

	let currentPage = writable(1);
	let itemsPerPage = writable(10);
	let showPopup = writable(false);
	let selectedCart = writable('null');
	const showDeletePopup = writable(false);
	const showSharePopup = writable(false);
	const shareUrl = writable('');

	let selectedCartId = null;
	let recureModal = false;
	let month = '';
	let custom = '';
	let error = '';
	let customError = '';
	let message = 'copy';
	let existingRecurrence = null;

	let filters = {
		searchTerm: '',
		dateFrom: '',
		dateTo: ''
	};

	const DOTS = '...';
	const VISIBLE_PAGES = 7;

	$: if (month) {
		error = '';
		customError = '';
	}

	$: sortedCartItems = cartItems.sort((a, b) => {
		const dateA = new Date(a.createdAt);
		const dateB = new Date(b.createdAt);
		return dateB - dateA;
	});

	$: if ($selectedCart && $selectedCart.cartId) {
		shareUrl.set(`{PUBLIC_WEBSITE_URL}/cart/${$selectedCart.cartId}`);
	}

	$: filteredCartItems = filterCarts(sortedCartItems, filters);
	$: totalPages = Math.ceil(filteredCartItems.length / $itemsPerPage);
	$: pageNumbers = getPageRange($currentPage, filteredCartItems.length);
	$: paginatedCartItems = getPaginatedData(filteredCartItems, $currentPage, $itemsPerPage);

	const formatRecurrenceDate = (dateString) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-IN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const formatRecurrenceType = (type) => {
		if (!type) return '';
		return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
	};

	function getEarliestCartDate(cartItems) {
		if (!cartItems || cartItems.length === 0) {
			return new Date('2024-01-01'); // Fallback date
		}

		const earliestDate = cartItems.reduce((earliest, current) => {
			const currentDate = new Date(current.createdAt);
			return !earliest || currentDate < earliest ? currentDate : earliest;
		}, null);

		if (earliestDate) {
			earliestDate.setHours(0, 0, 0, 0);
		}
		return earliestDate;
	}

	function filterCarts(items, filterCriteria) {
		return items.filter((cart) => {
			if (cart.isDeleted) {
				return false;
			}

			const searchTerm = filterCriteria.searchTerm.toLowerCase().trim();
			const matchesSearch =
				!searchTerm ||
				cart.cartId.toLowerCase().includes(searchTerm) ||
				cart.cartName.toLowerCase().includes(searchTerm);

			const createdDate = new Date(cart.createdAt);
			createdDate.setHours(0, 0, 0, 0);

			let matchesDateRange = true;

			if (filterCriteria.dateFrom) {
				const fromDate = new Date(filterCriteria.dateFrom);
				fromDate.setHours(0, 0, 0, 0);
				matchesDateRange = matchesDateRange && createdDate >= fromDate;
			}

			if (filterCriteria.dateTo) {
				const toDate = new Date(filterCriteria.dateTo);
				toDate.setHours(23, 59, 59, 999);
				matchesDateRange = matchesDateRange && createdDate <= toDate;
			}

			return matchesSearch && matchesDateRange;
		});
	}

	function handleDateChange(event) {
		const { dates, filters: eventFilters } = event.detail;

		updateFilters('dateFrom', dates.from);
		updateFilters('dateTo', dates.to);

		if (eventFilters.firstTimeOnly) {
			filteredCartItems = filterCarts(cartItems, {
				...filters,
				firstTimeOnly: true
			});
		}
	}

	function handleFilterChange(event) {
		const newFilters = event.detail;
		filteredCartItems = filterCarts(cartItems, {
			...filters,
			...newFilters
		});
	}

	function getPageRange(current, total) {
		const range = [];
		const totalPages = Math.ceil(total / $itemsPerPage);

		if (totalPages <= VISIBLE_PAGES) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}
		range.push(1);
		let start = Math.max(2, current - Math.floor(VISIBLE_PAGES / 2));
		let end = Math.min(totalPages - 1, start + VISIBLE_PAGES - 3);
		if (current > totalPages - 2) {
			start = totalPages - VISIBLE_PAGES + 1;
			end = totalPages - 1;
		}
		if (current <= 2) {
			start = 2;
			end = Math.min(VISIBLE_PAGES - 1, totalPages - 1);
		}
		if (start > 2) {
			range.push(DOTS);
		}
		for (let i = start; i <= end; i++) {
			range.push(i);
		}
		if (end < totalPages - 1) {
			range.push(DOTS);
		}
		if (totalPages > 1) {
			range.push(totalPages);
		}
		return range;
	}

	function getPaginatedData(items, currentPageNum, itemsPerPageNum) {
		const startIndex = (currentPageNum - 1) * itemsPerPageNum;
		const endIndex = startIndex + itemsPerPageNum;
		return items.slice(startIndex, endIndex);
	}

	function handlePageChange(page) {
		if (page >= 1 && page <= totalPages && page !== $currentPage) {
			currentPage.set(page);
		}
	}

	function handleKeyDown(event) {
		if (event.key === 'ArrowLeft' && $currentPage > 1) {
			handlePageChange($currentPage - 1);
		} else if (event.key === 'ArrowRight' && $currentPage < totalPages) {
			handlePageChange($currentPage + 1);
		}
	}

	const openPopup = (cart) => {
		const transformedCart = {
			...cart,
			_id: cart._id,
			cartId: cart.cartId,
			cartName: cart.cartName,
			cartItems: cart.cartItems.map((item) => ({
				_id: item.componentId?._id,
				quantity: item.quantity,
				component: {
					productName: item.componentId?.productName || 'Unknown Product',
					manufacturerName: item.componentId?.manufacturerName || 'Unknown Manufacturer',
					description: item.componentId?.description || 'No description found'
				},
				reference: {
					referenceNumber: item.customerReference?.referenceNumber || ''
				}
			}))
		};

		selectedCart.set(transformedCart);
		showPopup.set(true);
	};

	const updateFilters = (key, value) => {
		if (!value) {
			filters[key] = '';
			currentPage.set(1);
			return;
		}

		if (key === 'dateFrom' && filters.dateTo) {
			const fromDate = new Date(value);
			const toDate = new Date(filters.dateTo);
			if (fromDate > toDate) {
				toast.error('From date cannot be later than To date');
				return;
			}
		}

		if (key === 'dateTo' && filters.dateFrom) {
			const fromDate = new Date(filters.dateFrom);
			const toDate = new Date(value);
			if (toDate < fromDate) {
				toast.error('To date cannot be earlier than From date');
				return;
			}
		}

		filters[key] = value;
		currentPage.set(1);
	};

	const handleSearch = (event) => {
		const searchValue = event.target.value.trim() || '';
		filters.searchTerm = searchValue;
		currentPage.set(1);
	};

	function formatDate(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString);
		const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
		return date.toLocaleDateString('en-IN', options);
	}

	const closePopup = () => {
		showPopup.set(false);
		selectedCart.set(null);
	};

	const handleRecurrenceClick = (cart) => {
		selectedCartId = cart._id;
		existingRecurrence = cart.recurrence || null;

		if (existingRecurrence) {
			if (existingRecurrence.recurring.includes('Months')) {
				month = 'Custom';
				custom = existingRecurrence.recurring;
			} else {
				month = existingRecurrence.recurring;
				custom = '';
			}
		} else {
			month = '';
			custom = '';
		}

		recureModal = true;
		error = '';
		customError = '';
		message = '';
	};

	const toggleRecurrencePopup = () => {
		recureModal = !recureModal;
		if (!recureModal) {
			month = '';
			custom = '';
			error = '';
			customError = '';
			message = '';
		}
	};

	const handleRecurrenceSubmit = ({ cancel }) => {
		if (!month) {
			error = 'Please select the Recurrence period';
			cancel();
			return;
		}

		if (month === 'Custom' && !custom) {
			customError = 'Please select the custom interval';
			cancel();
			return;
		}
		isLoading = true;
		return async ({ result }) => {
			try {
				if (result.type === 'success') {
					const updatedRecurrence = result.data.data;
					cartItems = cartItems.map((cart) => {
						if (cart._id === selectedCartId) {
							return {
								...cart,
								recurrence: updatedRecurrence
							};
						}
						return cart;
					});

					toast.success(result.data?.msg || 'Recurrence set successfully');
					toggleRecurrencePopup();
					// location.reload()
				} else {
					// toast.error(result.data?.msg || 'Failed to set recurrence');
					toast.success(result.data?.msg || 'Recurrence set successfully');
					toggleRecurrencePopup();
					location.reload();
				}
			} catch (err) {
				console.error('Error handling recurrence submit:', err);
				toast.error('An error occurred');
			}
		};
	};

	const handleResumeCart = () => {
		isLoading = true;
		closePopup();

		return async ({ result }) => {
			// console.log("result",result);
			try {
				if (result.type === 'success' || result.success) {
					toast.success('Cart resumed successfully');
					if ($selectedCart) {
						$selectedCart.isActiveCart = true;
					}
					goto('/cart');
				} else {
					toast.error(result.message || 'Failed to resume cart');
					console.error('Resume cart error:', result);
				}
			} catch (error) {
				console.error('Error handling resume cart:', error);
				toast.error('An error occurred while resuming the cart');
			} finally {
				isLoading = false;
			}
		};
	};

	function handleDelete(cartId) {
		showPopup.set(false);
		selectedCartId = cartId;
		showDeletePopup.set(true);
	}

	function cancelDelete() {
		showDeletePopup.set(false);
		selectedCartId = null;
	}

	const handleDeleteCart = () => {
		return async ({ result }) => {
			try {
				isLoading = true;
				if (result.success) {
					showDeletePopup.set(false);
					cartItems = cartItems.filter((cart) =>
						cart._id === selectedCartId ? { ...cart, isDeleted: true } : cart
					);
					selectedCartId = null;
					toast.success('Cart deleted successfully');
				} else {
					location.reload();
					showDeletePopup.set(false);
					toast.success('Cart deleted successfully');
				}
			} catch (error) {
				showDeletePopup.set(false);
				console.error('Error deleting cart:', error);
				toast.error('An error occurred while deleting the cart');
			}
		};
	};

	let isEditing = false;
	let newCartName = '';
	let originalCartName = '';
	let hasChanges = false;

	$: canSave = newCartName.trim() !== '' && newCartName !== originalCartName && !isLoading;

	const startEditing = () => {
		originalCartName = $selectedCart?.cartName || '';
		newCartName = originalCartName;
		isEditing = true;
		hasChanges = false;
	};

	const cancelEditing = () => {
		isEditing = false;
		newCartName = '';
		originalCartName = '';
		hasChanges = false;
	};

	const handleNameChange = (event) => {
		newCartName = event.target.value;
		hasChanges = newCartName.trim() !== originalCartName;
	};

	const handleEditCart = () => {
		return async ({ result }) => {
			try {
				isLoading = true;

				if (result.type === 'success') {
					const updatedName = result.data.cartName;

					selectedCart.update((cart) => ({
						...cart,
						cartName: updatedName
					}));

					cartItems = cartItems.map((cart) =>
						cart._id === $selectedCart._id ? { ...cart, cartName: updatedName } : cart
					);

					toast.success('Cart name updated successfully');
					// location.reload()
					isEditing = false;
				} else {
					// toast.success('Cart name updated successfully');
					toast.error(result.error || 'Failed to update cart name');
					isEditing = false;
				}
			} catch (error) {
				console.error('Error updating cart name:', error);
				location.reload();
				toast.error('An error occurred while updating the cart name');
			} finally {
				isLoading = false;
				hasChanges = false;
			}
		};
	};

	const handleShareCart = (cartId) => {
		try {
			if (!cartId) {
				toast.error('No cart selected');
				return;
			}

			if (!$selectedCart.cartItems.length) {
				toast.error('Cannot share an empty cart');
				return;
			}

			shareUrl.set(`${PUBLIC_WEBSITE_URL}/cart/${cartId}`);
			showSharePopup.set(true);
			showPopup.set(false);
		} catch (error) {
			console.error('Error sharing cart:', error);
			toast.error('Failed to generate share link');
		}
	};

	const copyShareLink = async () => {
		try {
			await navigator.clipboard.writeText($shareUrl);
			message = 'Copied !';
			toast.success('Share link copied to clipboard!');
			setTimeout(() => {
				message = 'Copy';
				showSharePopup.set(false);
			}, 1200);
		} catch (err) {
			console.error('Copy failed:', err);
			toast.error('Failed to copy link');
		}
	};

	const closeSharePopup = () => {
		showSharePopup.set(false);
		shareUrl.set('');
		message = 'Copy';
	};

	function clearSearch() {
		filters = {
			searchTerm: ''
		};
	}

	function handleNewCart() {
		newCartpopup = true;
		newCartName = '';
	}

	function cancelNewCart() {
		newCartpopup = false;
		newCartName = '';
	}

	function generateCartId() {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < 8; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return result;
	}

	const handleCreateCart = () => {
		isCreatingCart = true;

		return async ({ result }) => {
			try {
				if (result.type === 'success') {
					toast.success('Cart created successfully');
				} else {
					toast.success('Cart created successfully');
					// toast.error(result.error || 'Failed to create cart');
					goto('/cart');
				}
			} catch (error) {
				console.error('Error creating cart:', error);
				toast.error('An error occurred while creating the cart');
			} finally {
				isCreatingCart = false;
				newCartpopup = false;
			}
		};
	};

	onMount(() => {
		const earliestDate = getEarliestCartDate(cartItems);
	});
</script>

<section class="w-full lg:w-11/12 mx-auto max-w-7xl p-4">
	<div class="flex flex-col justify-between items-center">
		<h1 class="text-2xl font-bold mb-6 text-left w-full">My Cart</h1>
		{#if !cartItems.length}
			<a href="/products" class="w-full">
				<div
					class="border-l-8 border-yellow-500 h-40 flex flex-col items-center justify-center text-yellow-700 p-6 mb-6 rounded-xl shadow hover:bg-yellow-50 transition-all duration-300">
					<div class="flex flex-col items-center text-center">
						<Icon icon="bx:cart-download" class="text-4xl mb-4" />
						<p class="font-semibold text-xs md:text-xl text-yellow-700 hover:text-yellow-800">
							No items in cart
						</p>
					</div>
				</div>
			</a>
		{/if}
	</div>
	{#if cartItems.length}
		<div class="flex flex-col lg:flex-row lg:gap-6 gap-4 mb-6 w-full">
			<!-- <div class="flex flex-col gap-4 mb-6"> -->
			<div class="w-full relative">
				<Icon icon="ri:search-line" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20"/>
				<input type="text" placeholder="Search by Cart Name" class="w-full h-10 border border-gray-400 focus:ring-0 focus:border-primary-500 rounded px-4 py-2 pl-10 text-sm outline-none transition-all duration-200" value={filters.searchTerm} on:input={handleSearch}/>
				{#if filters.searchTerm}
					<button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded" style="color: #cb1919" on:click={clearSearch}>
						<Icon icon="oui:cross" width="16" height="16" class="font-bold" />
					</button>
				{/if}
			</div>
			<div class="flex flex-col lg:flex-row w-full lg:w-2/3 sm:flex-row gap-2 lg:items-center">
				<div class="relative w-full">
					<Calender
						bind:this={calendarComponent}
						minDate={getEarliestCartDate(cartItems)}
						on:dateChange={handleDateChange}
						on:filterChange={handleFilterChange}
						initialFilters={{
							firstTimeOnly: false,
							dateRange: 'custom'
						}}/>
				</div>
			</div>
			<div class="w-full lg:max-w-xs flex md:max-w-xs items-start lg:items-center">
				<button
					class="w-full lg:w-auto h-10 bg-primary-500 text-white hover:bg-primary-700 flex items-center justify-center px-4 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm gap-2"
					on:click={handleNewCart}>
					<Icon icon="mdi:add-shopping-cart" width="20" height="20" />
					<span>Create New Cart</span>
				</button>
			</div>
		</div>
		<div class="grid md:grid-cols-2 lg:hidden gap-4">
			{#if !paginatedCartItems.length}
				<div class="w-full md:w-full border rounded border-yellow-400 items-center px-4 py-8 md:col-span-2">
					<p class="text-center text-gray-500">No items found</p>
				</div>
			{:else}
				{#each paginatedCartItems as cart}
					<div class="border rounded shadow-sm p-4 bg-white">
						<div class="flex justify-between items-start mb-4">
							<div class="">
								<span class="flex items-center my-1.5 gap-1">
									{#if cart.isActiveCart}
										<Icon icon="mdi:check-circle" class="text-green-500" />
										<span class="text-xs font-medium text-gray-800">Active</span>
									{:else}
										<Icon icon="mdi:cancel-circle" class="text-red-400" />
										<span class="text-xs font-medium text-gray-400">Inactive</span>
									{/if}
								</span>
								<h3 class="text-heading">
									CartName:
									<strong class="text-sm">
										{cart.cartName || 'Unnamed Cart'}
									</strong>
								</h3>
							</div>
							<p class="text-xs text-description mt-1">Date:{formatDate(cart.createdAt)}</p>
						</div>
						<div class="flex justify-between gap-2 mb-4">
							<div>
								<p class="text-xs text-gray-500">Items</p>
								<p class="font-semibold">{cart.cartItems.length || 0}</p>
							</div>
							<div>
								<p class="text-xs flex items-end justify-end text-gray-500">Recurrence</p>
								{#if cart.recurrence}
									<div class="flex flex-col items-end">
										<span class="text-description font-semibold text-sm">
											{formatRecurrenceType(cart.recurrence.recurring)}
										</span>
										<span class="text-2s text-gray-500">
											Next: {formatRecurrenceDate(cart.recurrence.recurringDate)}
										</span>
									</div>
								{:else}
									<span class="text-gray-400">Not set</span>
								{/if}
							</div>
						</div>
						<div class="flex justify-center space-x-2">
							<button
								class="flex-1 border border-primary-500 text-primary-500 hover:text-white px-1 py-2 text-xs rounded hover:bg-primary-600 flex items-center justify-center"
								type="button"
								disabled={isLoading}
								on:click={() => openPopup(cart)}>
								<Icon icon={isLoading ? 'mdi:loading' : 'hugeicons:file-view'} class={`text-xl ${isLoading ? 'animate-spin' : ''}`}/>
								View
							</button>
							<button
								class="flex-1 border border-green-500 text-green-500 px-1 py-2 text-xs rounded hover:bg-green-600 hover:text-white flex items-center justify-center whitespace-nowrap"
								type="button"
								disabled={isLoading}
								on:click={() => handleRecurrenceClick(cart)}>
								<Icon icon={isLoading ? 'mdi:loading' : 'mdi:refresh'} class={`text-xl ${isLoading ? 'animate-spin' : ''}`}/>
								Recurrence
							</button>
							<button
								class="flex-1 border border-red-600 text-red-600 hover:text-white px-1 py-2 rounded text-xs hover:bg-red-700 flex items-center justify-center whitespace-nowrap"
								type="button"
								disabled={isLoading}
								on:click={() => handleDelete(cart._id)}>
								<Icon icon={isLoading ? 'mdi:loading' : 'mdi:delete'} class={`text-xl ${isLoading ? 'animate-spin' : ''}`}/>
								Delete
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>
		<div class="hide rounded bg-white hidden lg:block">
			<table class="w-full border-collapse overflow-x-auto hide">
				<thead class="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
					<tr>
						<th class="px-4 py-2 text-sm text-center font-semibold">Date</th>
						<!--<th class="px-4 py-2 text-sm text-center font-semibold">Cart ID</th> -->
						<th class="px-4 py-2 text-sm text-center font-semibold">Items in cart</th>
						<th class="px-4 py-2 text-sm text-center font-semibold">Cart Name</th>
						<th class="px-4 py-2 text-sm text-center font-semibold">Recurrence</th>
						<th class="px-4 py-2 text-sm text-center font-semibold">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#if !paginatedCartItems.length}
						<tr>
							<td colspan="5" class="border px-4 py-8 text-center text-gray-500">
								No items found
							</td>
						</tr>
					{:else}
						{#each paginatedCartItems as cart}
							<tr class="hover:bg-primary-50">
								<td class="border-b px-4 py-2 text-center relative">
									<div class="absolute top-0 left-0 text-xs px-3 py-1 rounded-br-lg shadow-md">
										<span class="flex items-center gap-1">
											{#if cart.isActiveCart}
												<Icon icon="mdi:check-circle" class="text-green-500" />
												<span class="text-xs font-medium text-gray-800">Active</span>
											{:else}
												<Icon icon="mdi:cancel-circle" class="text-red-400" />
												<span class="text-xs font-medium text-gray-400">Inactive</span>
											{/if}
										</span>
									</div>
									<span class="block mt-4 text-md font-medium text-gray-600">
										{formatDate(cart.createdAt)}
									</span>
								</td>
								<!-- <td class="border px-4 py-1 text-center">
                  {cart.cartId || 'N/A'}</td> -->
								<td class="border-b text-center">
									<span class="inline-flex items-center justify-center px-4 py-2 bg-primary-100 text-primary-800 rounded" style="width: 40px; text-align: center; line-height: 1.2;">
										{cart.cartItems.length || 0}
									</span>
								</td>
								<td class="border-b px-4 py-1 text-center max-w-[150px] truncate">{cart.cartName || 'N/A'}</td>
								<td class="border-b px-4 py-1 text-center">
									{#if cart.recurrence}
										<div class="flex flex-col items-center">
											<span class="text-sm font-semibold text-heading">
												{formatRecurrenceType(cart.recurrence.recurring)}
											</span>
											<span class="text-xs text-description">
												Next: {formatRecurrenceDate(cart.recurrence.recurringDate)}
											</span>
										</div>
									{:else}
										<span class="text-gray-400">Not set</span>
									{/if}
								</td>
								<td class="border-b text-center px-1 py-4 flex justify-center gap-1">
									<button
										type="button"
										disabled={isLoading}
										on:click={() => openPopup(cart)}
										class="px-2 py-1 border text-primary-600 hover:text-white rounded hover:bg-primary-700 transition-all duration-300 flex items-center gap-1 relative group">
										<span class="relative">
											<Icon icon={isLoading ? 'mdi:loading' : 'hugeicons:file-view'} class={`text-xl ${isLoading ? 'animate-spin' : ''}`}/>
											<span class="absolute left-1/2 transform -translate-x-1/2 z-50 whitespace-nowrap top-full mt-2 px-2 bg-gray-200 text-gray-600 text-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
												View Cart
											</span>
										</span>
									</button>
									<span class="text-gray-400 px-2">|</span>
									<button
										type="button"
										disabled={isLoading}
										on:click={() => handleRecurrenceClick(cart)}
										class="px-2 py-1 border text-green-600 hover:text-white rounded hover:bg-green-700 transition-all duration-300 flex items-center gap-1 relative group">
										<span class="relative">
											<Icon icon={isLoading ? 'mdi:loading' : 'mdi:refresh'} class={`text-xl ${isLoading ? 'animate-spin' : ''}`}/>
											<span class="absolute left-1/2 transform -translate-x-1/2 z-auto whitespace-nowrap top-full mt-2 px-2 bg-gray-200 text-gray-600 text-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
												Update Recurrence
											</span>
										</span>
									</button>
									<span class="text-gray-400 px-2">|</span>
									<button
										type="button"
										disabled={isLoading}
										on:click={() => handleDelete(cart._id)}
										class="px-2 py-1 border text-red-600 rounded hover:bg-red-700 hover:text-white transition-all duration-300 flex items-center gap-1 relative group">
										<span class="relative">
											<Icon icon={isLoading ? 'mdi:loading' : 'mdi:delete'} class={`text-xl ${isLoading ? 'animate-spin' : ''}`}/>
											<span class="absolute left-1/2 transform -translate-x-1/2 z-auto whitespace-nowrap top-full mt-2 px-2 bg-gray-200 text-gray-600 text-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
												Delete
											</span>
										</span>
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-around border bg-white shadow-sm px-4 py-4 rounded-b-md md:mt-1 my-1 md:m-0"
			aria-label="pagination"
			on:keydown={handleKeyDown}>
			<!-- <p class="text-sm text-gray-700">
      Page <span class="font-semibold">{$currentPage}</span> of
      <span class="font-semibold">{totalPages}</span>
    </p> -->
			<div class="flex items-center justify-center gap-2 flex-wrap">
				<button
					class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
					on:click={() => handlePageChange(1)}
					disabled={$currentPage === 1}
					aria-label="First page">
					<Icon icon="charm:chevrons-left" class="w-4 h-4" />
				</button>
				<button
					class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
					on:click={() => handlePageChange($currentPage - 1)}
					disabled={$currentPage === 1}
					aria-label="Previous page">
					<Icon icon="charm:chevron-left" class="w-4 h-4" />
				</button>
				{#each pageNumbers as page}
					{#if page === DOTS}
						<span class="px-2 text-gray-500 text-sm font-medium">{DOTS}</span>
					{:else}
						<button
							class={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm shadow-sm border transition-all duration-200 transform ${
								page === $currentPage
									? 'bg-primary-500 text-white border-primary-500 hover:bg-primary-600'
									: 'bg-white text-primary-700 border-gray-300 hover:bg-primary-500 hover:text-white active:scale-110'
							}`}
							on:click={() => handlePageChange(page)}
							disabled={page === $currentPage}
							aria-label="Go to page {page}"
							aria-current={page === $currentPage ? 'page' : undefined}>
							{page}
						</button>
					{/if}
				{/each}
				<button
					class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
					on:click={() => handlePageChange($currentPage + 1)}
					disabled={$currentPage === totalPages}
					aria-label="Next page">
					<Icon icon="charm:chevron-right" class="w-4 h-4" />
				</button>
				<button
					class="inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm shadow-sm border border-gray-300 bg-white text-gray-700 transition-all duration-200 transform hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
					on:click={() => handlePageChange(totalPages)}
					disabled={$currentPage === totalPages}
					aria-label="Last page">
					<Icon icon="charm:chevrons-right" class="w-4 h-4" />
				</button>
			</div>
		</div>
	{/if}
	<Toaster position="bottom-right" richColors />
</section>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if $showPopup}
	<div class="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
		<div
			class="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm animate-fadeIn"
			on:click={closePopup}></div>
		<div class="min-h-screen px-4 flex items-center justify-center overflow-auto">
			<div class="relative bg-white rounded shadow-2xl w-full max-w-7xl mx-auto animate-slideUp motion-reduce:animate-none">
				<div class="flex items-center justify-between p-4 border-b">
					<div class="flex items-center justify-between">
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						{#if isEditing}
							<form
								method="POST"
								action="?/editCart"
								use:enhance={handleEditCart}
								class="flex items-center gap-2 flex-1">
								<input type="hidden" name="cartId" value={$selectedCart?._id} />
								<div class="flex-1 relative">
									<input
										type="text"
										name="cartName"
										value={newCartName}
										on:input={handleNameChange}
										class="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent {!newCartName.trim()
											? 'border-red-300'
											: ''}"
										placeholder="Enter new cart name"
										required/>
									{#if !newCartName.trim()}
										<p class="text-red-500 text-xs my-1 absolute">*Cart name cannot be empty</p>
									{/if}
								</div>
								<div class="flex gap-2">
									<button
										type="submit"
										disabled={!canSave}
										class="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-20 justify-center">
										{#if isLoading}
											<Icon icon="mdi:loading" class="animate-spin" />
											<span>Saving...</span>
										{:else}
											<span>Save</span>
										{/if}
									</button>
									<button type="button" on:click={cancelEditing} disabled={isLoading} class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
										Cancel
									</button>
								</div>
							</form>
						{:else}
							<span class="flex items-center gap-2">
								<p class="font-semibold">Cart Details</p>
								<p class="font-base">
									- {$selectedCart?.cartName || 'Loading...'}
								</p>
								<button on:click={startEditing} class="p-2 text-primary-500 rounded hover:bg-primary-500 hover:text-white transition-colors duration-200 group relative">
									<span class="relative">
										<Icon icon={isLoading ? 'mdi:loading' : 'mdi:edit-outline'} class={`text-xl ${isLoading ? 'animate-spin' : ''}`}/>
										<span class="absolute transform -translate-x-1/2 z-auto whitespace-nowrap top-full mt-3 px-2 bg-gray-200 text-gray-600 text-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
											Edit
										</span>
									</span>
								</button>
							</span>
						{/if}
					</div>
					<button
						class="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
						on:click={closePopup}>
						<Icon icon="mdi:close" class="text-xl text-red-500 hover:text-red-700" />
					</button>
				</div>
				{#if $selectedCart.cartItems.length === 0}
					<div class="p-6 text-center bg-yellow-100 border m-6 border-yellow-300 rounded-lg">
						<p class="text-lg text-gray-700 font-semibold">No items are added to the Cart</p>
					</div>
				{:else}
					<div class="p-6">
						<div class="overflow-x-auto rounded-lg shadow">
							<table class="w-full border-collapse bg-white">
								<thead class="border">
									<tr class="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
										<th class="p-2 text-center font-semibold text-sm border">Product Name</th>
										<th class="p-2 text-center font-semibold text-sm border">Customer Reference</th>
										<th class="p-2 text-center font-semibold text-sm border">Description</th>
										<th class="p-2 text-center font-semibold text-sm border">Quantity</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									{#each $selectedCart.cartItems as item}
										<tr class="hover:bg-gray-50 transition-colors duration-150">
											<td class="p-2 border text-center">
												<div class="font-medium text-sm text-gray-900">
													{item.component?.productName || 'N/A'}
												</div>
											</td>
											<td class="p-2 border text-center text-description">
												{item.reference?.referenceNumber || '-'}
											</td>
											<td class="p-2 border text-center">
												<div class="text-xs text-gray-500 max-w-md truncate">
													{item.component?.description || 'No description found'}
												</div>
											</td>
											<td class="p-2 border text-center">
												<span
													class="inline-flex items-center justify-center px-2 py-2 bg-primary-100 text-primary-800 rounded"
													style="width: 40px; text-align: center; line-height: 1.2;">
													{item.quantity || '0'}
												</span>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/if}
				<div class="flex flex-col-reverse sm:flex-row justify-between gap-3 p-4 border-t bg-gray-50">
					<button
						type="button"
						disabled={isLoading}
						on:click={() => handleDelete($selectedCart._id)}
						class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-700 hover:text-white transition-colors duration-200 disabled:opacity-50">
						<Icon icon={isLoading ? 'mdi:loading' : 'mdi:delete'} class={`text-xl ${isLoading ? 'animate-spin' : ''}`}/>
						Delete Cart
					</button>
					<div class="relative">
						<button
							on:click={() => handleShareCart($selectedCart.cartId)}
							disabled={isLoading || !$selectedCart.cartItems.length}
							class="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white rounded
              {!$selectedCart.cartItems.length
								? 'opacity-50 cursor-not-allowed'
								: 'hover:bg-primary-700'} 
              transition-colors duration-200 flex items-center justify-center gap-2">
							<Icon icon={isLoading ? 'mdi:loading' : 'fluent:share-24-filled'} class={`text-xl ${isLoading ? 'animate-spin' : ''}`}/>
							{isLoading ? 'Generating...' : 'Share Cart'}
						</button>
						{#if !$selectedCart.cartItems.length}
							<div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
								Add items to cart before sharing
							</div>
						{/if}
					</div>
					<div class="flex flex-col-reverse sm:flex-row gap-3">
						<form method="POST" action="?/resumeCart" use:enhance={handleResumeCart}>
							<input type="hidden" name="cartId" value={$selectedCart?._id} />
							<button
								type="submit"
								disabled={isLoading}
								class="w-full sm:w-auto px-6 py-2 bg-green-700 text-white rounded hover:bg-green-500 transition-colors duration-200 flex items-center justify-center gap-2">
								<Icon icon={isLoading ? 'mdi:loading' : 'mdi:cart'} class={`text-xl ${isLoading ? 'animate-spin' : ''}`}/>
								{isLoading ? 'Resuming...' : 'Resume Cart'}
							</button>
						</form>
						<button class="w-full sm:w-auto px-6 py-2 bg-gray-200 text-description rounded hover:bg-gray-300 transition-colors duration-200" on:click={closePopup}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $showDeletePopup}
	<div
		class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-10 overflow-y-auto animate-fadeIn backdrop-blur-sm"
		on:click={cancelDelete}>
		<div class="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md animate-fadeIn" on:click|stopPropagation>
			<h2 class="text-xl font-semibold mb-4">Delete this Cart</h2>
			<p class="text-gray-600 mb-6">Are you sure you want to delete this Cart?</p>
			<div class="flex justify-end space-x-4">
				<button class="px-4 py-2 border rounded bg-gray-200 text-description hover:bg-gray-300" on:click={cancelDelete}>
					Keep it
				</button>
				<form method="POST" action="?/deleteCart" use:enhance={handleDeleteCart}>
					<input type="hidden" name="cartId" value={selectedCartId} />
					<button type="submit" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
						Delete
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if recureModal}
	<div
		class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto animate-fadeIn backdrop-blur-sm"
		on:click|self={toggleRecurrencePopup}>
		<div class="bg-white p-6 rounded shadow-lg max-w-sm w-11/12 animate-fadeIn">
			{#if message}
				<div class="h-32 text-green-600 flex flex-col items-center justify-center gap-2 font-medium">
					<Icon icon="codicon:pass-filled" class="w-10 h-10 md:w-14 md:h-14" />
					{message}
				</div>
			{:else}
				<h2 class="text-lg md:text-xl font-medium mb-4">
					{existingRecurrence ? 'Update' : 'Set'} Recurrence
				</h2>
				{#if existingRecurrence}
					<div class="mb-4 p-2 bg-gray-50 rounded-lg">
						<p class="text-sm m-1 text-gray-600">
							Current Recurrence:
							<span class="font-semibold text-primary-800">
								{formatRecurrenceType(existingRecurrence.recurring)}
							</span>
						</p>
						{#if existingRecurrence.recurringDate}
							<p class="text-sm m-1 text-gray-600">
								Next Date:
								<span class="font-medium text-primary-800">
									{formatRecurrenceDate(existingRecurrence.recurringDate)}
								</span>
							</p>
						{/if}
					</div>
				{/if}
				<form method="POST" action="?/recurrence" class="space-y-3" use:enhance={handleRecurrenceSubmit}>
					<input type="hidden" name="cartId" value={selectedCartId} />
					<div>
						<label for="recurrence" class="font-medium text-sm">Choose Recurrence Period</label>
						<select name="recurring" bind:value={month} id="recurrence" class="border-1 text-sm border-gray-300 rounded w-full focus:ring-0 focus:border-primary-500">
							<option selected hidden value="">Select</option>
							<option value="Monthly">Monthly</option>
							<option value="Quarterly">Quarterly</option>
							<option value="Semi Annual">Semi Annual</option>
							<option value="Annual">Annual</option>
							<option value="Custom">Custom</option>
						</select>
						{#if error}
							<p class="text-red-500 text-xs">{error}</p>
						{/if}
					</div>
					{#if month === 'Custom'}
						<div class="font-medium">
							<label for="custom" class="font-medium text-sm">Custom Interval</label>
							<div class="flex items-center gap-2">
								<select name="recurring" bind:value={custom} id="custom" class="border-1 text-sm border-gray-300 rounded w-1/2 focus:ring-0 focus:border-primary-500">
									<option selected hidden value="">Select</option>
									<option value="2 Months">2</option>
									<option value="4 Months">4</option>
									<option value="5 Months">5</option>
									<option value="7 Months">7</option>
									<option value="8 Months">8</option>
									<option value="9 Months">9</option>
									<option value="10 Months">10</option>
									<option value="11 Months">11</option>
								</select>
								<span>Months</span>
							</div>
							{#if customError}
								<p class="text-red-500 text-xs">{customError}</p>
							{/if}
						</div>
					{/if}
					<div class="flex gap-4 justify-between text-sm font-medium mt-4">
						<button type="button" on:click={toggleRecurrencePopup} class="w-1/2 py-2 bg-gray-200 text-description rounded hover:bg-gray-300 focus:outline-none">
							Cancel
						</button>
						<button type="submit" class="w-1/2 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none">
							{existingRecurrence ? 'Update' : 'Save'}
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if $showSharePopup && $selectedCart.cartItems.length > 0}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm animate-fadeIn" on:click={closeSharePopup}></div>
		<div class="min-h-screen px-4 flex items-center justify-center">
			<div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto animate-slideUp">
				<div class="p-6">
					<div class="flex items-center pb-4 border-b-2 justify-between mb-4">
						<h3 class="text-lg font-semibold">Share Cart</h3>
						<button
							on:click={closeSharePopup}
							class="p-1 hover:bg-gray-50 rounded transition-colors duration-200">
							<Icon icon="mdi:close" class="text-xl text-red-500 hover:text-red-700" />
						</button>
					</div>
					<div class="bg-primary-50 border border-primary-200 rounded-lg mb-6 p-4">
						<span class="text-xs">
							<p>
								<Icon icon="mdi:information-outline" class="inline-block mr-1 text-md mb-1 font-semibold"/>
                This link will create a new cart containing the same products, quantities and
								customer references for anyone who opens it.
							</p>
							<p class="py-2">No other attributes of this cart will be shared.</p>
							<p>Copy the link and paste it anywhere you would like it shared.</p>
						</span>
					</div>
					<div class="flex items-center gap-2">
						<input type="text" readonly value={$shareUrl} class="flex-1 p-2 border rounded bg-white text-sm focus:ring-0"/>
						<button on:click={copyShareLink} class="flex bg-primary-500 text-white px-4 py-1.5 rounded hover:bg-primary-600 duration-300 items-center gap-2">
							<Icon icon="oui:editor-link" width="20" height="24" />
							<span class="text-sm">{message || 'Copy'}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if newCartpopup}
	<div
		class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-10 overflow-y-auto animate-fadeIn backdrop-blur-sm"
		on:click={cancelNewCart}>
		<div class="bg-white rounded shadow-lg p-6 w-11/12 max-w-md animate-fadeIn" on:click|stopPropagation>
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-md sm:text-lg font-medium">Create a new cart</h2>
				<button class="p-1 hover:bg-gray-100 rounded transition-colors duration-200" on:click={cancelNewCart}>
					<Icon icon="mdi:close" class="text-xl text-red-500 hover:text-red-700" />
				</button>
			</div>

			<form method="POST" action="?/createcart" use:enhance={handleCreateCart} class="space-y-4">
				<div>
					<h4 class="text-sm font-medium mb-2">Cart name</h4>
					<input type="text" name="cartName" bind:value={newCartName} placeholder="Enter cart name" class="w-full text-sm px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary-500 focus:ring-0"/>
				</div>
				<input type="hidden" name="cartName" value={newCartName} />
				<input type="hidden" name="cartId" value={generateCartId()} />
				<input type="hidden" name="isActiveCart" value={true} />
				<p class="text-xs text-gray-600 p-2 bg-primary-50 rounded">
					<span class="font-bold text-red-500">Note:</span>
					This will deactivate the current cart and create a new one
				</p>
				<div class="flex gap-4 justify-between pt-4">
					<button type="button" on:click={cancelNewCart} class="px-4 py-2 border rounded bg-gray-200 text-gray-700 hover:bg-gray-300" disabled={isCreatingCart}>
						Cancel
					</button>
					<button type="submit" disabled={isCreatingCart} class="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
						{#if isCreatingCart}
							<Icon icon="mdi:loading" class="animate-spin" />
							Creating...
						{:else}
							Create Cart
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}