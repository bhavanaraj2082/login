<script>
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  import Navigation from '$lib/components/DashboardPage/Navigation.svelte';
  import cardsData from '$lib/data/cardsData.json';

  export let data;

  $: user = data?.authedUser || null;
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
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">
                Welcome, <span class="text-primary-600">{user?.firstname || 'Guest'}</span>
              </h1>
              <p class="text-gray-500 sm:text-sm text-xs mt-1">{user?.email || 'N/A'}</p>
            </div>
            {#if !isRegistrationComplete}
              <button 
                class="px-6 py-2.5 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                on:click={handleCompleteRegistration}>
                <Icon icon="heroicons:user-circle" class="text-xl"/>
                Complete Profile
              </button>
            {/if}
          </div>
        </div>
        {#if !isRegistrationComplete}
          <div class="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
            <div class="flex items-center gap-3">
              <Icon icon="heroicons:exclamation-triangle" class="text-amber-400 text-2xl"/>
              <p class="text-amber-700 font-medium">
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
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {#each cardsData as card}
              <div class="bg-white rounded shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                <div class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <h3 class="text-xl font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                      {card.title}
                    </h3>
                    <Icon icon={card.icon} class="text-3xl text-primary-600 group-hover:scale-110 transition-transform"/>
                  </div>
                  <div class="space-y-3">
                    {#each card.features as feature}
                      <div class="flex items-start gap-2">
                        <Icon icon="heroicons:check-circle" class="text-green-500 text-lg mt-1 shrink-0"/>
                        <p class="text-gray-600 text-sm">{feature}</p>
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
                <h2 class="text-xl font-semibold text-gray-800">Recent Orders</h2>
                <a href="/dashboard/myorders" 
                   class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-all sm:text-sm text-2s hover:scale-95 duration-300">
                  <Icon icon="heroicons:eye" class="text-xs" />
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
                        <td class="px-6 py-4 text-sm text-gray-600">{order?.Invoice || 'N/A'}</td>
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
                <Icon icon="heroicons:shopping-bag" class="text-4xl mx-auto mb-2 text-gray-400"/>
                <p>No orders available.</p>
              </div>
            {/if}
          </div>
          <div class="bg-white rounded shadow-sm p-6">
            <div class="flex items-start gap-4">
              <div class="hidden sm:block p-1 sm:p-3 bg-primary-50 rounded">
                <Icon icon="heroicons:building-office-2" class="sm:text-2xl text-xs text-primary-600"/>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-800 mb-2">My Chemikart</h2>
                <p class="text-gray-600 mb-4">Chemikart Sales</p>
                <div class="space-y-2">
                  <a href="tel:7829922222" class="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                    <Icon icon="heroicons:phone" class="text-lg"/>
                    <span class="hover:underline-offset-4">7829922222</span>
                  </a>
                  <a href="mailto:sales@chemikart.com" class="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                    <Icon icon="heroicons:envelope" class="text-lg"/>
                    <span class="hover:underline-offset-4">sales@chemikart.com</span>
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

<!-- <script>
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  import Navigation from '$lib/components/DashboardPage/Navigation.svelte';
  import cardsData from '$lib/data/cardsData.json';

  export let data;

  $: user = data?.authedUser || null;
  $: orders = data?.orders || [];
  $: isRegistrationComplete = user && user.firstname && user.phone;
  $: navigationProps = {
    user,
    isRegistrationComplete
  };

  let userEmail = data.authedUser.email

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

<section class="w-full mx-auto">
  <div class="block lg:flex items-start gap-6 lg:max-w-7xl mx-auto lg:px-12 pb-4">
    <Navigation {...navigationProps} />
    
    <div class="w-full">
      <div class="my-2">
        <p class="border-b-2 border-primary-600 text-lg md:text-xl font-semibold py-2">
          Welcome, <span class="font-bold font-roboto ml-1">
            {user?.firstname || 'Guest'}
          </span>
          <span class="text-xs ml-1">({user?.email || 'N/A'})</span>
        </p>
        {#if !isRegistrationComplete}
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
            <div class="flex items-center">
              <Icon icon="marketeq:warning-alt" class="text-yellow-400 text-xl"/>
              <p class="ml-3 text-sm text-yellow-700">
                Please complete your profile to access all features.
              </p>
            </div>
            <button 
              class="mt-4 px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              on:click={handleCompleteRegistration}>
              Complete Profile
            </button>
          </div>
        {/if}
        {#if isLoading}
          <div class="flex justify-center items-center h-48">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        {:else if error}
          <div class="text-red-600 p-4 text-center bg-red-50 rounded-md">
            {error}
          </div>
        {:else if isRegistrationComplete}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {#each cardsData as card}
              <div class="bg-white p-4 rounded shadow hover:shadow-lg transition-all">
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-semibold">{card.title}</h3>
                  <Icon icon={card.icon} class="text-4xl text-primary-600" />
                </div>
                <div class="mt-4">
                  {#each card.features as feature}
                    <p class="text-sm text-gray-600 mt-2">{feature}</p>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
          <div class="border rounded-md px-2 p-4 w-full overflow-x-auto scroll bg-white shadow">
            <h2 class="font-semibold text-heading py-4 lg:text-xl sticky pl-2">Recent Orders</h2>
            {#if recentOrders && recentOrders.length > 0}
            <table class="w-full text-gray-600 text-xs sm:text-sm">
              <thead>
                <tr class="border-y border-primary-600 font-medium text-center">
                  <th class="py-2 px-4">Order Id</th>
                  <th class="py-2 px-4">Invoice Number</th>
                  <th class="py-2 px-4">Total Amount</th>
                  <th class="py-2 px-4">Purchase Order</th>
                  <th class="py-2 px-4">View status</th>
                </tr>
              </thead>
              <tbody>
                {#each recentOrders as order}
                  <tr class="border-b border-gray-100 text-center">
                    <td class="py-2.5 px-4">{order?.orderid || 'N/A'}</td>
                    <td class="py-2.5 px-4">{order?.Invoice || 'N/A'}</td>
                    <td class="px-2.5 py-4 text-center font-semibold text-gray-700">
                      {#if order?.totalprice !== undefined && order?.totalpricel !== null}
                        ₹{(order?.totalprice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {:else}
                        'N/A'
                      {/if}
                    </td>
                    <!-- <td class="py-2.5 px-4">₹{typeof order?.totalprice === 'number' ? formatNumber(order.totalprice) : 'N/A'}</td> --
                    <td class="py-2.5 px-4">{order?.purchaseorder || 'N/A'}</td>
                    <td class="py-2.5 px-4">
                      <a href={`/order-status/${order?.orderid}?email=${userEmail}`} class="flex justify-center items-center hover:scale-105 p-1">
                        <Icon icon="material-symbols:timeline" class="text-xl lg:text-2xl shrink-0 text-primary-600 bg-primary-50 rounded-full"/>
                      </a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
            {:else}
              <div class="py-4 px-6 text-gray-500">No orders available.</div>
            {/if}
          </div>
          <div class="bg-primary-400 w-32 py-2 flex justify-center items-center rounded text-white hover:bg-primary-600 m-2">
            <a href="/dashboard/myorders" class="flex">View Orders</a>
          </div>
          <div class="border rounded-md p-4 pr-2 my-4 md:m-0 w-full bg-white shadow">
            <h2 class="font-bold text-sm text-heading lg:text-xl">My Chemikart</h2>
            <p class="text-sm py-2 lg:text-xl font-medium text-description my-0.5">Chemikart Sales</p>
            <p>Phone: <a href="tel:7829922222" class="text-primary-800 underline underline-offset-2 text-xs sm:text-sm">7829922222</a></p>
            <p>Mail: <a href="mailto:sales@chemikart.com" class="text-primary-800 underline underline-offset-2 text-xs sm:text-sm">sales@chemikart.com</a></p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section> -->