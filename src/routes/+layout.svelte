<script>
  import "../app.css";
  import Header from '$lib/components/HeaderDropdownCart/Header.svelte';
  import Breadcrumb from "$lib/components/Breadcrumb.svelte";
  import Footer from '$lib/components/Footer.svelte';
	import { authedUser } from '$lib/stores/mainStores.js';
  
  export let data;
  $: authedUser.update(user=> ({...user,email:data.email }))

</script>

<Header {data}/>
<Breadcrumb/>
<slot />
<Footer/>