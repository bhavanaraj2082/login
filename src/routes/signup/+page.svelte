<script>
  import Signup from "$lib/components/SignupSigninComps/Signup.svelte";
  import { authedUser } from "$lib/stores/mainStores.js";

</script>


<div class="min-h-screen overflow-hidden bg-gradient-to-br from-primary-400 via-primary-400 to-primary-200 relative">
  <div class="absolute top-1/4 left-10 lg:w-40 w-10 lg:h-40 h-10 md:bg-white/30 bg-gray-800/10 blur-2xl clip-hexagon shadow-md"></div>
  <div class="absolute bottom-10 right-10  lg:w-20 lg:h-20 bg-primary-950/20 animate-pulse shadow-2xl blur-2xl clip-hexagon"></div>
  <div class="absolute top-12 right-10 lg:w-40 w-8 lg:h-40 h-8 bg-primary-700/10 blur-2xl clip-hexagon"></div>  
<Signup />
</div>