<script>
  import Qoutes from "$lib/components/ChemikartQoutes/Customsolution.svelte";
  import Qoutes1 from "$lib/components/ChemikartQoutes/Customformat.svelte";
  import Qoutes2 from "$lib/components/ChemikartQoutes/Configurecustom.svelte";
  import Qoutes3 from "$lib/components/ChemikartQoutes/Additionalnotes.svelte";
  import Qoutes4 from "$lib/components/ChemikartQoutes/Customerdetails.svelte";
  import Qoutes5 from "$lib/components/ChemikartQoutes/Deliveryinformation.svelte";
  import Qoutes6 from "$lib/components/ChemikartQoutes/Qoutesview.svelte";
  let currentView = 'qoutes'; // Initialize to show Qoutes by default
const toggleQoutes = () => {
currentView = currentView === 'qoutes' ? null : 'qoutes';
};

const toggleQoutes1 = () => {
currentView = currentView === 'qoutes1' ? null : 'qoutes1';
};

const toggleQoutes2 = () => {
currentView = currentView === 'qoutes2' ? null : 'qoutes2';
};
const toggleQoutes3 = () => {
currentView = currentView === 'qoutes3' ? null : 'qoutes3';
};
const toggleQoutes4 = () => {
currentView = currentView === 'qoutes4' ? null : 'qoutes4';
};
const toggleQoutes5 = () => {
currentView = currentView === 'qoutes5' ? null : 'qoutes5';
};

const toggleQoutes6 = () => {
currentView = currentView === 'qoutes6' ? null : 'qoutes6';
};
</script>
<div class="p-4 w-11/12 mx-auto max-w-7xl">
  {#if currentView === 'qoutes'}
    <Qoutes tag={toggleQoutes1} />
  {/if}

  {#if currentView === 'qoutes1'}
    <Qoutes1 tog={toggleQoutes} tog1={toggleQoutes2} />
  {/if}

  {#if currentView === 'qoutes2'}
    <Qoutes2 tog={toggleQoutes} tog1={toggleQoutes1} tog2={toggleQoutes3}/>
  {/if}

  {#if currentView === 'qoutes3'}
  <Qoutes3 tog={toggleQoutes} tog1={toggleQoutes1} tog2={toggleQoutes2} tog3={toggleQoutes4}/>
  {/if}

  {#if currentView === 'qoutes4'}
  <Qoutes4 tog={toggleQoutes} tog1={toggleQoutes1} tog2={toggleQoutes2} tog3={toggleQoutes3} tog4={toggleQoutes5}/>
  {/if}

  {#if currentView === 'qoutes5'}
  <Qoutes5 tog={toggleQoutes} tog1={toggleQoutes1} tog2={toggleQoutes2} tog3={toggleQoutes3} tog4={toggleQoutes4} tog5={toggleQoutes6}/>
  {/if}

  {#if currentView === 'qoutes6'}
  <Qoutes6 tog={toggleQoutes} tog1={toggleQoutes1} tog2={toggleQoutes2} tog3={toggleQoutes3} tog4={toggleQoutes4} tog5={toggleQoutes5}/>
  {/if}
  </div>