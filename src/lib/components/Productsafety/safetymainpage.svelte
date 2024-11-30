<script>
    import Safetydata1 from "$lib/components/Productsafety/safetydata1.svelte";
    import Safetydata2 from "$lib/components/Productsafety/safetydata2.svelte";
    import Safetydata3 from "$lib/components/Productsafety/safetydata3.svelte";
    import Safetydata4 from "$lib/components/Productsafety/safetydata4.svelte";
    
    let selectedTopic = "understandingProductLabels";
    
    const topics = [
      { id: "understandingProductLabels", name: "Understanding Product Labels", component: Safetydata1 },
      { id: "globallyHarmonizedSystem", name: "Globally Harmonized System", component: Safetydata2 },
      { id: "tsca8Notification", name: "TSCA 8 Notification", component: Safetydata3 },
      { id: "hazardAndPrecautionaryStatements", name: "Hazard and Precautionary Statements", component: Safetydata4 },
    ];

    function selectTopic(topicId) {
      selectedTopic = topicId;
    }
</script>

<div class="w-11/12 mx-auto">
  <div class="flex flex-col md:flex-row">
    <div class="w-full md:w-1/4 h-fit p-4 border border-gray-300 rounded-lg shadow-sm">
        <h1 class="text-xl font-semibold mb-4">Product Safety</h1>
        {#each topics as topic, i}
          <button
            class="py-2 px-4 w-full font-medium text-left cursor-pointer mb-2 transition duration-200 ease-in-out"
            class:text-primary-500={selectedTopic === topic.id}
            class:font-semibold={selectedTopic === topic.id}
            on:click={() => selectTopic(topic.id)}
          >
            {topic.name}
          </button>
          {#if i !== topics.length - 1}
            <hr class="border-gray-300 mb-2" />
          {/if}
        {/each}
      </div>
      
    <div class="w-full md:w-3/4 p-4">
      {#if selectedTopic === "understandingProductLabels"}
        <Safetydata1 />
      {:else if selectedTopic === "globallyHarmonizedSystem"}
        <Safetydata2 />
      {:else if selectedTopic === "tsca8Notification"}
        <Safetydata3 />
      {:else if selectedTopic === "hazardAndPrecautionaryStatements"}
        <Safetydata4 />
      {/if}
    </div>
  </div>
</div>
