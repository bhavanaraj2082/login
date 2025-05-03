<script>
  import {onMount} from 'svelte';
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
        // { id: 'return', icon: 'hugeicons:truck-return', label: 'Return History', route: '/dashboard/returnshistory', requiresRegistration: true }
      ]
    },
  ];

  let hovered = false;
  export let loading = true;
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

  onMount(() => {
    setTimeout(() => {
        loading = false; 
    }, 200); 
  });
</script>

<nav class="bg-white shadow rounded-md transition-all duration-300 ease-in-out lg:py-4 lg:max-w-xl">
  {#if loading}
  <div class="hidden lg:flex my-1 items-center justify-center px-2 py-3 w-44 animate-pulse">
    <div class="h-6 bg-gray-300 rounded w-3/4"></div>
  </div>
  {:else}
  <div class="hidden lg:flex items-center justify-center text-2xl font-bold text-heading mb-1 pb-4 border-b">
    Chemikart
  </div>
  {/if}
  <div class="lg:hidden flex justify-between items-center p-4 border-b">
    {#if loading}
    <div class="flex my-1 items-center justify-between px-2 py-3 w-full animate-pulse">
      <div class="h-6 bg-gray-300 rounded-md w-3/4"></div>
      <div class="h-6 w-6 bg-gray-300 rounded-md ml-6"></div>
    </div>
    {:else}
    <h1 class="text-xl font-bold text-heading">Chemikart</h1>
    <button
    class="md:p-2 p-1.5 rounded-md bg-primary-50 hover:bg-primary-200 transition-all duration-300 ease-in-out"
    aria-label="Toggle menu"
    on:click={() => isMenuOpen.update((v) => !v)}>
    <Icon icon={$isMenuOpen ? 'mdi:close' : 'mdi:menu'} class="text-primary-700 hover:scale-95 text-2xl" />
  </button>
  {/if}
  </div>
  <div
    class="lg:block w-full overflow-hidden transition-all duration-500 ease-in-out"
    class:hidden={!$isMenuOpen}
    transition:slide|local>
    {#if loading}
    {#each Array(8) as _, i}
        <div class="flex my-1 items-center gap-2 px-6 py-3 w-full animate-pulse">
          <div class="w-5 h-5 bg-gray-300 rounded-full"></div>
          <div class="h-4 bg-gray-300 rounded-md w-3/4"></div>
        </div>
      {/each}
    {:else}
    {#each navigationGroups as group}
      {#if group.title}
        <h2 class="px-6 py-2 text-sm font-semibold text-gray-800 uppercase whitespace-nowrap tracking-wider mt-1">{group.title}</h2>
      {/if}
      <div class="m-1">
        {#each group.items as item}
          <button
            class="flex my-1 items-center gap-2 px-6 py-3 w-full text-left text-sm rounded-md 
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
    {/if}
  </div>
</nav>