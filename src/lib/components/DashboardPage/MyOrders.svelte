<script>
    import Icon from '@iconify/svelte';
    import OrdersTab from '$lib/components/DashboardPage/Tabs/Orders.svelte';
    import InvoicesTab from '$lib/components/DashboardPage/Tabs/Invoices.svelte';
    import ProductsTab from '$lib/components/DashboardPage/Tabs/Products.svelte';
//  import ReportsTab from '$lib/components/AccountPage/Tabs/Reports.svelte';
    
    export let data;
    let activeTab = 'orders';
    
//  const tabs = ['Orders', 'Invoices', 'Products', 'Reports'];
    const tabs = ['Orders', 'Invoices', 'Products'];
</script>

<div class="w-full lg:w-11/12 max-w-7xl mx-auto py-2 px-4 bg-gray-50"> 
    <h1 class="font-bold text-2xl mb-3">My Orders</h1>
    {#if !data?.orders?.length}
        <a href="/products">
            <div class="border-l-8 my-4 border-yellow-500 h-40 flex flex-col items-center justify-center text-yellow-700 p-6 mb-6 rounded-xl shadow hover:bg-yellow-50 transition-all duration-300 cursor-pointer">
                <div class="flex flex-col items-center text-center">
                    <Icon icon="hugeicons:shopping-bag-add" class="text-4xl mb-4" />
                    <p class="font-semibold text-xs md:text-xl text-yellow-700 hover:text-yellow-800 transition-all duration-300">
                        You have no orders yet. Start shopping today!
                    </p>
                </div>
            </div>
        </a>
    {:else}
        <div class="flex mb-4 transition-opacity duration-500 ease-in-out">
            {#each tabs as tab}
                <button
                    class={`px-4 py-2 ${activeTab === tab.toLowerCase() ? 'border-b-2 border-primary-500' : ''}`}
                    on:click={() => (activeTab = tab.toLowerCase())}>
                    {tab}
                </button>
            {/each}
        </div>
        <div class="transition-opacity duration-500 ease-in-out">
            {#if activeTab === 'orders'}
            <OrdersTab {data} />
            {:else if activeTab === 'invoices'}
            <InvoicesTab {data} />
            {:else if activeTab === 'products'}
            <ProductsTab {data} />
            <!-- {:else if activeTab === 'reports'}
            <ReportsTab {data}/> -->
            {/if}
        </div>
   {/if}
</div>