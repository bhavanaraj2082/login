<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import Confirmpassword from "$lib/components/SignupSigninComps/Confirmpassword.svelte";
    $: token = $page.data.token;
    onMount(() => {
        console.log("****Token received in +page.svelte onMount****", token);
    });
</script>

<Confirmpassword {token} on:resetSuccess={event => console.log(event.detail.message)} />