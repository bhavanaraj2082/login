<script>

  function handleMoreClick() {
    
    console.log('More button clicked');
  }
</script>

<div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Left Side Image -->
    <div class="">
      <img 
        src="/about.png"
        alt="A visual representation of Chemicart's mission to provide high-quality chemicals and laboratory supplies"
        class="w-full h-60 sm:h-80"
      >
    </div>

    <!-- Right Side Text Content -->
    <div>
      <h2 class="text-2xl lg:text-3xl font-bold text-gray-800">Learn About Us And What Sets Us Apart</h2>
      <p class="mt-5 text-md lg:text-lg text-gray-500">
        At Chemicart, we are committed to providing high-quality chemicals and laboratory supplies
        to empower scientists and researchers in their pursuits. Our mission is rooted in safety,
        reliability, and innovation, ensuring that our customers have access to the best products available.
      </p>
      <button
        on:click={handleMoreClick}
        class="mt-4 px-8 py-1 bg-primary-400 text-primary-50 text-lg font-semibold  transition duration-300"
      >
        More
      </button>
    </div>
  </div>
</div>
