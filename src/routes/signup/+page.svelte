<script>
import Signup from '$lib/components/SignupSigninComps/Signup.svelte'
import { authedUser } from '$lib/stores/mainStores.js';

console.log($authedUser.email);
</script>

<Signup/>