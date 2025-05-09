<script>
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import { navigating , page } from '$app/stores';
	import Header from '$lib/components/HeaderDropdownCart/Header.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import LoadingBar from '$lib/components/LoadingBar.svelte';
	import { isLoading } from '$lib/stores/mainStores.js';
	import Footer from '$lib/components/Footer.svelte';
	import { authedUser } from '$lib/stores/mainStores.js';
	import AllowCookies from '$lib/components/AllowCookies.svelte';

	export let data;
	// console.log('Layout==>',data);
    $authedUser = data?.authedUser;

	$: $isLoading = $navigating !== null;
	$: isAuthRoute = $page.url.pathname === '/signup' || $page.url.pathname === '/forgot' || $page.url.pathname === '/reset-password' || $page.url.pathname === '/signin';
</script>
{#if !isAuthRoute}
 <Header {data}/>
<Breadcrumb/> 
<LoadingBar />
{/if}
<div class="flex-grow sm:px-0 mx-auto {isAuthRoute ? 'w-full' : ''}">
<slot />
</div>
{#if !isAuthRoute}
<Footer />
<Toaster position="bottom-right" richColors />
{/if}