<script>
    let name = '';
    let email = '';
    let phone = '';
    let subject = '';
    let message = '';
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const formData = {
        name,
        email,
        phone,
        subject,
        message,
      };
  
      try {
        const response = await fetch('http://127.0.0.1:8090/api/collections/5zlt6j92fsho4mk/records', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const record = await response.json();
          console.log('Form submitted:', record);
          alert('Message sent successfully!');
        } else {
          const errorData = await response.json(); 
          console.error('Error details:', errorData); 
          alert('Failed to send message. ' + (errorData.message || '')); 
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to send message.');
      }
    };
  </script>
  
  <section class="w-full py-10 flex justify-center">
    <div class="container max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  
      <div class="bg-gray-200 p-8 rounded-md shadow-md lg:w-1/3">
        <h2 class="text-lg font-bold mb-6">Get In Touch With Us</h2>
        <div class="space-y-4">
          <div>
            <span class="font-semibold">Phone Number</span>
            <p>0012334566</p><br />
            <hr class="border-t border-gray-700 w-2/2" /><br />
          </div>
          <div>
            <span class="font-semibold">Email Address</span>
            <p>Johndoe@example.com</p><br />
            <hr class="border-t border-gray-700 w-2/2" /><br />
          </div>
          <div>
            <span class="font-semibold">Location</span>
            <p>Lorem Ipsum</p><br />
          </div>
        </div>
      </div>
  
      <div class="bg-white p-8 rounded-md shadow-md lg:w-2/3">
        <h2 class="text-lg font-bold mb-6">Send us a message</h2>
        <p class="text-gray-500 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla fringilla nunc in molestie feugiat.
        </p>
  
        <form class="space-y-4" on:submit={handleSubmit}>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              class="border rounded-md p-3 w-full"
              bind:value={name}
              required
            />
            <input
              type="email"
              placeholder="Your E-mail"
              class="border rounded-md p-3 w-full"
              bind:value={email}
              required
            />
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Phone Number"
              class="border rounded-md p-3 w-full"
              bind:value={phone}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              class="border rounded-md p-3 w-full"
              bind:value={subject}
            />
          </div>
  
          <textarea
            placeholder="Message"
            class="border rounded-md p-3 w-full h-32"
            bind:value={message}
            required
          ></textarea>
  
          <button
            type="submit"
            class="bg-black text-white rounded-md px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </section>
  