<script>
    import Resetpassword from '$lib/components/SignupSigninComps/Resetpassword.svelte'
    export let data
</script>

<Resetpassword token={data.token}/>