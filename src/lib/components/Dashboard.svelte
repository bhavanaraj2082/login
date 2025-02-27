<script>
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  import Navigation from '$lib/components/DashboardPage/Navigation.svelte';
  import cardsData from '$lib/data/cardsData.json';

  export let data;

  let user = data?.authedUser || null;
  $: orders = data?.orders || [];
  $: isRegistrationComplete = user && user.firstname && user.phone;
  $: navigationProps = {
    user,
    isRegistrationComplete
  };

  let userEmail = data.authedUser.email;
  let isLoading = true;
  let error = data?.error || null;

  onMount(() => {
    isLoading = false;
  });

  async function handleCompleteRegistration() {
    await goto('/dashboard/profile');
  }

  $: recentOrders = orders
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 2);

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
</script>

<section class="bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 lg:px-8 py-2">
    <div class="flex flex-col lg:flex-row gap-4">
      <Navigation {...navigationProps} />
      <div class="flex-1 space-y-6">
        <div class="bg-white rounded shadow p-4">
          <div class="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h1 class="sm:text-xl text-md font-semibold text-gray-800">
                Welcome, <span class="text-primary-600">{user?.firstname || 'Guest'}</span>
              </h1>
              <p class="text-gray-500 sm:text-sm text-xs mt-1">{user?.email || 'N/A'}</p>
            </div>
            {#if !isRegistrationComplete}
              <button 
                class="sm:px-6 sm:py-2.5 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-500 transition-all duration-200 shadow-sm hover:scale-95 flex items-center gap-2 mt-4 sm:mt-0"
                on:click={handleCompleteRegistration}>
                <Icon icon="heroicons:user-circle" class="text-xl"/>
                Complete Profile
              </button>
            {/if}
          </div>
        </div>
        {#if !isRegistrationComplete}
          <div class="bg-amber-50 border-l-4 border-amber-300 border sm:p-6 p-2 rounded">
            <div class="flex flex-col sm:flex-row justify-start items-center sm:text-base text-xs">
              <Icon icon="marketeq:warning-alt" class="text-4xl sm:my-0 mb-2 bg-gray-100 p-0.5 rounded-md"/>
              <p class="text-amber-700 sm:text-base text-xs ml-2">
                Please complete your profile to access all features and personalize your experience.
              </p>
            </div>
          </div>
        {/if}
        {#if isLoading}
          <div class="flex justify-center items-center h-48">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        {:else if error}
          <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
            <p class="text-red-700">{error}</p>
          </div>
        {:else if isRegistrationComplete}
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {#each cardsData as card}
              <div class="bg-white rounded shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                <div class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <h3 class="sm:text-xl text-md font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                      {card.title}
                    </h3>
                    <Icon icon={card.icon} class="text-3xl text-primary-600 group-hover:scale-110 transition-transform"/>
                  </div>
                  <div class="space-y-3">
                    {#each card.features as feature}
                      <div class="flex items-start gap-2">
                        <Icon icon="heroicons:check-circle" class="text-green-500 text-lg mt-1 shrink-0"/>
                        <p class="text-gray-600 sm:text-sm text-xs text-wrap">{feature}</p>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            {/each}
          </div>
          <div class="bg-white rounded shadow-sm overflow-hidden">
            <div class="p-3 border-b-1 border-gray-100">
              <div class="flex items-center justify-between">
                <h2 class="sm:text-xl text-sm font-semibold text-gray-800">Recent Orders</h2>
                <a href="/dashboard/myorders" 
                   class="inline-flex items-center gap-2 sm:px-4 sm:py-2 px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-all sm:text-sm text-2s hover:scale-95 whitespace-nowrap duration-300">
                  <Icon icon="heroicons:eye" class="sm:text-xl text-sm" />
                  View All Orders
                </a>
              </div>
            </div>
            {#if recentOrders && recentOrders.length > 0}
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gray-50 text-left">
                      <th class="px-6 py-3 text-sm font-semibold text-gray-600">Order ID</th>
                      <th class="px-6 py-3 text-sm font-semibold text-gray-600">Invoice Number</th>
                      <th class="px-6 py-3 text-sm font-semibold text-gray-600">Total Amount</th>
                      <th class="px-6 py-3 text-sm font-semibold text-gray-600">Purchase Order</th>
                      <th class="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    {#each recentOrders as order}
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm text-gray-600">{order?.orderid || 'N/A'}</td>
                        <td class="px-6 py-4 text-sm text-gray-600">{order?.invoice || 'N/A'}</td>
                        <td class="px-6 py-4 text-sm font-medium text-gray-800">
                          {#if order?.totalprice !== undefined && order?.totalprice !== null}
                            ₹{(order?.totalprice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {:else}
                            N/A
                          {/if}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">{order?.purchaseorder || 'N/A'}</td>
                        <td class="px-6 py-4">
                          <a href={`/order-status/${order?.orderid}?email=${userEmail}`} 
                             class="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
                            <Icon icon="heroicons:chart-bar" class="text-lg"/>
                            <span class="text-sm">Track Order</span>
                          </a>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {:else}
              <div class="p-6 text-center text-gray-500">
                <Icon icon="heroicons:shopping-bag" class="sm:text-3xl text-base mx-auto mb-2 text-gray-400"/>
                <p class="sm:text-sm text-xs">No orders available.</p>
              </div>
            {/if}
          </div>
          <div class="bg-white rounded shadow-sm p-6">
            <div class="flex items-start gap-4">
              <div class="hidden sm:block p-1 sm:p-3 bg-primary-50 rounded">
                <Icon icon="heroicons:building-office-2" class="sm:text-2xl text-xs text-primary-600"/>
              </div>
              <div>
                <h2 class="sm:text-xl text-md font-semibold text-gray-800 mb-2">My Chemikart</h2>
                <p class="text-gray-600 sm:mb-4 mb-2 sm:text-base text-sm">Chemikart Sales</p>
                <div class="space-y-2">
                  <a href="tel:7829922222" class="flex items-center gap-2 text-gray-600 hover:text-primary-600 underline-offset-4">
                    <Icon icon="heroicons:phone" class="sm:text-lg text-sm"/>
                    <span class="hover:underline sm:text-sm text-xs">7829922222</span>
                  </a>
                  <a href="mailto:sales@chemikart.com" class="flex items-center gap-2 text-gray-600 hover:text-primary-600 underline-offset-4">
                    <Icon icon="heroicons:envelope" class="sm:text-lg text-sm"/>
                    <span class="hover:underline sm:text-sm text-xs">sales@chemikart.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>