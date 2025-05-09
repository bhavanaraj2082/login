<script>
  import Icon from '@iconify/svelte';
  import { enhance } from '$app/forms';
  import { createEventDispatcher } from 'svelte';
  import { onMount, onDestroy } from 'svelte';
  
  const dispatch = createEventDispatcher();
  export let recordId;
  export let shippingAddress;
  export let billingAddress;
  import { countries, postalCodePatterns } from '$lib/Data/constants.js';

  let active = 2;
  let activeAddressType = 'shipping';
  let activeAddress;
  let addressBackup = null;
  let toggleEdit = false;
  let errors = {};
  let showErrors = false;
  
  let dummy = {
      organizationName: '',
      attentionTo: '',
      street: '',
      city: '',
      state: '',
      location: '',
      department: '',
      postalCode: '',
      building: ''
  };

  let states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  let showDropdown = false;
  let filteredCountries = countries;
  let autoSelectedOnce = false;
  let previousSearchTerm = '';
  let highlightedIndex = -1;
  let containerRef;

  let stateSearch = '';
  let showStateDropdown = false;
  let autoSelectedStateOnce = false;
  let stateDropdownRef;
  let activeIndex = -1;
  let stateError = '';

  onMount(() => {
      activeBook(2, 'shipping');
      document.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
      document.removeEventListener('click', handleClickOutside);
  });

  const handleClickOutside = (event) => {
      if (containerRef && !containerRef.contains(event.target)) {
          showDropdown = false;
      }
      
      if (stateDropdownRef && !stateDropdownRef.contains(event.target)) {
          showStateDropdown = false;
      }
  };

  function handleFormClick(event) {
      const isStateDropdown = stateDropdownRef?.contains(event.target);
      const isCountryDropdown = containerRef?.contains(event.target);
      
      if (!isStateDropdown && !isCountryDropdown) {
          showStateDropdown = false;
          showDropdown = false;
      }
  }

  function deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj));
  }


  const activeBook = (val, addressType) => {
      active = val;
      activeAddressType = addressType;
      errors = {};
      showErrors = false;

      if (activeAddressType === "shipping") {
          activeAddress = shippingAddress === null ? deepCopy(dummy) : deepCopy(shippingAddress);
      }

      if (activeAddressType === "billing") {
          activeAddress = billingAddress === null ? deepCopy(dummy) : deepCopy(billingAddress);
      }
      
      stateSearch = activeAddress?.state || '';
      filteredStates = states; 
      showStateDropdown = false;
      autoSelectedStateOnce = false;
  };

  function selectCountry(selectedCountry) {
      activeAddress.location = selectedCountry.name;
      filteredCountries = countries; 
      showDropdown = false; 
      validateField('location');
      
      if (activeAddress.location !== 'India') {
          stateSearch = activeAddress.state || '';
      } else {
          stateSearch = '';
          activeAddress.state = '';
      }
      
      validateField('state');
      autoSelectedOnce = false;
  }

  function handleInput(event) {
      const searchTerm = activeAddress.location.toLowerCase().trim();
      const isDialCode = /^\d+$/.test(searchTerm);
      showDropdown = true;
      activeAddress.location = activeAddress.location.trim();

      const isTypingForward = searchTerm.length > previousSearchTerm.length;
      previousSearchTerm = searchTerm;
      autoSelectedOnce = searchTerm.length < 3 ? false : autoSelectedOnce;

      if (isDialCode) {
          filteredCountries = countries.filter(c => c.code.replace('+', '') === searchTerm);
          if (filteredCountries.length === 0) {
              filteredCountries = countries.filter(c =>
                  c.code.replace('+', '').endsWith(searchTerm) &&
                  c.code.replace('+', '').length === searchTerm.length + 1
              );
          }
      } else {
          filteredCountries = countries.filter(c =>
              c.name.toLowerCase().startsWith(searchTerm) ||
              c.code.toLowerCase().includes(searchTerm)
          );
      }

      if (filteredCountries.length === 1 && searchTerm.length >= 2 && !autoSelectedOnce && isTypingForward) {
          const autoSelectedCountry = filteredCountries[0];
          setTimeout(() => {
              activeAddress.location = autoSelectedCountry.name;
              selectCountry(autoSelectedCountry);
              autoSelectedOnce = true;
              showDropdown = false;
          }, 200);
      }
      validateLocation();
  }

  function validateLocation() {
      if (!activeAddress.location || activeAddress.location.trim() === '') {
          errors.location = "Country is required";
          return false;
      }
      
      const found = countries.find(
          c => c.name.toLowerCase().trim() === activeAddress.location.toLowerCase().trim()
      );
      
      if (!found) {
          errors.location = "Please select a country from the list";
          return false;
      } else {
          delete errors.location;
          return true;
      }
  }

  function selectState(selected) {
      stateSearch = selected;
      activeAddress.state = selected;
      showStateDropdown = false;
      autoSelectedStateOnce = true;
      validateField('state');
      stateError = '';
  }

  function handleKeyDown(event) {
      if (!showDropdown) return;

      if (event.key === 'ArrowDown') {
          event.preventDefault();
          highlightedIndex = (highlightedIndex + 1) % filteredCountries.length;
          scrollToHighlightedItem();
      } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          highlightedIndex = (highlightedIndex - 1 + filteredCountries.length) % filteredCountries.length;
          scrollToHighlightedItem();
      } else if (event.key === 'Enter') {
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredCountries.length > 0) {
              selectCountry(filteredCountries[highlightedIndex]);
          } else if (filteredCountries.length > 0) {
              selectCountry(filteredCountries[0]);
          }
          showDropdown = false;
          highlightedIndex = -1;
      }
  }

  function handleKeyDown1(e) {
      if (!showStateDropdown) return;
      
      if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % filteredStates.length;
          scrollToHighlightedItem1();
      } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + filteredStates.length) % filteredStates.length;
          scrollToHighlightedItem1();
      } else if (e.key === 'Enter') {
          e.preventDefault();
          const indexToSelect = activeIndex === -1 ? 0 : activeIndex;
          if (filteredStates.length > 0) {
              selectState(filteredStates[indexToSelect]);
          }
      }
  }

  function scrollToHighlightedItem1() {
      const item = document.getElementById(`dropdown-item-${activeIndex}`);
      if (item) item.scrollIntoView({ block: "nearest" });
  }

  function scrollToHighlightedItem() {
      const item = document.getElementById(`dropdown-item-${highlightedIndex}`);
      if (item) item.scrollIntoView({ block: "nearest" });
  }

  function toggleDropdown(type) {
      if (type === 'country') {
          showDropdown = !showDropdown;
          if (showDropdown) showStateDropdown = false;
      } else if (type === 'state') {
          showStateDropdown = !showStateDropdown;
          if (showStateDropdown) showDropdown = false;
      }
  }

  function validateStateForIndia() {
      if (activeAddress.location === 'India') {
          if (!stateSearch || !stateSearch.trim()) {
              stateError = "State is required";
              return false;
          }
          
          if (!states.includes(stateSearch)) {
              stateError = "Please select a valid state from the dropdown list";
              return false;
          }
          
          stateError = '';
          return true;
      }
      
      return true;
  }

  const validateField = (field) => {
      const country = activeAddress.location;
      const pattern = postalCodePatterns[country] || /^\d{6}$/;
      
      switch (field) {
          case 'street':
              if (!activeAddress.street || activeAddress.street.trim() === '') {
                  errors.street = "Street is required";
              } else if (activeAddress.street.length < 3 || activeAddress.street.length > 100) {
                  errors.street = "Street must be between 3 and 100 characters";
              } else if (!/^[A-Za-z0-9\s]+$/.test(activeAddress.street)) {
                  errors.street = "Street must contain only letters, numbers, and spaces";
              } else {
                  delete errors.street;
              }
              break;

          case 'building':
              if (activeAddress.building) {
                  if (activeAddress.building.length < 1 || activeAddress.building.length > 50) {
                      errors.building = "Building must be between 1 and 50 characters";
                  } else if (!/^[A-Za-z0-9\s]+$/.test(activeAddress.building)) {
                      errors.building = "Building must contain only letters, numbers, and spaces";
                  } else {
                      delete errors.building;
                  }
              } else {
                  delete errors.building;
              }
              break;

          case 'city':
              if (!activeAddress.city || activeAddress.city.trim() === '') {
                  errors.city = "City is required";
              } else if (activeAddress.city.length < 3 || activeAddress.city.length > 80) {
                  errors.city = "City must be between 3 and 80 characters";
              } else if (!/^[A-Za-z\s]+$/.test(activeAddress.city)) {
                  errors.city = "City must contain only letters and spaces";
              } else {
                  delete errors.city;
              }
              break;

          case 'state':
              if (!activeAddress.state || activeAddress.state.trim() === '') {
                  errors.state = "State is required";
              } else if (activeAddress.state.length < 3 || activeAddress.state.length > 80) {
                  errors.state = "State must be between 3 and 80 characters";
              } else if (!/^[A-Za-z\s]+$/.test(activeAddress.state)) {
                  errors.state = "State must contain only letters and spaces";
              } else {
                  delete errors.state;
              }
              break;

          case 'location':
              validateLocation();
              break;
              
          case "postalCode":
              if (!activeAddress.postalCode || activeAddress.postalCode.trim() === '') {
                  errors.postalCode = "Postal Code is required";
              } else if (pattern && !pattern.test(activeAddress.postalCode)) {
                  errors.postalCode = `Postal Code is invalid for ${country}`;
              } else {
                  delete errors.postalCode;
              }
              break;
      }
  };

  const validateForm = () => {
      errors = {};
      
      validateField('street');
      validateField('building');
      validateField('city');
      validateField('state');
      validateField('location'); 
      validateField('postalCode');
      
      if (activeAddress.location === 'India') {
          validateStateForIndia();
          if (stateError) {
              errors.state = stateError;
          }
      }
      
      return Object.keys(errors).length === 0 && !stateError;
  };

  function startEdit() {
      addressBackup = deepCopy(activeAddress);
      stateSearch = activeAddress?.state || '';
      toggleEdit = true;
      errors = {};
      showErrors = false;
      stateError = '';
  }

  function cancelEdit() {
      if (addressBackup) {
          activeAddress = deepCopy(addressBackup);
          stateSearch = addressBackup?.state || '';
      }
      errors = {};
      showErrors = false;
      stateError = '';
      toggleEdit = false;
  }

  const handleSubmit = ({ cancel }) => {
      showErrors = true;
      
      if (activeAddress.location === 'India') {
          validateStateForIndia();
      }
      
      if (!validateForm()) {
          cancel();
          return;
      }
      
      return async ({ result, update }) => {
          if (result.type === "success") {
              await update();
              toggleEdit = false;
              dummy = Object.fromEntries(Object.keys(dummy).map(key => [key, ""]));
              activeBook(active, activeAddressType);
              dispatch("onSuccess", result.data);
          }
      };
  };

  $: filteredStates = stateSearch
      ? states.filter(s => s.toLowerCase().startsWith(stateSearch.toLowerCase()))
      : states;
      
  $: {
      if (filteredStates.length === 1 && stateSearch.length >= 2 && !autoSelectedStateOnce) {
          const autoSelected = filteredStates[0];
          setTimeout(() => {
              selectState(autoSelected);
              autoSelectedStateOnce = true;
          }, 200);
      }
      if (stateSearch.length < 2) {
          autoSelectedStateOnce = false;
      }
  }

  $: iconRotation = showStateDropdown ? 'rotate(90deg)' : 'rotate(0deg)';
  $: countryIconRotation = showDropdown ? 'rotate(90deg)' : 'rotate(0deg)';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="shadow rounded-md p-5 bg-white" on:click={handleFormClick}>
  {#if toggleEdit}
      <div class="max-w-3xl">
          <h1 class="text-xl font-bold capitalize"> 
              Edit Your {activeAddressType} Address 
              <span class="text-xs font-normal"> 
                  <span class="text-sm font-bold text-red-500">*</span>Represents required fields
              </span>
          </h1>
          <form class="my-3 flex flex-col sm:flex-row flex-wrap gap-y-3 py-3" method="POST" action="?/editAddresses" use:enhance={handleSubmit}>
              <input type="hidden" name="recordId" value={recordId}>
              <input type="hidden" name="addressType" value={activeAddressType}>
              
              <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                  <div class="w-full">
                      <label class="text-xs md:text-sm font-medium" for="location">
                          <span class="text-sm font-bold text-red-500">*</span>Country
                      </label><br>
                      <div class="relative z-10" bind:this={containerRef}>
                          <div class="flex items-center border-1 border-gray-300 rounded-md my-1 overflow-hidden {errors.location && showErrors ? 'border-red-500' : ''}">
                              <input
                                  type="text"
                                  name="location"
                                  bind:value={activeAddress.location}
                                  placeholder="Search Country"
                                  on:click={() => toggleDropdown('country')}
                                  on:input={handleInput}
                                  on:keydown={handleKeyDown}
                                  class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-none" />
                              <Icon 
                                  icon="lsicon:right-filled" 
                                  width="1.6em" 
                                  height="1.6em" 
                                  class="text-gray-500 transition-transform duration-200 cursor-pointer mr-2" 
                                  style="transform: {countryIconRotation};"
                                  on:click={() => toggleDropdown('country')}/>
                          </div>
                          {#if showDropdown}
                              <ul class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                                  {#each filteredCountries as { name, code }, index}
                                      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                                      <li
                                          id={`dropdown-item-${index}`}
                                          class="px-4 py-2 cursor-pointer {highlightedIndex === index ? 'bg-primary-100' : 'hover:bg-primary-50'}"
                                          on:click|stopPropagation={() => selectCountry({ name, code })}>
                                          {name} ({code})
                                      </li>
                                  {/each}
                                  {#if filteredCountries.length === 0}
                                      <li class="px-2 py-1 text-gray-500">No results found</li>
                                  {/if}
                              </ul>
                          {/if}
                      </div>                  
                      {#if errors?.location && showErrors}
                          <p class="text-red-500 text-xs mt-1">{errors.location}</p>
                      {/if}
                  </div>
                  <div class="w-full">
                      <label class="text-xs md:text-sm font-medium" for="state">
                          <span class="text-sm font-bold text-red-500">*</span>State
                      </label><br>
                      {#if activeAddress.location === 'India'}
                          <div class="relative w-full text-xs" bind:this={stateDropdownRef}>
                              <div class="flex items-center border-1 border-gray-300 rounded-md my-1 overflow-hidden {(errors.state || stateError) && showErrors ? 'border-red-500' : ''}">
                                  <input
                                      class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-none"
                                      type="text"
                                      name="state"
                                      bind:value={stateSearch}
                                      on:click={() => toggleDropdown('state')}
                                      on:keydown={handleKeyDown1}
                                      on:input={() => {
                                          activeAddress.state = stateSearch;
                                          showStateDropdown = true;
                                          if (stateSearch.length < 2) autoSelectedStateOnce = false;
                                          activeIndex = -1;
                                          validateStateForIndia();
                                      }}
                                      placeholder="Search state"
                                      autocomplete="off"/>
                                  <Icon
                                      icon="lsicon:right-filled"
                                      width="1.6em"
                                      height="1.6em"
                                      class="text-gray-500 transition-transform duration-200 cursor-pointer mr-2"
                                      style="transform: {iconRotation};"
                                      on:click={() => toggleDropdown('state')}/>
                              </div>
                              {#if showStateDropdown}
                                  <ul class="absolute z-10 bg-white border border-gray-200 w-full max-h-40 overflow-y-auto text-xs mt-1 shadow">
                                      {#each filteredStates as option, index}
                                          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                                          <li 
                                              id={`dropdown-item-${index}`} 
                                              class="py-1 px-2 cursor-pointer hover:bg-primary-100 {index === activeIndex ? 'bg-primary-100 font-semibold' : ''}"
                                              on:click={() => selectState(option)}>
                                              {option}
                                          </li>
                                      {/each}
                                      {#if filteredStates.length === 0}
                                          <li class="px-2 py-1 text-gray-500">No results</li>
                                      {/if}
                                  </ul>
                              {/if}
                          </div>
                          {#if ((!stateSearch || !states.includes(stateSearch)) && showErrors)}
                              <span class="text-red-500 text-xs block">
                                  {!stateSearch ? "State is required" : "Please select a valid state from the dropdown list"}
                              </span>
                          {/if}
                      {:else}
                          <input 
                              class="outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500 {errors.state && showErrors ? 'border-red-500' : ''}" 
                              type="text" 
                              name="state" 
                              bind:value={activeAddress.state} 
                              on:input={() => {
                                  validateField('state');
                                  activeAddress.state = activeAddress.state.trimStart();
                              }}/>
                          {#if errors?.state && showErrors}
                              <span class="text-red-600 text-xs">{errors.state}</span>
                          {/if}
                      {/if}
                  </div>
              </div>
              <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                  <div class="w-full">
                      <label class="text-xs md:text-sm font-medium" for="city">
                          <span class="text-sm font-bold text-red-500">*</span>City
                      </label><br>
                      <input 
                          class="outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500 {errors.city && showErrors ? 'border-red-500' : ''}" 
                          type="text" 
                          name="city" 
                          bind:value={activeAddress.city} 
                          on:input={() => {
                              validateField('city');
                              activeAddress.city = activeAddress.city.trimStart();
                          }}/>
                      {#if errors?.city && showErrors}
                          <span class="text-red-600 text-xs">{errors.city}</span>
                      {/if}
                  </div>
                  <div class="w-full">
                      <label class="text-xs md:text-sm font-medium" for="street">
                          <span class="text-sm font-bold text-red-500">*</span>Street
                      </label><br>
                      <input 
                          class="outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500 {errors.street && showErrors ? 'border-red-500' : ''}" 
                          type="text" 
                          name="street" 
                          bind:value={activeAddress.street} 
                          on:input={() => {
                              validateField('street');
                              activeAddress.street = activeAddress.street.trimStart();
                          }}/>
                      {#if errors?.street && showErrors}
                          <span class="text-red-600 text-xs">{errors.street}</span>
                      {/if}
                  </div>
              </div>
              <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4">
                  <div class="w-full">
                      <label class="text-xs md:text-sm font-medium" for="building">
                          Building/Room
                      </label><br>
                      <input 
                          class="outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500 {errors.building && showErrors ? 'border-red-500' : ''}" 
                          type="text" 
                          name="building" 
                          bind:value={activeAddress.building} 
                          on:input={() => {
                              validateField('building');
                              activeAddress.building = activeAddress.building.trimStart();
                          }}/>
                      {#if errors?.building && showErrors}
                          <span class="text-red-600 text-xs">{errors.building}</span>
                      {/if}
                  </div>
                  <div class="w-full">
                      <label class="text-xs md:text-sm font-medium" for="postalCode">
                          <span class="text-sm font-bold text-red-500">*</span>Postal Code
                      </label><br>
                      <input 
                          class="outline-none w-full border-1 focus:ring-0 border-gray-300 font-medium rounded-md p-2 text-sm focus:border-primary-500 {errors.postalCode && showErrors ? 'border-red-500' : ''}" 
                          type="text" 
                          name="postalCode" 
                          bind:value={activeAddress.postalCode} 
                          on:input={() => {
                              activeAddress.postalCode = activeAddress.postalCode.trim();
                              validateField("postalCode");
                          }}/>
                      {#if errors?.postalCode && showErrors}
                          <span class="text-red-600 text-xs">{errors.postalCode}</span>
                      {/if}
                  </div>
              </div>
              <div class="w-full flex flex-col sm:flex-row gap-y-3 sm:gap-4 mt-4">
                  <button 
                      type="button" 
                      on:click={cancelEdit} 
                      class="w-full rounded-md py-1.5 font-medium text-primary-500 hover:bg-primary-50 bg-white border-1 border-primary-500">
                      Cancel
                  </button>
                  <button 
                      type="submit" 
                      class="w-full rounded-md py-1.5 font-medium text-white hover:bg-primary-600 bg-primary-500 border-1 border-primary-500">
                      Submit
                  </button>
              </div>
          </form>
      </div>
  {:else}
      <div class="space-y-5">
          <h1 class="text-xl font-bold">Address Book</h1>
          <section class="text-sm md:text-lg flex flex-1 items-center overflow-x-scroll scroll sm:overflow-x-hidden py-1">
              <button 
                  on:click={() => activeBook(2, "shipping")} 
                  class="{2 === active ? 'border-b-2 border-primary-500 text-primary-500 transition duration-300' : 'border-white'} border-b-2 shrink-0 font-semibold px-4 py-1">
                  Shipping
              </button>
              <button 
                  on:click={() => activeBook(3, "billing")} 
                  class="{3 === active ? 'border-b-2 border-primary-500 text-primary-500 transition duration-300' : 'border-white'} border-b-2 shrink-0 font-semibold px-4 py-1">
                  Billing
              </button>
          </section>
          <div class="w-full flex flex-col gap-3">
              <div class="w-full h-50 border-1 font-medium capitalize rounded-md border-gray-300 p-4 md:p-5 text-xs md:text-sm leading-5">
                  <div class="text-gray-700 font-semibold">
                      Address:
                  </div>
                  <div class="mt-2 flex space-x-1 ">
                    {#if activeAddress?.location}<div>{activeAddress?.location}</div>{/if}
                    {#if activeAddress?.state}<div>{activeAddress?.state}</div>{/if}
                    {#if activeAddress?.city}<div>{activeAddress?.city}</div>{/if}
                    {#if activeAddress?.street || activeAddress?.building}<div>{activeAddress?.street}</div>{/if}
                    {#if activeAddress?.building}<div>{activeAddress.building}</div>{/if}
                    {#if activeAddress?.postalCode}<div>{activeAddress.postalCode}</div>{/if}
                  </div>
              </div>
              <button on:click={startEdit} class="w-20 rounded-md py-2 self-end font-medium text-xs md:text-sm text-white bg-primary-400 hover:bg-primary-500">Edit</button>
          </div>
      </div>
      {/if} 
  </div>