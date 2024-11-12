<script>
  import "../app.css";
  import Header from '$lib/components/HeaderDropdownCart/Header.svelte';
  import Footerupdated from '$lib/components/Footerupdated.svelte';
  export let data;
</script>

<Header {data}/>
<slot />
<Footerupdated/>
