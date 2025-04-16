<script>
    export let footerData;
  </script>
  
  <section class="bg-primary-50">
    <div class="md:w-11/12 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 px-8 gap-1 pt-4 pb-5">
        {#each footerData as item}
          <div class="text-left text-nowrap">
            <a
              href={item.link}
              class="text-heading text-xs hover:text-primary-600 hover:underline hover:underline-offset-4"
              target="_blank">
              { item.name.length > 26 ? item.name.slice(0,26) + "..." : item.name}
            </a>
          </div>
        {/each}
      </div>
    </div>
  </section>
  