<script>
  import "../app.css";
  import { Toaster } from 'svelte-sonner';
  import Header from '$lib/components/HeaderDropdownCart/Header.svelte';
  import Breadcrumb from "$lib/components/Breadcrumb.svelte";
  import Footer from '$lib/components/Footer.svelte';
	import { authedUser } from '$lib/stores/mainStores.js';
  import AllowCookies from "$lib/components/AllowCookies.svelte";
  
  export let data;
  $: authedUser.update(user=> ({...user,email:data.email }))

</script>

<Header {data}/>
<Breadcrumb/>
<slot />
<Toaster position="bottom-right" richColors />
<Footer/>
<AllowCookies/>