<script>
  import "../app.css";
  import Header from '$lib/components/HeaderDropdownCart/Header.svelte';
  import Breadcrumb from "$lib/components/Breadcrumb.svelte";
  import Footer from '$lib/components/Footerupdated.svelte';
  export let data;
</script>
<Header {data}/>
<Breadcrumb/>
<slot />
<Footer/>