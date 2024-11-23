<script>
  export let data;
  const subcategories = data.records;
</script>

<div class="max-w-7xl mx-auto mb-8 px-6 lg:px-8">
  <div class="pl-4">
    <p class="text-primary-400 font-semibold text-xl">
      {subcategories[0].expand.category.name}
    </p>
    <p class="mt-2 text-base text-content">
      Precision-driven laboratory chemicals perfect for research, analysis, and
      experiments, with top-tier quality and reliability.
    </p>
  </div>
  <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-8 sm:mx-0">
    {#each subcategories as subcategory}
      <div class="bg-white shadow rounded-md overflow-hidden">
        <img
          src="/subcategory/{subcategories[0].expand.category
            .name}/{subcategory.name || 'img'}.webp"
          alt="img"
          class="w-full h-60 object-center"
        />
        <div class="p-4">
          <a
            href="/products/{subcategory.expand.category
              .urlName}/{subcategory.urlName}"
          >
            <h3 class="text-lg font-semibold text-heading hover:underline">
              {subcategory.name}
            </h3>
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>
