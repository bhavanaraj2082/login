<script>
	import Icon from "@iconify/svelte";
  export let data;
  console.log(data, "quotesPage1");

  import Qoutes from "$lib/components/ChemikartQoutes/Customsolution.svelte";
  import Qoutes1 from "$lib/components/ChemikartQoutes/Customformat.svelte";
  import Qoutes2 from "$lib/components/ChemikartQoutes/Configurecustom.svelte";
  import Qoutes3 from "$lib/components/ChemikartQoutes/Additionalnotes.svelte";
  import Qoutes4 from "$lib/components/ChemikartQoutes/Customerdetails.svelte";
  import Qoutes5 from "$lib/components/ChemikartQoutes/Deliveryinformation.svelte";
  import Qoutes6 from "$lib/components/ChemikartQoutes/Qoutesview.svelte";
  import { resetFormData , isCleared } from  '$lib/stores/solution_stores.js';
  let currentView = "qoutes"; // Initialize to show Qoutes by default
  const toggleQoutes = () => {
    currentView = currentView === "qoutes" ? null : "qoutes";
  };

  const toggleQoutes1 = () => {
    currentView = currentView === "qoutes1" ? null : "qoutes1";
  };

  const toggleQoutes2 = () => {
    currentView = currentView === "qoutes2" ? null : "qoutes2";
  };
  const toggleQoutes3 = () => {
    currentView = currentView === "qoutes3" ? null : "qoutes3";
  };
  const toggleQoutes4 = () => {
    currentView = currentView === "qoutes4" ? null : "qoutes4";
  };
  const toggleQoutes5 = () => {
    currentView = currentView === "qoutes5" ? null : "qoutes5";
  };

  const toggleQoutes6 = () => {
    currentView = currentView === "qoutes6" ? null : "qoutes6";
  };
</script>

