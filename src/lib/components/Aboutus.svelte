<script>
  function handleMoreClick() {
    
    console.log('More button clicked');
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
    <!-- Left Side Image -->
    <div class="flex-shrink-0">
      <img 
        src="/aboutus.png"  
        alt="A visual representation of Chemicart's mission to provide high-quality chemicals and laboratory supplies"
        class="w-full max-w-md rounded-lg shadow-lg"
      >
    </div>

    <!-- Right Side Text Content -->
    <div class="mt-8 lg:mt-0 lg:ml-10">
      <h2 class="text-3xl font-bold text-gray-800">Learn About Us And What Sets Us Apart</h2>
      <p class="mt-4 text-lg text-gray-500">
        At Chemicart, we are committed to providing high-quality chemicals and laboratory supplies
        to empower scientists and researchers in their pursuits. Our mission is rooted in safety,
        reliability, and innovation, ensuring that our customers have access to the best products available.
      </p>
      <button
        on:click={handleMoreClick}
        class="mt-6 px-6 py-3 bg-red-400 text-white text-lg font-semibold rounded-md hover:bg-red-500 transition duration-300"
      >
        More
      </button>
    </div>
  </div>
</div>
