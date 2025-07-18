<script>
  import '../app.css';
  import { authedUser } from '$lib/stores/mainStores.js';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  // import NavBar from '$lib/components/Home.svelte';



  export let data;
  $authedUser = data?.authedUser;




</script>

<div class="flex flex-col min-h-screen">
  <!-- {#if !$hideLayout}
    <NavBar {data} />
  {/if} -->

  <main class="flex-grow">
    <slot />
  </main>



  

</div>
