<script>
  export let data;
  console.log(data, "quotesPage1");

  import Qoutes from "$lib/components/ChemikartQoutes/Customsolution.svelte";
  import Qoutes1 from "$lib/components/ChemikartQoutes/Customformat.svelte";
  import Qoutes2 from "$lib/components/ChemikartQoutes/Configurecustom.svelte";
  import Qoutes3 from "$lib/components/ChemikartQoutes/Additionalnotes.svelte";
  import Qoutes4 from "$lib/components/ChemikartQoutes/Customerdetails.svelte";
  import Qoutes5 from "$lib/components/ChemikartQoutes/Deliveryinformation.svelte";
  import Qoutes6 from "$lib/components/ChemikartQoutes/Qoutesview.svelte";
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

<div class="w-11/12 mx-auto max-w-7xl border rounded rounded-t-xl bg-white mb-6">
  {#if currentView === "qoutes"}
  <div class="w-full mx-auto max-w-7xl border rounded-t-lg mb-10">
    <h1 class="sm:text-2xl text-sm font-bold bg-primary-400 text-white py-4 pl-4 rounded-t-lg">
      Let us know what you need and we'll help you get Quotes
    </h1>
    </div>
    <div class="px-4">
      <Qoutes tag={toggleQoutes1} />
    </div>
  {/if}

  {#if currentView === "qoutes1"}
  <div class="w-full mx-auto max-w-7xl border rounded-t-lg">
    <h1 class="sm:text-2xl text-sm font-bold bg-primary-400 text-white py-4 pl-4 rounded-t-lg">
      Let us know what you need and we'll help you get Quotes
    </h1>
    </div>
    <div class="px-4">
    <Qoutes1 tog={toggleQoutes} tog1={toggleQoutes2} />
    </div>
  {/if}

  {#if currentView === "qoutes2"}
  <div class="w-full mx-auto max-w-7xl border rounded-t-lg">
    <h1 class="sm:text-2xl text-sm font-bold bg-primary-400 text-white py-4 pl-4 rounded-t-lg">
      Let us know what you need and we'll help you get Quotes
    </h1>
    </div>
    <div class="px-4">
    <Qoutes2 tog={toggleQoutes} tog1={toggleQoutes1} tog2={toggleQoutes3} />
    </div>
  {/if}

  {#if currentView === "qoutes3"}
  <div class="w-full mx-auto max-w-7xl border rounded-t-lg">
    <h1 class="sm:text-2xl text-sm font-bold bg-primary-400 text-white py-4 pl-4 rounded-t-lg">
      Let us know what you need and we'll help you get Quotes
    </h1>
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
  <div class="w-full mx-auto max-w-7xl border rounded-t-lg">
    <h1 class="sm:text-2xl text-sm font-bold bg-primary-400 text-white py-4 pl-4 rounded-t-lg">
      Let us know what you need and we'll help you get Quotes
    </h1>
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
  <div class="w-full mx-auto max-w-7xl border rounded-t-lg">
    <h1 class="sm:text-2xl text-sm font-bold bg-primary-400 text-white py-4 pl-4 rounded-t-lg">
      Let us know what you need and we'll help you get Quotes
    </h1>
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
