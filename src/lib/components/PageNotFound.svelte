<script>
  import Icon from '@iconify/svelte';

</script>


<div class="min-h-[80%] overflow-hidden bg-gray-50 relative max-w-7xl mx-auto md:mb-20">
  <div class="absolute top-1/4 left-10 lg:w-72 w-20 lg:h-80 h-20 bg-primary-100 blur-sm clip-hexagon shadow"></div>
  <div class="absolute bottom-2 right-40 lg:w-40 w-20 lg:h-40 h-20 bg-primary-100 clip-hexagon"></div>
  <div class="absolute top-0 md:right-20 right-6 w-20 h-20 bg-primary-200 clip-hexagon"></div>
  <div class="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative z-10">
    <div class=" p-8 max-w-lg w-full mx-auto">
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center shadow-md">
            <Icon icon="marketeq:warning-alt" class="text-5xl" />
          </div>
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-8xl font-bold mb-3 text-primary-600 animate-slow-bounce">
          Oops..!
        </h1>
        <div class="flex justify-center items-center whitespace-nowrap">
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold mb-3 text-primary-300 animate-pulse">
            404
          </h1>
          <h2 class="text-xl sm:text-2xl font-bold mb-3 ml-4 text-gray-800">
            PAGE NOT FOUND
          </h2>
        </div>
        <p class="text-md sm:text-lg font-medium mb-6 text-gray-600 max-w-md mx-auto">
          The page you are looking for may be temporarily unavailable. Please check back later.
        </p>
        <div class="flex justify-center z-50">
          <a href="/"
            class="inline-flex bg-primary-500 sm:text-base text-xs text-white font-semibold py-3 px-8 rounded-full hover:bg-primary-600 transition-colors duration-300">
            <Icon icon="mdi:home" class="sm:text-xl text-sm mr-2" />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .clip-hexagon {
    clip-path: polygon(
      50% 0%,
      100% 25%,
      100% 75%,
      50% 100%,
      0% 75%,
      0% 25%
    );
  }
</style>