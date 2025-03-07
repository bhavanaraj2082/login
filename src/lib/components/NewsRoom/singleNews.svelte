<script>
    export let data;
    const { singleNewsData } = data;  // Extract single news data
    console.log(singleNewsData);
    
    // Function to convert newline characters to <br> tags for HTML rendering
    const formatText = (text) => {
      return text.split('\n').map(item => item + "<br>").join('');
    };
  </script>
  
  <div class="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg w-full md:w-11/12">
    <!-- Title -->
    <h1 class="text-4xl font-bold text-gray-800 mb-4">{singleNewsData.title}</h1>
  
    <!-- Image -->
    <div class="mb-6">
      <img src={`/path/to/images/${singleNewsData.image}`} alt={singleNewsData.title} class="w-full h-40 object-cover rounded-lg mb-4" />
    </div>
  
    <!-- Full Content -->
    <div class="text-lg text-gray-800">
      {@html formatText(singleNewsData.previewText)}
    </div>
  
    <!-- Optional: Add a link to go back to the list of news -->
    <div class="mt-8">
      <a href="/newsroom" class="text-blue-500 hover:underline">Back to News</a>
    </div>
  </div>
  