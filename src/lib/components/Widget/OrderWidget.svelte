<script>
  import SelectOptions from "$lib/components/Widget/SelectOptions.svelte";
  import Sample from "$lib/components/Widget/Sample.svelte";
  import Availability from "$lib/components/Widget/Availability.svelte";
  import Estimation from "$lib/components/Widget/Estimation.svelte";

 
  import { currentstep, selectedSample } from "$lib/OrderWidget/store.js"; 

 
  const handleOptionSelect = () => {
    currentstep.set(2); 
  };

  
  const handleSampleSelect = (event) => {
    selectedSample.set(event.detail); 
    currentstep.set(3); 
  };
</script>

<div class="container mx-auto p-16">
  
  <SelectOptions on:selectOption={handleOptionSelect} />

 
  {#if $currentstep === 2 || $currentstep === 3}
    <div class="border-b-2 border-black-500 my-6"></div>
    <Sample on:selectSample={handleSampleSelect} />
    <div class="border-b-2 border-black-500 my-6"></div>
   
    <Availability /> 
  {/if}

 {#if $currentstep === 3}
    <div class="border-b-2 border-black-500 my-6"></div>
    <Estimation />
  {/if}
</div>
