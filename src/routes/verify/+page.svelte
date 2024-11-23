<script>
import { goto } from '$app/navigation';

export let data
const {success,message} = data
</script>

<div class=" my-28 w-full flex items-center justify-center">
    <div class=" w-72 sm:w-96 md:w-2/5 lg:1/4 xl:w-2/6 p-8 border-1 bg-white text-xs sm:text-sm text-center font-medium space-y-5">
        <p>{message}</p>
        <button type="button" on:click={()=>goto(success ? '/profile' : '/signup')} class=" w-full py-2 rounded bg-primary-500 text-white font-semibold">Go to {success ? "profile" : "register"}</button>
    </div>
</div>