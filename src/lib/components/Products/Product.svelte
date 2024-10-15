<script>
    import ProductsPage from './ProductsPage.svelte';
    import SubProductsPage from './SubProductsPage.svelte';
    import ProductInfoPage from './ProductInfoPage.svelte';
    import { createEventDispatcher } from 'svelte';
  
    export let currentStep = 1;
    export let productId;
    export let subProductId;
    
    const dispatch = createEventDispatcher();
  
    // Function to handle page changes
    function handleStepChange(step, productId = null, subProductId = null) {
      dispatch('changePage', { step, productId, subProductId });
    }
  
    let currentPage;
  
    $: {
      if (currentStep === 1) {
        currentPage = ProductsPage;
      } else if (currentStep === 2) {
        currentPage = SubProductsPage;
      } else if (currentStep === 3) {
        currentPage = ProductInfoPage;
      }
    }
  </script>
  
  <svelte:component
    this={currentPage}
    on:viewSubProducts={(event) => handleStepChange(2, event.detail.productId)}
    on:viewProductInfo={(event) => handleStepChange(3, event.detail.productId, event.detail.subProductId)}
    {productId}
    {subProductId}
  />
  