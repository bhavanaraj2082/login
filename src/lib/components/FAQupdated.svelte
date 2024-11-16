<script>
	import Icon from '@iconify/svelte';
	import { sections } from '$lib/data/Faqdata.json';
	
	let activeIndex = 0;
	let expandedFAQIndex = Array(sections.length).fill(null);
  
	function selectSection(sectionIndex) {
	  activeIndex = sectionIndex;
	}
    
	function toggleFAQ(index) {
	  expandedFAQIndex[activeIndex] = expandedFAQIndex[activeIndex] === index ? null : index;
	}
</script>
<section>
    <div class="w-11/12 max-w-7xl mx-auto p-0 px-0 border-gray-200 bg-white sm:p-4 sm:px-8">
        <h1 class="lg:text-4xl md:text-3xl sm:text-2xl text-xl  font-bold text-gray-700 mb-6 sm:mb-4 md:mb-8 lg:mb-12 ml-2 sm:ml-2 md:ml-2 lg:ml-0">
          Frequently Asked Questions
        </h1>
        <div class="flex gap-3 mb-4 mx-2 sm:mx-2 md:mx-2 lg:mx-0">
        	{#each sections as { title }, index}
        	    <button
        		    class={`flex flex-wrap justify-center items-center p-2 w-32 ${activeIndex === index ? ' font-semibold  bg-white'  : 'bg-primary-100'}`}
        		    on:click={() => selectSection(index)}
        	    >   
        		{title}
                {#if activeIndex === index}
                    <hr class="w-24 h-1 bg-primary-500 mt-1 transition-all duration-300 ease-in-out">
                {/if}
                </button> 
        	{/each}
          </div>
        <div>
            <div class="py-2">
            	{#if sections[activeIndex]}
            	    <div class="space-y-3 ">
            	    	{#each sections[activeIndex].faqs as { question, answer1,answer2 }, index}
            	    	  <div class="relative shadow-md rounded-md p-4">
            	    		<div
            	    		  class="flex items-center justify-between cursor-pointer bg-white p-1 ps-3 mx-auto"
            	    		  on:click={() => toggleFAQ(index)}
            	    		>
            	    		  <h3 class="text-sm text-gray-700 font-semibold">{question}</h3>
            	    		  <Icon
            	    			icon="solar:alt-arrow-down-bold"
            	    			width="1.4em"
            	    			height="1.4em"
            	    			class={`mr-3 min-w-10 transition-transform duration-400 ${expandedFAQIndex[activeIndex] === index ? 'rotate-180' : ''}`}
            	    		  />
            	    		</div>
            	    		{#if expandedFAQIndex[activeIndex] === index}
            	    		  <div class="p-2 ps-3 pb-3 text-xs">
            	    			<p class="pb-2">{answer1}</p>
                            <p>{answer2}</p>
            	    		  </div>
            	    		{/if}
            	    	  </div>
            	    	{/each}
            	    </div>
            	{/if}
            </div>
        </div>
    </div>
</section>
  