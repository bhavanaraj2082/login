<script>
  import "../app.css";
  import { Toaster } from 'svelte-sonner';
  import Header from '$lib/components/HeaderDropdownCart/Header.svelte';
  import Breadcrumb from "$lib/components/Breadcrumb.svelte";
  import Footer from '$lib/components/Footer.svelte';
  export let data;
</script>
<Header {data}/>
<Breadcrumb/>
<slot />
<Toaster position="bottom-right" richColors />
<Footer/>