<script>
	import Icon from '@iconify/svelte';
  </script>

  <div class="min-h-[80%] overflow-hidden bg-gray-50 to-primary-900 relative md:mb-20">
	<div class="absolute top-1/4 md:left-10 left-2 lg:w-72 w-20 lg:h-80 h-20 bg-primary-100 blur-sm clip-hexagon shadow"></div>
	<div class="absolute bottom-2 md:right-12 right-4 lg:w-40 w-20 lg:h-40 h-20 bg-primary-100 clip-hexagon"></div>
	<div class="absolute top-0 md:right-12 right-4  md:w-20 w-10 md:h-20 h-10 bg-primary-200 clip-hexagon"></div>
	<div class="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative z-10">
	  <div class=" p-8 max-w-lg w-full mx-auto">
		<div class="text-center">
		  <div class="flex justify-center mb-6">
			<div class="h-24 w-24 bg-primary-100 rounded-full shadow-md flex items-center justify-center">
				<Icon icon="carbon:warning-hex" class="text-5xl text-primary-600" />
			</div>
		  </div>
		  <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 text-primary-600">
			503
		  </h1>
		  <h2 class="text-xl sm:text-2xl font-bold mb-3 text-gray-800">
			Service Unavailable
		  </h2>
		  <p class="text-base sm:text-lg font-medium mb-6 text-gray-600 max-w-md mx-auto">
			Our servers are experiencing high traffic. <br> Please try again later.
		  </p>
		  <div class="flex justify-center">
			<a href="/"
			  class="inline-flex text-base bg-primary-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-primary-600 transition-colors duration-300">
			  <Icon icon="mdi:home" class="text-xl mr-2" />
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