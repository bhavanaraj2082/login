<script>
	import { createEventDispatcher } from 'svelte';
	import { enhance, applyAction } from '$app/forms';
	// import PageNtFnd from './PageNtFnd.svelte';
	import { authedUser } from '$lib/stores/mainStores.js';
	import { toast } from 'svelte-sonner';
	import { Toaster } from 'svelte-sonner';
	export let token = '';
	let message = '';
	let flag = false;
	const dispatch = createEventDispatcher();
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	// $: console.log($authedUser.userId, "authedUser.userId");	
	// export let data;
	// const token = data.token;

	// async function handleSubmit(event) {
	// 	event.preventDefault();

	// 	console.log('Submitting:', { token, newPassword, confirmPassword });

	// 	if (newPassword !== confirmPassword) {
	// 		message = 'Passwords do not match.';
	// 		return;
	// 	}

	// 	// Change the URL to your actual server endpoint
	// 	const response = await fetch('https://betapb.partskeys.com/resetpassword', {
	// 		method: 'POST',
	// 		headers: { 'Content-Type': 'application/json' },
	// 		body: JSON.stringify({ token, newPassword, confirmPassword })
	// 	});

	// 	console.log(response);

	// 	if (response.ok) {
	// 		message = 'Password reset succesfully';
	// 		flag = true;
	// 		dispatch('resetSuccess', { message });
	// 	} else {
	// 		const error = await response.json();
	// 		message = `Error: ${error.message}`;
	// 	}
	// }

	$: successMessage = '';
	$: errorMessage = '';

	let hide = true;

	let error = {};
	let newPassword = '';
	let confirmPassword = '';
	const validation = () => {
		error = {};
		if (!newPassword) {
			error.password =
				'*Required';
		} else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(newPassword)){
			error.password =
				'Password must be at least 8 characters with an uppercase letter, a lowercase letter, a digit, and a special symbol';
		}

		if (!confirmPassword ){
			error.passwordConfirm = '*Required';
		}else if(confirmPassword !== newPassword){
			error.passwordConfirm = 'Current password does not match the entered password';
		}

		if (Object.keys(error).length > 0) {
			return false;
		} else {
			return true;
		}
	};
	let showNewPassword = false;
  let showConfirmPassword = false;
  
  function toggleNewPasswordVisibility() {
    showNewPassword = !showNewPassword;
  }
  
  function toggleConfirmPasswordVisibility() {
    showConfirmPassword = !showConfirmPassword;
  }
</script>

