<script>
  import Icon from '@iconify/svelte';
  import { slide } from 'svelte/transition';
  import { page } from '$app/stores';
  import { activeView } from '$lib/stores/accountStore.js';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';

  export let isRegistrationComplete = false;

  const navigationGroups = [
    {
      items: [
        { 
          id: 'dashboard', 
          icon: 'material-symbols-light:dashboard-outline', 
          label: 'Dashboard', 
          route: '/dashboard',
          alwaysEnabled: true
        },
        { 
          id: 'profile', 
          icon: 'mingcute:user-4-line', 
          label: 'Profile', 
          route: '/dashboard/profile',
          alwaysEnabled: true,
          // requiresRegistration: true
        }
      ]
    },
    {
      title: 'Orders and List',
      items: [
        { id: 'myOrders', icon: 'fluent-mdl2:product-variant', label: 'My Orders', route: '/dashboard/myorders', requiresRegistration: true },
        { id: 'myCart', icon: 'mdi:cart-outline', label: 'My Cart', route: '/dashboard/mycart', requiresRegistration: true },
        { id: 'quotes', icon: 'carbon:document-configuration', label: 'My Quotes', route: '/dashboard/myquotes', requiresRegistration: true },
        { id: 'favourite', icon: 'mdi:favourite-border', label: 'My Favourites', route: '/dashboard/myfavourite', requiresRegistration: true },
        { id: 'return', icon: 'hugeicons:truck-return', label: 'Return History', route: '/dashboard/returnshistory', requiresRegistration: true }
      ]
    },
  ];

  let hovered = false;
  const isMenuOpen = writable(false);

  $: if ($page.url.pathname) {
    isMenuOpen.set(false);
  }

  function handleNavigation(item) {
    if (item.requiresRegistration && !isRegistrationComplete) {
      goto('/signup/');
      return;
    }

    if (item.route) goto(item.route);
    else activeView.set(item.id);
    isMenuOpen.set(false);
  }

  function isActive(item) {
    return $page.url.pathname === item.route || $activeView === item.id;
  }

  function isItemDisabled(item) {
    return item.requiresRegistration && !isRegistrationComplete;
  }
</script>

<nav class="bg-white shadow rounded transition-all duration-300 ease-in-out lg:py-4 lg:max-w-xl">
  <div class="hidden lg:flex items-center justify-center text-2xl font-bold text-heading p-6 border-b">
    Chemikart
  </div>
  <div class="lg:hidden flex justify-between items-center p-4 border-b">
    <h1 class="text-xl font-bold text-heading">Chemikart</h1>
    <button
      class="p-2 rounded bg-primary-50 hover:bg-primary-200 transition-all duration-300 ease-in-out"
      aria-label="Toggle menu"
      on:click={() => isMenuOpen.update((v) => !v)}>
      <Icon icon={$isMenuOpen ? 'mdi:close' : 'mdi:menu'} class="text-primary-700" width="28" height="28" />
    </button>
  </div>
  <div
    class="lg:block overflow-hidden transition-all duration-500 ease-in-out"
    class:hidden={!$isMenuOpen}
    transition:slide|local>
    {#each navigationGroups as group}
      {#if group.title}
        <h2 class="px-6 py-2 text-sm font-semibold text-gray-800 uppercase whitespace-nowrap tracking-wider mt-1">{group.title}</h2>
      {/if}
      <div class="m-1">
        {#each group.items as item}
          <button
            class="flex my-1 items-center gap-2 px-6 py-3 w-full text-left text-sm rounded 
              {isActive(item) ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-700'}
              {isItemDisabled(item) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-100 hover:scale-95 transition-all duration-500 ease-in-out'}
              {hovered ? 'py-1' : 'py-2'}"
            on:click={() => handleNavigation(item)}
            on:mouseenter={() => hovered = true}
            on:mouseleave={() => hovered = false}
            disabled={isItemDisabled(item)}>
            <Icon 
              icon={item.icon} 
              class={isItemDisabled(item) ? 'text-gray-400' : 'text-gray-500'} 
              width="20" 
              height="20" />
            <span class="whitespace-nowrap">
              {item.label}
              {#if isItemDisabled(item)}
                <!-- <span class="text-xs text-gray-500 ml-1">(Complete registration required)</span> -->
              {/if}
            </span>
          </button>
        {/each}
      </div>
    {/each}
  </div>
</nav>
