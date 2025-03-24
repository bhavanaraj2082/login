<script>
	import Icon from '@iconify/svelte';
	import { invalidate } from '$app/navigation';
	import { enhance } from '$app/forms';

  export let recureModal
  export let recurrence
  export let togglePopup
  export let cartId

  $: month = recurrence?.recurring ? (recurrence?.recurring !== 1 && recurrence?.recurring !== 3 && recurrence?.recurring !== 6 && recurrence?.recurring !== 12 ? "Custom" : String(recurrence?.recurring)) : undefined
  let custom =  String(recurrence?.recurring)
  let popup
  let error = ""
  let message = ""
  let customError = ""
  let dateError = ""
  let startingDate 
  let recurringDate
  let recurring
  let isSave = true
  let lastDayOfMonth
  let timeout
  let lastDay =  new Date(recurrence?.recurringDate).getDate()||''

  const handleClick = (e)=>{
		if(!popup.contains(e.target)){
      month =  recurrence?.recurring !== 1 || recurrence?.recurring !== 3 || recurrence?.recurring !== 6 || recurrence?.recurring !== 12 ? "Custom" : String(recurrence?.recurring)
      custom = String(recurrence?.recurring)
      error = ''
      customError = ''
		   togglePopup()
		}
	}

  function calculateFutureDate(intervals, date) {
    if(date.length > 2) return
    isSave = true
    if(intervals === "Custom"){
     month = intervals
      return
    }
    if(intervals === "1" || intervals === "3" || intervals === "6" || intervals === "12"){
      month = intervals
    }

    dateError = ""
    if(!date || !/^\d+$/.test(date)){
      dateError = "Required and enter a valid date"
      return
    }
    clearTimeout(timeout)
    timeout = setTimeout(()=>{

    const today = new Date();
    const futureDate = new Date(today);
    let interval = parseInt(intervals) || 1
    futureDate.setMonth(futureDate.getMonth() + interval);

    if (date) {
        lastDayOfMonth = new Date(futureDate.getFullYear(), futureDate.getMonth() + 1, 0).getDate();
        if (date > lastDayOfMonth) {
          futureDate.setDate(lastDayOfMonth);
        } else {
          futureDate.setDate(parseInt(date)); 
        }
      }

    if (isNaN(futureDate)) {
        console.error('Calculated future date is invalid');
        return null; // Avoid returning an invalid date
    }
    startingDate = new Date().toISOString()
    recurringDate = futureDate?.toISOString()
    recurring = parseInt(intervals)
    lastDay = futureDate.getDate()
    isSave = false
     },1000)
  }

  function handleSubmit({cancel}) {
    if(error.length > 0 || month === "Custom" && !custom){
      customError = "Please select the custom interval"
      cancel()
    }
    if(month === "undefined"){
        error = "Please select the Recurrence period"
        cancel()
    }

    return async({result})=>{
      if(result.type === "success"){
        if(result.data.success){
          message = result.data.msg
          error = ''
          customError = ''
          
          setTimeout(()=>{
            togglePopup()
            message =""
            invalidate("data:cart")

          },1000)
        }
      }
    }
  }
</script>
  
{#if recureModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click={handleClick} class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow-lg max-w-sm w-11/12" bind:this={popup}>
        {#if message.length}
           <div class=" h-32 text-green-600 flex flex-col items-center justify-center gap-2 font-medium ">
            <Icon icon="codicon:pass-filled" class=" w-10 h-10 md:w-14 md:h-14"/>
               {message}
           </div>
        {:else}
        <div class=" flex items-center justify-between">
        <h2 class="text-lg md:text-xl font-medium">Recurrence</h2>
         <button type="button" on:click={()=>{
          togglePopup()
          }}>
            <Icon icon="basil:cross-solid" class=" text-4xl hover:bg-slate-100 rounded"/>
         </button>
        </div>
        <form method="POST" action="?/recurrence" class=" space-y-3" use:enhance={handleSubmit}>
         <input type="hidden" name="dates" value={JSON.stringify({startingDate,recurringDate,recurring,cartId})}>
         <input type="hidden" name="CartId" value={cartId}>
         <div>
            <label for="startDate" class=" font-medium text-sm w-full">Recurrence Date</label>
            <input type="text" bind:value={lastDay} on:input={e=>calculateFutureDate(custom,e.target.value)} class="border-1 text-sm border-gray-300 rounded w-full focus:ring-0 focus:border-primary-500" >
            <p class="{!dateError.length ? "hidden" : ""} text-red-500 text-xs">{dateError}</p>
            <!-- <div class=" flex items-center w-full relative">
               <input type="date"  bind:value={oldDate} min={minus15} max={plus15} on:change={handleMonth} class=" full-width-input p-0 text-sm border-1 border-gray-300 rounded w-full sm:w-96 md:w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
               <Icon icon="uil:calender" class=" shrink-0 text-xl absolute right-3 " />
           </div> -->
         </div>

         <div>
            <label for="recurrence" class=" font-medium text-sm">Choose Recurrence Interval</label><br>
         <select name="recurring" value={month} on:change={e=>calculateFutureDate(e.target.value,lastDay)} id="recurrence" class=" border-1 text-sm border-gray-300 rounded w-full focus:ring-0 focus:border-primary-500">
            <option selected hidden value="Select">Select</option>
            <option value="1">Monthly</option>
            <option value="3">Quarterly</option>
            <option value="6">Semi Annual</option>
            <option value="12">Annual</option>
            <option value="Custom">Custom</option>
         </select>
        <p class=" {error.length ? " text-red-500":"hidden"} text-xs">{error}</p>
         </div>
         {#if month === "Custom"}
         <div class=" font-medium">
            <label for="custom" class=" font-medium text-sm">Custom Interval</label><br>
            <select name="recurring" bind:value={custom} on:change={e=>calculateFutureDate(e.target.value,lastDay)} id="custom" class="border-1 text-sm border-gray-300 rounded w-1/2 focus:ring-0 focus:border-primary-500">
                <option selected hidden value="">Select</option>
                {#each ["2", "4", "5", "7", "8", "9", "10", "11"] as months}
                  <option value={months}>{months}</option>
                {/each}
            </select> Months
        <p class=" {customError.length ? " text-red-500":"hidden"} w-full text-xs">{customError}</p>
         </div>
         {/if}
        <div class="flex gap-4 justify-between text-sm font-medium mt-4">
          <button disabled={isSave} type="submit" class="w-full py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed">
            Save
          </button>
          <button formaction="?/deleteRecurring" type="submit" class="{!recurrence?.recurring ? "hidden":""} w-full py-2 bg-white text-primary-600 border-1 border-primary-600 rounded hover:bg-primary-100 focus:outline-none">
            Delete
          </button>
        </form>
        {/if}
        </div>
  </div>
{/if}  

<!-- <style>
.full-width-input {
    position: relative;
    width: 100%; 
   padding: 8px 12px;
  font-size: 15px;  
  appearance:auto;  
  -webkit-appearance: auto;
  -moz-appearance: auto; 
}

.full-width-input::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    opacity: 0;
    cursor: pointer;
    height: 32.5px;
    width: 100%;
}
</style> -->