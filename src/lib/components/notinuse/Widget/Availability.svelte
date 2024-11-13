<script>
  import { selectedSample, currentstep } from "$lib/OrderWidget/store.js"; 
  import availabilityData from '$lib/data/OrderWidget/availability.json';
 
  let showAvailability = false; 
  let showWarningModal = false; 
  let showConfirmationModal = false; 
  let samples = [];
  let quantities = {}; 

  selectedSample.subscribe(value => {
    samples = value; 
  });

  
  const toggleAvailability = () => {
    if (samples.length === 0 && !showAvailability) {
      showWarningModal = true;  
    } else {
      showAvailability = !showAvailability;  
      currentstep.set(3); 
    }
  };


  const closeWarningModal = () => {
    showWarningModal = false; 
  };

  
  const removeAllSamples = () => {
    if (samples.length === 0) {
      showWarningModal = true;  
    } else {
      showConfirmationModal = true;  
    }
  };

  
  const confirmRemoveSamples = () => {
    samples = [];
    selectedSample.set(samples);  
    showConfirmationModal = false;  
    showAvailability = false;  
  };

  
  const cancelRemoveSamples = () => {
    showConfirmationModal = false; 
  };

  const incrementQuantity = (rowKey) => {
    quantities[rowKey] = (quantities[rowKey] || 0) + 1; 
  };

  
  const decrementQuantity = (rowKey) => {
    if (quantities[rowKey] > 0) {
      quantities[rowKey]--;  
    }
  };
</script>


<div class="max-w-4xl mx-auto p-4">
  <h2 class="text-2xl font-bold text-red-800 mb-2">3. View availability & select round(s)</h2>

  <div class="mb-8">
    <button 
      class="bg-blue-700 text-white py-4 px-16 rounded-lg hover:bg-blue-600" 
      on:click={toggleAvailability}>
      {availabilityData.availability.view_button.label}
    </button>
  </div>

  {#if showAvailability}
    <div class="max-w-5xl mx-auto p-8">
      <h1 class="text-2xl font-bold mb-4">Availability</h1>
      <p class="text-green-500 font-bold mb-4">Choose when you would like to receive your samples.</p>
      
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">{availabilityData.availability.key_section.title}</h3>
        <div class="space-y-4 mb-6">
          {#each availabilityData.availability.key_section.descriptions as description}
            <div class="flex items-center space-x-2">
              <div class="border-2 border-gray-300 w-10 h-10 flex items-center justify-center">
                {#if description.icon === 'checkbox_empty'}
                  <input type="number" class="w-full text-center p-1 border-gray-200" 
                         bind:value={samples[description.description]} 
                         placeholder="0" min="0" />
                {:else if description.icon === 'checkbox_checked'}
                  <span class="text-green-500 text-2xl">✔</span>
                {:else if description.icon === 'remove'}
                  <span class="text-red-900 text-2xl">✖</span>
                {:else if description.icon === 'mandatory'}
                  <span class="text-gray-700 text-xl">1</span>
                {:else if description.icon === 'add_component'}
                  <span class="text-teal-600 text-2xl">▶</span>
                {/if}
              </div>
              <span class="text-blue-400">{description.description}</span>
            </div>
          {/each}
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300">
            <thead class="bg-pink-100">
              <tr>
                {#each availabilityData.samples.dispatch_table.headers as header}
                  <th class="border border-gray-300 p-2 text-left">{header}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each availabilityData.samples.dispatch_table.rows as row, i}
                <tr>
                  <td class="border border-gray-300 p-2 text-center">
                    {#if row.remove === 'X'}
                      <button class="text-red-600">X</button>
                    {:else}
                      {row.remove}
                    {/if}
                  </td>
                  <td class="border border-gray-300 p-2 text-center">{row.round}</td>
                  <td class="border border-gray-300 p-2 text-center">{row.dispatch_date}</td>
                  <td class="border border-gray-300 p-2 text-center">
                    {#if row.BV346 === ''}
                      <div class="flex items-center justify-center space-x-2">
                        <button 
                          class="bg-gray-200 text-black px-2 rounded" 
                          on:click={() => decrementQuantity(`BV346_${i}`)}>
                          ⬇
                        </button>
                        <span>{quantities[`BV346_${i}`] || 0}</span>
                        <button 
                          class="bg-gray-200 text-black px-2 rounded" 
                          on:click={() => incrementQuantity(`BV346_${i}`)}>
                          ⬆
                        </button>
                      </div>
                    {:else}
                      {row.BV346}
                    {/if}
                  </td>
                  <td class="border border-gray-300 p-2 text-center">
                    {#if row.BV349 === ''}
                      <div class="flex items-center justify-center space-x-2">
                        <button 
                          class="bg-gray-200 text-black px-2 rounded" 
                          on:click={() => decrementQuantity(`BV349_${i}`)}>
                          ⬇
                        </button>
                        <span>{quantities[`BV349_${i}`] || 0}</span>
                        <button 
                          class="bg-gray-200 text-black px-2 rounded" 
                          on:click={() => incrementQuantity(`BV349_${i}`)}>
                          ⬆
                        </button>
                      </div>
                    {:else}
                      {row.BV349}
                    {/if}
                  </td>
                  <td class="border border-gray-300 p-2 text-center">{row.BV352}</td>
                  <td class="border border-gray-300 p-2 text-center">{row.BV355}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-left">
        <button 
          class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400" 
          on:click={removeAllSamples}>
          Remove All Samples
        </button>
      </div>
    </div>
  {/if}

  {#if showWarningModal}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto relative">
        <h2 class="text-xl font-bold mb-4">Please select at least one sample!</h2>
        <div class="flex justify-center">
          <button 
            class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400" 
            on:click={closeWarningModal}>
            OK
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if showConfirmationModal}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto relative">
        <h2 class="text-xl font-bold mb-4">Please confirm!</h2>
        <p class="mb-4">Are you sure you want to remove all the samples?</p>
        <div class="flex justify-between">
          <button 
            class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400" 
            on:click={confirmRemoveSamples}>
            OK
          </button>
          <button 
            class="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-200" 
            on:click={cancelRemoveSamples}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
