<script>
  import Icon from "@iconify/svelte";
  import { sections } from "$lib/data/Faqdata.json";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { slide } from "svelte/transition";

  let activeIndex = 0;
  let expandedFAQIndex = Array(sections.length).fill(null);
  let faqContainer;
  let barElement;
  let sectionElements = [];
  const barWidth = writable(0);

  function updateBar() {
    const activeSection = sectionElements[activeIndex];
    if (activeSection) {
      const sectionWidth = activeSection.offsetWidth;
      const width = sectionWidth * 0.8;
      const barLeft =
        activeSection.offsetLeft + (activeSection.offsetWidth - width) / 2;

      if (barElement) {
        barElement.style.width = `${width}px`;
        barElement.style.left = `${barLeft}px`;
      }
      barWidth.set(width);
    }
  }

  function selectSection(sectionIndex) {
    activeIndex = sectionIndex;
    updateBar();
  }

  function toggleFAQ(index) {
    expandedFAQIndex[activeIndex] =
      expandedFAQIndex[activeIndex] === index ? null : index;
  }

  function handleClickOutside(event) {
    if (faqContainer && !faqContainer.contains(event.target)) {
      expandedFAQIndex[activeIndex] = null;
    }
  }

  onMount(() => {
    document.addEventListener("mousedown", handleClickOutside);
    updateBar();
    window.addEventListener("resize", updateBar);
  });
</script>

<section class="md:mx-0">
  <div>
    <div class="pt-0 sm:p-3 w-11/12 max-w-7xl mx-auto">
      <h1
        class="sm:text-2xl text-lg font-bold text-black mb-4 md:mb-6 lg:mb-8 sm:ml-2 md:ml-0 lg:ml-0" >
        Frequently Asked Questions
      </h1>
      <div class="sm:w-1/2 w-full lg:w-1/3 inline-flex rounded mb-2 mt-2 md:text-md text-xs">
        <nav
          aria-label="Tabs"
          class="w-full flex md:space-x-3 space-x-2 overflow-x-auto rounded-t hide">
        {#each sections as { title }, index}
      <div class="inline-block w-full" bind:this={sectionElements[index]}>
        <button on:click={() => selectSection(index)}
          class="w-full sm:py-2 py-1 sm:h-12 h-8 sm:px-2  px-1 sm:text-lg text-md focus:outline-none transition duration-300
            {activeIndex === index
            ? 'bg-primary-100 text-primary-500 font-semibold'
            : 'bg-primary-200 text-black'}
            hover:bg-primary-400 hover:text-white whitespace-nowrap">
          {title}
        </button>
        <div
        class="h-0.5 bg-primary-500 
        {activeIndex === index
          ? 'w-full '
          : 'w-0'} transition-all duration-300 ease-in-out">
          </div>
      </div>
        {/each}
        </nav>
      </div>
      <div>
        <div class="py-6" bind:this={faqContainer}>
          {#if sections[activeIndex]}
            <div class="space-y-3">
              {#each sections[activeIndex].faqs as { question, answer1, answer2 }, index}
                <div
                  class="relative shadow-md rounded-md p-4 cursor-pointer"
                  on:click={() => toggleFAQ(index)}
                  role="button"
                  tabindex="0"
                  on:keydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      toggleFAQ(index);
                    }
                  }}
                >
                  <div
                    class="flex items-center justify-between p-1 ps-3 mx-auto"
                  >
                    <h3 class="text-sm sm:text-base text-gray-700 font-semibold">
                      {question}
                    </h3>
                    <Icon
                      icon="eva:arrow-down-fill"
                      width="1.5em"
                      height="1.5em"
                      class={`sm:mr-3 min-w-10 transition-transform duration-300 text-primary-400 ${
                        expandedFAQIndex[activeIndex] === index
                          ? "rotate-180 text-primary-500"
                          : ""
                      }`}
                    />
                  </div>
                  {#if expandedFAQIndex[activeIndex] === index}
                    <div
                      class="p-2 ps-3 pb-3"
                      transition:slide={{ duration: 300 }}
                    >
                      <p class="pb-2 text-xs sm:text-sm">{answer1}</p>
                      <p class="text-xs sm:text-sm">{answer2}</p>
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
