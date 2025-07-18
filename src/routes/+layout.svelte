<script>
  import '../app.css';
  import { authedUser } from '$lib/stores/mainStores.js';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';
  export let data;
  $authedUser = data?.authedUser;
</script>

<div class="flex flex-col min-h-screen">
  <main class="flex-grow">
    <slot />
  </main>
</div>
