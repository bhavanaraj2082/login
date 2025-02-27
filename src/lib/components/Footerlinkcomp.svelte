<script>
    export let footerData;
  </script>
  
  <section class="bg-primary-50">
    <div class="md:w-11/12 max-w-7xl mx-auto">
      <div class="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 px-8 gap-3 pt-4 pb-10">
        {#each footerData as item}
          <div class="text-left">
            <a
              href={item.link}
              class="text-heading text-sm hover:text-primary-600 hover:underline hover:underline-offset-4"
              target="_blank">
              {item.name}
            </a>
          </div>
        {/each}
      </div>
    </div>
  </section>
  