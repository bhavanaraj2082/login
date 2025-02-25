<script>
    import { onMount, createEventDispatcher } from 'svelte'
    import Icon from '@iconify/svelte';
    import { slide,fade } from 'svelte/transition';
    
    export let selectedDates = {
      from: '',
      to: ''
    };
    
    export let minDate = null;
    export let maxDate = null;
    export let initialFilters = {
      dateRange: 'custom',
      showWeekends: true
    };
    
    const dispatch = createEventDispatcher();
    let dropdownOpen = false;
    let currentMonth = new Date();
    let selectedPreset = 'custom';
    let filters = { ...initialFilters };
    let previousDates = null;
    let showCalendar = false;
    
    if (!maxDate) {
      maxDate = new Date();
      maxDate.setHours(23, 59, 59, 999);
    }
    
    function getDaysInMonth(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }
    
    function getFirstDayOfMonth(date) {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }
    
    function generateCalendarDays(date) {
      const daysInMonth = getDaysInMonth(date);
      const firstDay = getFirstDayOfMonth(date);
      const days = [];
    
      for (let i = 0; i < firstDay; i++) {
        days.push({ day: '', disabled: true });
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
        currentDate.setHours(12, 0, 0, 0); 
        days.push({
          day: i,
          date: currentDate,
          isToday: currentDate.toDateString() === today.toDateString(),
          disabled: (minDate && currentDate < minDate) || 
                   (maxDate && currentDate > maxDate)
        });
      }
      
      return days;
    }
    
    function formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      d.setHours(12, 0, 0, 0);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    function parseDate(dateString) {
      if (!dateString) return null;
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(12, 0, 0, 0);
      return date;
    }
    
    const presets = {
        custom: () => ({
            from: '',
            to: ''
         })
      };
    
    function handlePresetChange(preset) {
      selectedPreset = preset;
      previousDates = { ...selectedDates };
      
      if (preset === 'custom') {
        showCalendar = true;
        selectedDates = { from: '', to: '' };
      } else {
        showCalendar = false;
        selectedDates = presets[preset]();
        validateAndDispatch();
      }
    }
    
    function handleDateSelect(date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(12, 0, 0, 0);
      
      if (!selectedDates.from || (selectedDates.from && selectedDates.to)) {
        selectedDates = { 
          from: formatDate(selectedDate), 
          to: '' 
        };
      } else {
        const fromDate = parseDate(selectedDates.from);
        if (selectedDate < fromDate) {
          selectedDates = { 
            from: formatDate(selectedDate), 
            to: selectedDates.from 
          };
        } else {
          selectedDates = { 
            ...selectedDates, 
            to: formatDate(selectedDate) 
          };
        }
      }
    
      if (selectedDates.from && selectedDates.to) {
        validateAndDispatch();
      }
    }
    
    function validateAndDispatch() {
      if (selectedDates.from && selectedDates.to) {
        const fromDate = parseDate(selectedDates.from);
        const toDate = parseDate(selectedDates.to);
        
        if (fromDate <= toDate) {
          dispatch('dateChange', {
            dates: selectedDates,
            filters: {
              ...filters,
              dateRange: selectedPreset
            }
          });
          dropdownOpen = false;
          return true;
        }
      }
      return false;
    }
    
    function clearFilters() {
      selectedDates = { from: '', to: '' };
      selectedPreset = 'all';
      filters = { ...initialFilters };
      dropdownOpen = false;
      showCalendar = false;
      dispatch('dateChange', {
        dates: selectedDates,
        filters
      });
    }
    
    function handleClickOutside(event) {
      const dropdown = document.querySelector('.date-dropdown-container');
      if (dropdown && !dropdown.contains(event.target)) {
        dropdownOpen = false;
        showCalendar = false;
      }
    }
    
    onMount(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    });
    
    let showMonthSelector = false;
    let showYearSelector = false;
    let selectedYear = currentMonth.getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - 6 + i);
    
    function handleYearSelect(year) {
      selectedYear = year;
      currentMonth = new Date(year, currentMonth.getMonth(), 1);
      showYearSelector = false;
    }
    
    function handleMonthSelect(monthIndex) {
      currentMonth = new Date(selectedYear, monthIndex, 1);
      showMonthSelector = false;
    }
    
    function toggleMonthSelector() {
      showMonthSelector = !showMonthSelector;
      showYearSelector = false;
    }
    
    function toggleYearSelector() {
      showYearSelector = !showYearSelector;
      showMonthSelector = false;
    }
    
    function getButtonDisplayText(selectedPreset, selectedDates) {
      if (selectedPreset === 'all') {
        return 'All Dates';
      }
      
      return selectedDates.from && selectedDates.to
        ? `${selectedDates.from} to ${selectedDates.to}`
        : 'Select dates';
    }
    
    $: calendarDays = generateCalendarDays(currentMonth);
    // $: monthName = `${currentMonth.toLocaleString('default', { month: 'long' })} ${currentMonth.getFullYear()}`;
  </script>
    
  <div class="relative date-dropdown-container">
        <div class="flex items-center space-x-2">
          <button
            type="button"
            class="flex items-center w-full justify-between px-3 py-2.5 border border-primary-400 rounded text-xs bg-white hover:bg-gray-50 focus:outline-none focus:ring-primary-500 whitespace-nowrap"
            on:click|stopPropagation={() => dropdownOpen = !dropdownOpen}>
            <span class="flex items-center">
              <Icon icon="famicons:today" class="w-5 h-5 text-gray-400 mr-2" />
              {getButtonDisplayText(selectedPreset, selectedDates)}
            </span>
            <Icon icon={dropdownOpen ? "heroicons:chevron-up" : "heroicons:chevron-down"} class="w-5 h-5 text-gray-400 transition-all" />
          </button>
          {#if selectedDates.from || selectedDates.to }
            <button
              type="button"
              class="p-2 bg-white border border-primary-500 rounded active:scale-95 hover"
              on:click={clearFilters}>
              <Icon icon="heroicons:x-mark" class="w-5 h-5 font-bold text-xl text-red-600 hover:text-red-700" />
            </button>
          {/if}
        </div>
        {#if dropdownOpen}
          <div 
            class="absolute z-50 mt-1 bg-white rounded shadow-lg border w-full sm:max-w-sm lg:w-full"
            transition:slide={{ duration: 200 }}>
            {#if !showCalendar}
              <div class="p-2" transition:fade>
                <div class="grid gap-1">
                  {#each Object.entries(presets) as [key, _]}
                    <button
                      class="w-full px-3 py-2 text-left text-xs rounded hover:bg-gray-50
                        {selectedPreset === key ? 'bg-primary-50 text-primary-600' : 'text-gray-700'}"
                      on:click={() => handlePresetChange(key)}>
                      { 'Custom Range' }
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
            {#if showCalendar}
            <div class="p-4" transition:fade>
              <div class="flex items-center justify-between mb-4">
                <button
                  class="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  on:click={() => currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)}>
                  <Icon icon="heroicons:chevron-left" class="w-4 h-4" />
                </button>
                <div class="flex items-center space-x-1">
                  <button 
                    class="text-sm font-medium text-gray-700 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
                    on:click={toggleMonthSelector}>
                    {currentMonth.toLocaleString('default', { month: 'long' })}
                  </button>
                  <button 
                    class="text-sm font-medium text-gray-700 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
                    on:click={toggleYearSelector}>
                    {currentMonth.getFullYear()}
                  </button>
                </div>
                <button
                  class="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  on:click={() => currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)}>
                  <Icon icon="heroicons:chevron-right" class="w-4 h-4" />
                </button>
              </div>    
              {#if showMonthSelector || showYearSelector}
              <div class="absolute top-14 left-0 right-0 bg-white border rounded-lg shadow-lg z-10" transition:fade={{ duration: 150 }}>
                 {#if showMonthSelector}
                   <div class="px-4 py-10">
                     <div class="grid grid-cols-3 gap-2.5">
                       {#each months as month, index}
                         <button
                           class="p-2 text-sm rounded hover:bg-gray-100 transition-colors
                             {currentMonth.getMonth() === index 
                               ? 'bg-primary-50 text-primary-600 font-medium' 
                               : 'text-gray-700'}"
                           on:click={() => {
                             handleMonthSelect(index);
                             showMonthSelector = false;
                           }}>
                           {month}
                         </button>
                       {/each}
                     </div>
                   </div>
                 {/if}
                 {#if showYearSelector}
                   <div class="max-h-64 overflow-y-auto p-2 scroll w-full md:max-w-xs lg:w-full">
                     {#each years as year}
                       <button
                         class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors
                           {year === selectedYear ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'}"
                         on:click={() => {
                           handleYearSelect(year);
                           showYearSelector = false;
                         }}>
                         {year}
                       </button>
                     {/each}
                   </div>
                 {/if}
               </div>
              {/if}
                <div class="mb-2 w-full md:max-w-xs lg:w-full">
                  <div class="grid grid-cols-7 mb-1">
                    {#each ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as day}
                      <div class="text-center text-xs md:text-sm font-semibold text-heading">{day}</div>
                    {/each}
                  </div>
                  <div class="grid grid-cols-7 gap-0.5 w-full md:max-w-xs lg:w-full">
                    {#each calendarDays as { day, date, disabled, isToday }}
                      <button
                        class="aspect-square flex items-center justify-center px-2 py-1 text-xs rounded
                          {disabled ? 'text-gray-300 cursor-not-allowed' :
                           isToday ? 'font-semibold text-primary-600' :
                           date && selectedDates.from === formatDate(date) ? 'bg-primary-600 text-white' :
                           date && selectedDates.to === formatDate(date) ? 'bg-primary-600 text-white' :
                           date && selectedDates.from && selectedDates.to &&
                           date > parseDate(selectedDates.from) && date < parseDate(selectedDates.to) ?
                           'bg-primary-50 text-primary-700' : 'hover:bg-gray-100 transition-colors'}"
                        disabled={disabled}
                        on:click={() => date && handleDateSelect(date)}>
                        {day}
                      </button>
                    {/each}
                  </div>
                </div>
                {#if selectedDates.from || selectedDates.to}
                  <div class="mt-3 mb-4 text-xs text-gray-500 text-center">
                    {selectedDates.from && !selectedDates.to ? 'Select end date' :
                     !selectedDates.from && selectedDates.to ? 'Select start date' :
                     selectedDates.from && selectedDates.to ? `${selectedDates.from} to ${selectedDates.to}` : ''}
                  </div>
                {/if}
                <div class="flex items-center justify-around pt-3 border-t">
                  <button
                    class="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    on:click={() => {
                      selectedDates = { ...previousDates };
                      showCalendar = false;
                    }}>
                    Cancel
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {/if}
  </div>