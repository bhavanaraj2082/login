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

<section class="m-3 md:my-3 md:mx-0">
  <div>
    <div class="pt-0 sm:p-3 w-11/12 max-w-7xl mx-auto">
      <h1
        class="sm:text-2xl text-xl font-bold text-black mb-6 sm:mb-4 md:mb-8 lg:mb-12 sm:ml-2 md:ml-0 lg:ml-0"
      >
        Frequently Asked Questions
      </h1>
      <div class="flex gap-3 mb-4 sm:mx-2 md:ml-0 lg:mx-0 relative">
        {#each sections as { title }, index}
          <div
            class="relative w-full sm:w-32"
            bind:this={sectionElements[index]}
          >
            <button
              class={`flex flex-col justify-center items-center rounded p-2 w-full pb-4 relative ${
                activeIndex === index
                  ? "font-semibold bg-white"
                  : "bg-primary-200"
              }`}
              on:click={() => selectSection(index)}
              style="transition: background-color 0.3s, transform 0.3s;"
            >
              {title}
            </button>
          </div>
        {/each}
        <div
          class="absolute bottom-2 h-1 bg-primary-400 rounded transition-all duration-300 ease-in-out"
          bind:this={barElement}
        />
      </div>
      <div>
        <div class="py-6" bind:this={faqContainer}>
          {#if sections[activeIndex]}
            <div class="space-y-3">
              {#each sections[activeIndex].faqs as { question, answer1, answer2 }, index}
                <div
                  class="relative shadow-md rounded-md p-4 cursor-pointer border"
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
                    <h3 class="text-sm text-gray-700 font-semibold">
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
