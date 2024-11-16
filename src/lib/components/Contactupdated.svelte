<script>
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	let phone = ''; 
	let email = '';
	let name = '';
	let message = '';
	let subject = '';
	let formValid = true;
	let formSubmitted = false;
	let showErrors = false;
	let successMessage = '';
	let errorMessage = '';
	function resetForm() {
    phone = '';
    email = '';
    name = '';
    message = '';
    subject = '';
		successMessage = '';
	  errorMessage = '';

}
	function handleSubmit(event) {
		if (phone.length !== 10 || email.length === 0 || name.length === 0 || message.length === 0 || subject.length === 0) {
			console.log('Validation failed: Missing required fields');
			event.preventDefault();
			formValid = false;
			showErrors = true;
		} else {
			formValid = true;
			formSubmitted = true;
			showErrors = false;
		}
		if (!formValid) { 
			event.preventDefault(); 
		}
	}
	function showMessage(message1, keywordError) {
		successMessage = message1;
		errorMessage = keywordError;
		if (keywordError === 'success') {
        setTimeout(() => {resetForm();}, 2000);  
    }
	}
</script>
<section class="my-10 w-11/12 max-w-7xl flex flex-wrap justify-center mx-auto px-2 sm:p-0 font-roboto">
	<div class="w-full md:w-4/5 bg-white border border-gray-300 rounded-lg">
		<h1 class="text-2xl font-bold bg-primary-500 text-white py-4 pl-4 rounded-t-lg">
			Get in Touch with Us
		</h1>
		<form method="POST" action="?/contactus" class="space-y-4" use:enhance={() => {
			return async({ result }) => {
				let message1 = '';
				let keywordError = '';
				console.log(result); 
				keywordError = result.data.type;
				if (keywordError === "success") {
					message1 = result.data.data.message; 
					console.log(message1);
					resetForm();
				} else if (keywordError === "error") {
					message1 = result.data.data.error; 
					console.log(message1);
				}
				showMessage(message1, keywordError);
			};
		}}>
			<div class="mt-3">
				{#if errorMessage === "success"}
					<div class="text-center bg-green-100 text-green-700 py-2 mb-4 rounded-md">
						{successMessage}
					</div>
				{:else if errorMessage === 'error'}
					<div class="text-center bg-red-100 text-red-700 py-2 mb-4 rounded-md">
						{successMessage}
					</div>
				{/if}
			</div>
			<section class="flex flex-col md:flex-row p-2">
				<div class="md:w-2/5 p-0 md:ml-10 mt-0 ">
					<div class="flex items-start mt-6 ml-4">
						<Icon icon="prime:phone" class="text-primary-500 w-6 h-6 mr-2" />
						<div>
							<p class="text-lg mb-2 font-semibold">Phone Number</p>
							<div class="text-base">7829922222</div>
						</div>
					</div>
					<hr class="my-2 " />
					<div class="flex items-start mt-6 ml-4">
						<Icon icon="mdi-light:email" class="text-primary-500 w-6 h-6 mr-2" />
						<div>
							<p class="text-lg mb-2 font-semibold">Email</p>
							<div class="text-base">chemikart@gmail.com</div>
						</div>
					</div>
					<hr class="my-2" />
					<div class="flex items-start mt-6 ml-4">
						<Icon icon="ep:location" class="text-primary-500 w-6 h-6 mr-2" />
						<div>
							<p class="text-lg mb-2 font-semibold">Location</p>
							<div class="text-base">Bengaluru</div>
						</div>
					</div>
				</div>
				<div class="md:w-3/5 md:mr-10 md:ml-10 mr-0 p-0">
					<div class="p-0 sm:p-0 md:p-0">
						<div class="mt-5">
							<h2 class="text-xl text-gray-700 font-semibold">Send a Message</h2>
							<p class="text-gray-700 mt-3 mb-3">We’d love to hear from you! Send us a message, and let’s stay connected.</p>
						</div>
						<div class="flex flex-col md:flex-row md:space-x-4">
							<div class="flex-1 mb-4">
								<input type="text" name="name" id="name" bind:value={name} class="flex w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="User Name" />
								{#if showErrors && name.length === 0}
									<span class="text-red-400 text-xs">Name is required</span>
								{/if}
								{#if name.length > 0 && !/^[A-Za-z\s]+$/.test(name)}
									<span class="text-red-400 text-xs">Name cannot contain numbers or special characters</span>
								{/if}
							</div>
						</div>
						<div class="flex flex-col md:flex-row md:space-x-4">
							<div class="flex-1 mb-4">
								<input type="text" name="email" id="email" bind:value={email} class="block w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Email" />
								{#if showErrors && email.length === 0}
									<span class="text-red-400 text-xs">Email is required</span>
								{/if}
								{#if email.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)}
									<span class="text-red-400 text-xs">Please enter a valid email address.</span>
								{/if}
							</div>
						</div>
						<div class="flex flex-col md:flex-row md:space-x-4">
							<div class="flex-1 mb-4">
								<input type="tel" name="phone" id="phone" bind:value={phone} class="block w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Phone" />
								{#if showErrors && phone.length === 0}
									<span class="text-red-400 text-xs">Phone number is required</span>
								{/if}
								{#if phone.length > 0 && !/^\+?[0-9]{10}$/.test(phone)}
									<span class="text-red-400 text-xs">Please enter a valid phone number.</span>
								{/if}
							</div>
							<div class="flex-1 mb-4">
								<input type="text" name="subject" id="subject" bind:value={subject} class="block w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Subject" />
								{#if showErrors && subject.length === 0}
									<span class="text-red-400 text-xs">Subject is required</span>
								{/if}
							</div>
						</div>
						<div class="flex-1 mb-4">
							<textarea name="message" id="message" bind:value={message} class="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:shadow-none focus:ring-0 placeholder-gray-400 mb-4 h-32" placeholder="Message"></textarea>
							{#if showErrors && message.length === 0}
								<span class="text-red-400 text-xs">Message is required</span>
							{/if}
						</div>
						<input type="hidden" name="status" value="unread" />
						<div class="flex-1 mb-4 sm:mt-0">
							<button type="submit" on:click={handleSubmit} class="px-5 py-2 bg-primary-500 text-white rounded-lg transition duration-300 hover:bg-primary-300 sm:w-auto">Send Message</button>
						</div>
					</div>
				</div>
			</section>
		</form>
	</div>
</section>