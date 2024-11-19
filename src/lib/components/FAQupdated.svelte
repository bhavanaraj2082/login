<script>
  import Icon from "@iconify/svelte";
  import { sections } from "$lib/data/Faqdata.json";
    
  let activeIndex = 0;
  let expandedFAQIndex = Array(sections.length).fill(null);
    
  function selectSection(sectionIndex) {
    activeIndex = sectionIndex;
  }
    
  function toggleFAQ(index) {
    expandedFAQIndex[activeIndex] = 
      expandedFAQIndex[activeIndex] === index ? null : index;
  }
</script>
<section class="m-3">
  <div>
    <div class="pt-5 sm:p-4 w-11/12 max-w-7xl mx-auto">
      <h1 class="sm:text-2xl text-xl font-bold text-gray-700 mb-6 sm:mb-4 md:mb-8 lg:mb-12 sm:ml-2 md:ml-2 lg:ml-0">
        Frequently Asked Questions
      </h1>        
      <div class="flex gap-3 mb-4 sm:mx-2 lg:mx-0 relative">
        {#each sections as { title }, index}
          <div class="relative w-32">
            <button
              class={`flex flex-col justify-center items-center rounded p-2 w-full pb-4 relative ${
                activeIndex === index ? "font-semibold bg-white" : "bg-primary-200"
              }`}
              on:click={() => selectSection(index)}
              style="transition: background-color 0.3s, transform 0.3s;">
              {title}
            </button>
            {#if activeIndex === index}
              <div
                class="absolute bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-primary-500 rounded"
                style="transition: width 0.3s ease, transform 0.3s ease;"/>
            {/if}
          </div>
        {/each}
      </div>      
      <div>
        <div class="py-6">
          {#if sections[activeIndex]}
            <div class="space-y-3">
              {#each sections[activeIndex].faqs as { question, answer1, answer2 }, index}
                <div class="relative shadow-md rounded-md p-4">
                  <div
                    class="flex items-center justify-between cursor-pointer p-1 ps-3 mx-auto"
                    on:click={() => toggleFAQ(index)}>
                    <h3 class="text-sm text-gray-700 font-semibold">
                      {question}
                    </h3>
                    <Icon
                      icon="solar:alt-arrow-down-bold"
                      width="1.4em"
                      height="1.4em"
                      class={`mr-3 min-w-10 transition-transform duration-400 ${
                        expandedFAQIndex[activeIndex] === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {#if expandedFAQIndex[activeIndex] === index}
                    <div class="p-2 ps-3 pb-3">
                      <p class="pb-2 text-sm">{answer1}</p>
                      <p class="text-sm">{answer2}</p>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>