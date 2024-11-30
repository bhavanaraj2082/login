<script>
	  import { authedUser } from '$lib/stores/mainStores.js';
	  import Icon from '@iconify/svelte';
    import { createEventDispatcher } from 'svelte';
    import {enhance} from '$app/forms'

    let emailResponse 
    let emailSent = false;
    let loading = false
    console.log($authedUser);
    const dispatch = createEventDispatcher();
  
    // Function to handle button click
    async function handleVerifyEmail({cancel}) {
      loading = true
       return async({result})=>{
        console.log(result);
        if(result.type === "success" && result.data.success){
            emailResponse = result.data
            emailSent = true
            loading = false
        }
        if(result.type === "error"){
          emailResponse = result.error
            emailSent = true
            loading = false
        }
       }
    }
  
    // Close popup
    function closePopup() {
      console.log('object');
      dispatch('close');
    }
  </script>
  
  {#if !emailSent}
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50" on:click={closePopup}></div>
  
    <!-- Popup Content -->
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-md shadow-lg max-w-sm w-full">
        {#if loading}
          <div class=" flex items-center justify-center gap-2">
                   <Icon icon="line-md:loading-twotone-loop" class="text-2xl "/>
                   <p>Loading...</p>
          </div>
          {:else}
        <h2 class=" text-lg md:text-xl font-semibold mb-4">Verify your email address</h2>
        <p class="mb-4 text-xs md:text-sm">Click the button below to receive a verification email.</p>
        <form method="POST" action="?/verifyEmail" use:enhance={handleVerifyEmail}>
            <input type="hidden" name="email" value={$authedUser.email}>
            <input type="hidden" name="userId" value={$authedUser.userId}>
            <button type="submit" class="w-full bg-primary-500 text-white py-2 rounded hover:bg-primary-600 transition">Verify</button>
        </form>
        {/if}

    </div>
    </div>
  {:else}
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50" on:click={closePopup}></div>
  
    <!-- Success Popup -->
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-md shadow-lg max-w-sm w-full">
        <h2 class="text-lg md:text-xl font-semibold mb-4">{emailResponse?.title}</h2>
        <p class="mb-4 text-xs md:text-sm">{emailResponse?.message}</p>
      </div>
    </div>
  {/if}
  