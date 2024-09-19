<script>
  const videoUrl = "https://www.youtube.com/watch?v=GvvzPwifXzk";
  const embedUrl = "https://www.youtube.com/embed/GvvzPwifXzk";
</script>

<div class="flex flex-col md:flex-row-reverse mt-8  mb-10 md:px-8">
  <div class="flex-1 md:p-4 p-2">
    <iframe
      class="w-full h-64 md:h-full lazyload--blur-up-effect"
      src={embedUrl}
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
  <div class="flex-1 p-4 md:pl-4 md:mt-0 mt-4">
    <h3 class="text-2xl font-bold">Our state-of-the-art facilities</h3>
    <p class="mt-2 text-gray-700">
      We have invested in a highly specified distribution hub in the heart of
      Germany, to guarantee consistently high quality in our products and
      services to our customers.
    </p>
    <a
      href={videoUrl}
      class="mt-4 inline-block px-4 py-2 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600"
    >
      Step inside
    </a>
  </div>
</div>
