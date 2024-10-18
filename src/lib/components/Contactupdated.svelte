<script>
    import Icon from '@iconify/svelte';

    let name = '';
    let email = '';
    let phone = '';
    let subject = '';
    let message = '';
    let formSubmitted = false;
    let formValid = true;
    let showErrors = false;
    let errorMessage = '';

    async function handleSubmit(event) {
        event.preventDefault();

        formValid = true;
        showErrors = false;
        errorMessage = '';

        
        if (
            phone.length === 0 ||
            email.length === 0 ||
            name.length === 0 ||
            message.length === 0 ||
            subject.length === 0
        ) {
            console.log('Validation failed: Missing required fields');
            formValid = false;
            showErrors = true;
            errorMessage = 'Please fill in all required fields correctly.';
            return;
        }

        
        try {
            const response = await fetch('/contact', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phone, subject, message }),
            });

            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Server response:', result);

            if (result.success) {
                formSubmitted = true;
                
                name = '';
                email = '';
                phone = '';
                subject = '';
                message = '';
                showErrors = false;
            } else {
                errorMessage = result.error || "An unexpected error occurred.";
                formValid = false;
                showErrors = true;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            errorMessage = error.message || 'An error occurred while submitting the form.';
            showErrors = true;
        }
    }
</script>

<div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold bg-primary-400 text-white py-4 pl-4 rounded-t-lg">
        Get in Touch with Us
    </h1>

    <form on:submit={handleSubmit} class="flex flex-col md:flex-row border border-gray-300 bg-white overflow-hidden">
        <div class="flex-none w-full md:w-1/3 md:mr-4 p-4">
            <div class="mt-2 text-gray-700">
                <div class="flex items-start mt-6 ml-4">
                    <Icon icon="prime:phone" class="text-primary-400 w-6 h-6 mr-2" />
                    <div>
                        <p class="text-lg mb-2 font-semibold">Phone Number</p>
                        <div class="text-lg">7829922222</div>
                    </div>
                </div>
                <hr class="my-2" />
                <div class="flex items-start mt-6 ml-4">
                    <Icon icon="mdi-light:email" class="text-primary-500 w-6 h-6 mr-2" />
                    <div>
                        <p class="text-lg mb-2 font-semibold">Email</p>
                        <div class="text-lg">chemikart@gmail.com</div>
                    </div>
                </div>
                <hr class="my-2" />
                <div class="flex items-start mt-6 ml-4">
                    <Icon icon="ep:location" class="text-primary-400 w-6 h-6 mr-2" />
                    <div>
                        <p class="text-lg mb-2 font-semibold">Location</p>
                        <div class="text-lg">Bengaluru</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex-1 mb-6 p-4">
            <div class="block md:hidden mb-6">
                <h2 class="text-xl text-gray-700 font-semibold">Send a Message</h2>
                <p class="text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>

            <div class="hidden md:block">
                <h2 class="text-xl text-gray-700 font-semibold">Send a Message</h2>
                <p class="text-gray-700">We’d love to hear from you! Send us a message, and let’s stay connected.</p>
            </div>

            <div class="mt-7 flex flex-col md:flex-row md:gap-4">
                <input type="text" name="name" bind:value={name} class="block w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-orange-200 focus:shadow-none focus:ring-0 placeholder-gray-400 mb-4 md:mb-0" placeholder="Your Name" required />
                {#if showErrors && name.length === 0}
                    <span class="text-red-400 text-xs">Name is required</span>
                {/if}
                <input type="email" name="email" bind:value={email} class="block w-full border border-gray-300 p-2 rounded-xl focus:outline-none focus:border-orange-200 focus:shadow-none focus:ring-0 placeholder-gray-400" placeholder="Email" required />
                {#if showErrors && email.length === 0}
                    <span class="text-red-400 text-xs">Email is required</span>
                {/if}
                {#if email.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)}
                    <span class="text-red-400 text-xs">Please enter a valid email address.</span>
                {/if}
            </div>

            <div class="mt-4 flex flex-col md:flex-row md:gap-4">
                <input type="text" name="phone" placeholder="Phone Number" bind:value={phone} class="flex-1 p-2 border border-gray-300 rounded-lg mb-4 md:mb-0" required />
                <input type="text" name="subject" placeholder="Subject" bind:value={subject} class="flex-1 p-2 border border-gray-300 rounded-lg mb-4 md:mb-0" required />
            </div>
            <div class="mt-4">
                <textarea name="message" placeholder="Message" bind:value={message} class="w-full p-2 border border-gray-300 rounded-lg mb-4 h-32" required></textarea>
            </div>
            <div class="w-full flex">
                <button type="submit" class="px-5 py-2 bg-primary-400 text-white rounded-lg transition duration-300 hover:bg-primary-600 sm:w-auto">Send Message</button>
            </div>
            {#if showErrors}
                <div class="text-red-500 text-xs mt-2">{errorMessage}</div>
            {/if}
            {#if formSubmitted} 
                <div class="text-green-500 text-xs mt-2">Your message has been sent successfully!</div>
            {/if}
        </div>
    </form>
</div>