<div class="w-11/12 mx-auto max-w-7xl border rounded rounded-t-xl bg-white mb-6 shadow-md">
  {#if currentView === "qoutes"}
  <div class="w-full mx-auto max-w-7xl rounded-t-lg mb-10">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full sm:w-2/3 p-6">
        <h1 class="sm:text-2xl text-sm font-bold text-black rounded-t-lg">
          Custom solution quote request
        </h1>
        <p class="py-1 pb-2 font-medium sm:text-xs text-2s">
          Our skilled teams and cutting-edge facilities specialize in delivering tailored organic smart solutions and custom inorganic reference materials, allowing you to specify your exact needs at the required quality level, ensuring precise production to meet your specifications.
        </p>
        <!-- <button 
          class="sm:text-sm text-xs font-semibold text-primary-500 hover:text-primary-600"
          on:click={resetFormData}>
          {$isCleared ? "You can edit from the start" : "Clear your form"}
        </button> -->
      </div>
      <div class="w-full sm:w-1/3 rounded-md bg-primary-100 m-5 mx-auto p-4 mr-5 text-left sm:block hidden">
        <h1 class="pb-2 sm:text-lg text-sm font-bold text-description">
          Need help?
        </h1>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:phone" class="text-lg text-description" /> 
          <a href="tel:7829922222" class="hover:text-primary-500">7829922222</a>
        </p>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:email" class="text-lg text-description" /> 
          <a href="mailto:sales@chemikart.com" class="hover:text-primary-500">sales@chemikart.com</a>
        </p>
      </div>
    </div>
  </div>
  
  
    <div class="px-4">
      <Qoutes tag={toggleQoutes1} />
    </div>
  {/if}

  {#if currentView === "qoutes1"}
  <div class="w-full mx-auto max-w-7xl rounded-t-lg mb-10">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full sm:w-2/3 p-6">
        <h1 class="sm:text-2xl text-sm font-bold text-black rounded-t-lg">
          Custom solution quote request
        </h1>
        <p class="py-1 pb-2 font-medium sm:text-xs text-2s">
          Our skilled teams and cutting-edge facilities specialize in delivering tailored organic smart solutions and custom inorganic reference materials, allowing you to specify your exact needs at the required quality level, ensuring precise production to meet your specifications.
        </p>
        <button 
          class="sm:text-sm text-xs font-semibold text-primary-500 hover:text-primary-600"
          on:click={resetFormData}>
          {$isCleared ? "You can edit from the start" : "Clear your form"}
        </button>
      </div>
      <div class="w-full sm:w-1/3 rounded-md bg-primary-100 m-5 mx-auto p-4 mr-5 text-left sm:block hidden">
        <h1 class="pb-2 sm:text-lg text-sm font-bold text-description">
          Need help?
        </h1>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:phone" class="text-lg text-description" /> 
          <a href="tel:7829922222" class="hover:text-primary-500">7829922222</a>
        </p>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:email" class="text-lg text-description" /> 
          <a href="mailto:sales@chemikart.com" class="hover:text-primary-500">sales@chemikart.com</a>
        </p>
      </div>
    </div>
  </div>
    <div class="px-4">
    <Qoutes1 tog={toggleQoutes} tog1={toggleQoutes2} />
    </div>
  {/if}

  {#if currentView === "qoutes2"}
  <div class="w-full mx-auto max-w-7xl rounded-t-lg mb-10">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full sm:w-2/3 p-6">
        <h1 class="sm:text-2xl text-sm font-bold text-black rounded-t-lg">
          Custom solution quote request
        </h1>
        <p class="py-1 pb-2 font-medium sm:text-xs text-2s">
          Our skilled teams and cutting-edge facilities specialize in delivering tailored organic smart solutions and custom inorganic reference materials, allowing you to specify your exact needs at the required quality level, ensuring precise production to meet your specifications.
        </p>
        <button 
          class="sm:text-sm text-xs font-semibold text-primary-500 hover:text-primary-600"
          on:click={resetFormData}>
          {$isCleared ? "You can edit from the start" : "Clear your form"}
        </button>
      </div>
      <div class="w-full sm:w-1/3 rounded-md bg-primary-100 m-5 mx-auto p-4 mr-5 text-left sm:block hidden">
        <h1 class="pb-2 sm:text-lg text-sm font-bold text-description">
          Need help?
        </h1>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:phone" class="text-lg text-description" /> 
          <a href="tel:7829922222" class="hover:text-primary-500">7829922222</a>
        </p>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:email" class="text-lg text-description" /> 
          <a href="mailto:sales@chemikart.com" class="hover:text-primary-500">sales@chemikart.com</a>
        </p>
      </div>
    </div>
  </div>
    <div class="px-4">
    <Qoutes2 tog={toggleQoutes} tog1={toggleQoutes1} tog2={toggleQoutes3} />
    </div>
  {/if}

  {#if currentView === "qoutes3"}
  <div class="w-full mx-auto max-w-7xl rounded-t-lg mb-10">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full sm:w-2/3 p-6">
        <h1 class="sm:text-2xl text-sm font-bold text-black rounded-t-lg">
          Custom solution quote request
        </h1>
        <p class="py-1 pb-2 font-medium sm:text-xs text-2s">
          Our skilled teams and cutting-edge facilities specialize in delivering tailored organic smart solutions and custom inorganic reference materials, allowing you to specify your exact needs at the required quality level, ensuring precise production to meet your specifications.
        </p>
        <button 
          class="sm:text-sm text-xs font-semibold text-primary-500 hover:text-primary-600"
          on:click={resetFormData}>
          {$isCleared ? "You can edit from the start" : "Clear your form"}
        </button>
      </div>
      <div class="w-full sm:w-1/3 rounded-md bg-primary-100 m-5 mx-auto p-4 mr-5 text-left sm:block hidden">
        <h1 class="pb-2 sm:text-lg text-sm font-bold text-description">
          Need help?
        </h1>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:phone" class="text-lg text-description" /> 
          <a href="tel:7829922222" class="hover:text-primary-500">7829922222</a>
        </p>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:email" class="text-lg text-description" /> 
          <a href="mailto:sales@chemikart.com" class="hover:text-primary-500">sales@chemikart.com</a>
        </p>
      </div>
    </div>
  </div>
    <div class="px-4">
    <Qoutes3
      tog={toggleQoutes}
      tog1={toggleQoutes1}
      tog2={toggleQoutes2}
      tog3={toggleQoutes4}
    />
    </div>
  {/if}

  <!-- {#if currentView === 'qoutes4'}
  <Qoutes4 tog={toggleQoutes} tog1={toggleQoutes1} tog2={toggleQoutes2} tog3={toggleQoutes3} tog4={toggleQoutes5}/>
  {/if} -->
  {#if currentView === "qoutes4"}
  <div class="w-full mx-auto max-w-7xl rounded-t-lg mb-10">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full sm:w-2/3 p-6">
        <h1 class="sm:text-2xl text-sm font-bold text-black rounded-t-lg">
          Custom solution quote request
        </h1>
        <p class="py-1 pb-2 font-medium sm:text-xs text-2s">
          Our skilled teams and cutting-edge facilities specialize in delivering tailored organic smart solutions and custom inorganic reference materials, allowing you to specify your exact needs at the required quality level, ensuring precise production to meet your specifications.
        </p>
        <button 
          class="sm:text-sm text-xs font-semibold text-primary-500 hover:text-primary-600"
          on:click={resetFormData}>
          {$isCleared ? "You can edit from the start" : "Clear your form"}
        </button>
      </div>
      <div class="w-full sm:w-1/3 rounded-md bg-primary-100 m-5 mx-auto p-4 mr-5 text-left sm:block hidden">
        <h1 class="pb-2 sm:text-lg text-sm font-bold text-description">
          Need help?
        </h1>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:phone" class="text-lg text-description" /> 
          <a href="tel:7829922222" class="hover:text-primary-500">7829922222</a>
        </p>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:email" class="text-lg text-description" /> 
          <a href="mailto:sales@chemikart.com" class="hover:text-primary-500">sales@chemikart.com</a>
        </p>
      </div>
    </div>
  </div>
    <div class="px-4">
    <Qoutes4
      tog={toggleQoutes}
      tog1={toggleQoutes1}
      tog2={toggleQoutes2}
      tog3={toggleQoutes3}
      tog4={toggleQoutes5}
      {data}
    />
    </div>
  {/if}

  {#if currentView === "qoutes5"}
  <div class="w-full mx-auto max-w-7xl rounded-t-lg mb-10">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="w-full sm:w-2/3 p-6">
        <h1 class="sm:text-2xl text-sm font-bold text-black rounded-t-lg">
          Custom solution quote request
        </h1>
        <p class="py-1 pb-2 font-medium sm:text-xs text-2s">
          Our skilled teams and cutting-edge facilities specialize in delivering tailored organic smart solutions and custom inorganic reference materials, allowing you to specify your exact needs at the required quality level, ensuring precise production to meet your specifications.
        </p>
        <button 
          class="sm:text-sm text-xs font-semibold text-primary-500 hover:text-primary-600"
          on:click={resetFormData}>
          {$isCleared ? "You can edit from the start" : "Clear your form"}
        </button>
      </div>
      <div class="w-full sm:w-1/3 rounded-md bg-primary-100 m-5 mx-auto p-4 mr-5 text-left sm:block hidden">
        <h1 class="pb-2 sm:text-lg text-sm font-bold text-description">
          Need help?
        </h1>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:phone" class="text-lg text-description" /> 
          <a href="tel:7829922222" class="hover:text-primary-500">7829922222</a>
        </p>
        <p class="flex items-center gap-2">
          <Icon icon="mdi:email" class="text-lg text-description" /> 
          <a href="mailto:sales@chemikart.com" class="hover:text-primary-500">sales@chemikart.com</a>
        </p>
      </div>
    </div>
  </div>
    <div class="px-4">
    <Qoutes5
      tog={toggleQoutes}
      tog1={toggleQoutes1}
      tog2={toggleQoutes2}
      tog3={toggleQoutes3}
      tog4={toggleQoutes4}
      tog5={toggleQoutes6}
    />
    </div>
  {/if}

  {#if currentView === "qoutes6"}
  <div class="px-4 pt-5">
    <Qoutes6
      tog={toggleQoutes}
      tog1={toggleQoutes1}
      tog2={toggleQoutes2}
      tog3={toggleQoutes3}
      tog4={toggleQoutes4}
      tog5={toggleQoutes5}
    />
    </div>
  {/if}
</div>