{#if token}
	<div
		class="max-w-80 sm:max-w-xs md:max-w-sm lg:max-w-sm border-2 rounded-md shadow-lg bg-white mx-auto mt-10"
	>
		<h1 class="text-center text-xl lg:text-2xl text-white bg-primary-300 py-2 rounded-t-sm">
			Password Reset
		</h1>
		<div class="px-10 py-6">
			<div class="flex items-center justify-center">
				<p class="text-black text-sm font-bold">Recover</p>
			</div>
			<div class="flex items-center justify-center py-5 text-gray-400">
				<div class="flex flex-row items-center justify-center">
					<Icon icon={'ep:success-filled'} class=" text-primary-600 text-3xl" />
					<hr class="bg-primary-600 text-3xl lg:w-16 md:w-24 w-5 xs:w-5 h-1 rounded" />
				</div>

				<div class="flex flex-row">
					<Icon icon={'ep:success-filled'} class="  text-primary-600 text-3xl " />
					<hr
						class={`${flag ? 'bg-primary-600 mt-3.5' : 'mt-3.5'} lg:w-14 md:w-24 w-5 xs:w-5 h-1 bg-primary-200 rounded text-lg`}
					/>
				</div>

				<div class=" flex flex-row">
					<Icon
						icon={flag ? 'ep:success-filled' : 'bi:3-circle'}
						class={` ${flag ? ' text-primary-600 text-3xl' : ''} text-2xl`}
					/>
				</div>
			</div>
			{#if successMessage}
				<div class="mt-4 p-4 bg-green-100 text-xs text-green-800 rounded-md">
					{successMessage}
				</div>
			{/if}

			{#if errorMessage}
				<div class="mt-4 p-4 bg-red-100 text-xs text-red-800 rounded-md">
					{errorMessage}
				</div>
			{/if}
			<!-- <form
				action="?/updatePassword"
				method="POST"
				use:enhance={({ cancel }) => {
					if (!validation()) {
						// errorMessage = Object.values(error).join(' , ');
						successMessage = '';
						cancel();
						return;
					}

					return async ({ result }) => {
						console.log('result', result);
						if (result.data.success === true) {
							// successMessage = result.data.message;
							toast.success(result.data.message);
							errorMessage = '';
							flag = true;
							hide = false;
							setTimeout(() => {
								goto('/login');
							}, 3000);
						}
						if (result.data.success === false) {
							successMessage = '';
							// errorMessage = result.data.message;
							toast.error(result.data.message);
						}
						await applyAction(result);
					};
				}}
			>
				{#if hide}
					<label class="block mb-4">
						<input
							name="newPassword"
							type="password"
							bind:value={newPassword}
							placeholder="Enter new password"
							class="mt-1 block w-full border border-gray-300 rounded-md p-1.5 focus:ring-0 focus:border-black text-xs"
							on:input={() => {
								error.password = !newPassword 
								? '*Required'
								:!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(newPassword)
								? 'Password must be at least 8 characters with an uppercase letter, a lowercase letter, a digit, and a special symbol'
								: '';
							}}
						/>
						{#if error.password}
						<p class="text-red-500 text-xs">{error.password}</p>
						{/if}
					</label>
					<label class="block mb-4">
						<input
							name="confirmPassword"
							type="password"
							bind:value={confirmPassword}
							placeholder="Confirm new password"
							class="mt-1 block w-full border border-gray-300 rounded-md p-1.5 focus:ring-0 focus:border-black text-xs"
							on:input={() => {
								error.passwordConfirm = !confirmPassword 
								? '*Required'
								:confirmPassword !== newPassword
								? 'Current password does not match the entered password'
								: '';
							}}
						/>
						{#if error.passwordConfirm}
						<p class="text-red-500 text-xs">{error.passwordConfirm}</p>
						{/if}
					</label>
					<input type="hidden" name="token" value={token} />
					<input type="hidden" name="userId" value={$authedUser.id} />
					<input type="hidden" name="email" value={$authedUser.email} />
					<button
						type="submit"
						class="w-1/3 bg-primary-600 text-white rounded-md p-2 hover:bg-primary-800 transition text-xs"
					>
						Reset
					</button>
				{/if}
				{#if message}
					{#if message === 'Password reset succesfully'}
						<p class="py-2 text-xs text-center bg-green-300">{message}</p>
					{:else}
						<br />
						<Icon icon={'typcn:warning'} class=" w-5 h-5 text-red-500 inline pr-1" />
						<p class=" text-black text-xs py-0.5 inline">{message}</p>
					{/if}
				{/if}
			</form> -->
		
				
			<form
			action="?/updatePassword"
			method="POST"
			use:enhance={({ cancel }) => {
			  if (!validation()) {
				successMessage = '';
				cancel();
				return;
			  }
		  
			  return async ({ result }) => {
				// console.log('result', result);
				if (result.data.success === true) {
				  toast.success(result.data.message);
				  errorMessage = '';
				  flag = true;
				  hide = false;
				  setTimeout(() => {
					goto('/login');
				  }, 3000);
				}
				if (result.data.success === false) {
				  successMessage = '';
				  toast.error(result.data.message);
				}
				await applyAction(result);
			  };
			}}
		  >
			{#if hide}
			  <div class="mb-4">
				<div class="relative">
				  {#if showNewPassword}
					<input
					  type="text"
					  name="newPassword"
					  placeholder="Enter new password"
					  class="w-full px-4 py-2 pr-10 border border-gray-300 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
					  bind:value={newPassword}
					  on:input={() => {
						error.password = !newPassword ? '*Required' : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(newPassword) ? 'Password must be at least 8 characters with an uppercase letter, a lowercase letter, a digit, and a special symbol' : '';
					  }}
					/>
				  {:else}
					<input
					  type="password"
					  name="newPassword"
					  placeholder="Enter new password"
					  class="w-full px-4 py-2 pr-10 border border-gray-300 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
					  bind:value={newPassword}
					  on:input={() => {
						error.password = !newPassword ? '*Required' : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(newPassword) ? 'Password must be at least 8 characters with an uppercase letter, a lowercase letter, a digit, and a special symbol' : '';
					  }}
					/>
				  {/if}
		  
				  <button
					type="button"
					class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
					on:click={toggleNewPasswordVisibility}
				  >
					{#if showNewPassword}
					  <Icon icon="mdi:eye-off-outline" class="w-5 h-5" />
					{:else}
					  <Icon icon="mdi:eye-outline" class="w-5 h-5" />
					{/if}
				  </button>
				</div>
				{#if error.password}
				  <p class="text-red-500 text-xs">{error.password}</p>
				{/if}
			  </div>

			  <div class="mb-4">
				<div class="relative">
				  {#if showConfirmPassword}
					<input
					  type="text"
					  name="confirmPassword"
					  placeholder="Confirm new password"
					  class="w-full px-4 py-2 pr-10 border border-gray-300 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
					  bind:value={confirmPassword}
					  on:input={() => {
						error.passwordConfirm = !confirmPassword ? '*Required' : confirmPassword !== newPassword ? 'Current password does not match the entered password' : '';
					  }}
					/>
				  {:else}
					<input
					  type="password"
					  name="confirmPassword"
					  placeholder="Confirm new password"
					  class="w-full px-4 py-2 pr-10 border border-gray-300 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
					  bind:value={confirmPassword}
					  on:input={() => {
						error.passwordConfirm = !confirmPassword ? '*Required' : confirmPassword !== newPassword ? 'Current password does not match the entered password' : '';
					  }}
					/>
				  {/if}
		  
				  <button
					type="button"
					class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
					on:click={toggleConfirmPasswordVisibility}
				  >
					{#if showConfirmPassword}
					  <Icon icon="mdi:eye-off-outline" class="w-5 h-5" />
					{:else}
					  <Icon icon="mdi:eye-outline" class="w-5 h-5" />
					{/if}
				  </button>
				</div>
				{#if error.passwordConfirm}
				  <p class="text-red-500 text-xs">{error.passwordConfirm}</p>
				{/if}
			  </div>
		  
			  <input type="hidden" name="token" value={token} />
			  <input type="hidden" name="userId" value={$authedUser.id} />
			  <input type="hidden" name="email" value={$authedUser.email} />
			  <button
				type="submit"
				class="w-1/3 bg-primary-600 text-white rounded-md p-2 hover:bg-primary-800 transition text-xs"
			  >
				Reset
			  </button>
			{/if}
		  
			{#if message}
			  {#if message === 'Password reset succesfully'}
				<p class="py-2 text-xs text-center bg-green-300">{message}</p>
			  {:else}
				<br />
				<Icon icon={'typcn:warning'} class=" w-5 h-5 text-red-500 inline pr-1" />
				<p class=" text-black text-xs py-0.5 inline">{message}</p>
			  {/if}
			{/if}
		  </form>
		
		
		</div>
	</div>
{:else}
<div class="mt-4 p-4 bg-red-200 text-sm text-red-900 border border-red-300 rounded-md shadow-md flex items-center justify-between">
	<div>
	  <strong class="font-semibold">Invalid or Expired Token</strong>
	  <p class="mt-1">Your password reset token has either expired or is invalid. Please request a new password reset email.</p>
	</div>
	<a href="/forgot" class="ml-4 bg-red-500 text-white text-xs py-1 px-3 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
		Resend Email
	  </a>
  </div>
{/if}
<Toaster position="bottom-right" richColors />