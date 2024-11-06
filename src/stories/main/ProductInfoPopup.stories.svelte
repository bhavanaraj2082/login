<script context="module">
	import ProductDetails from './../../lib/components/ProductInfoPopups/ProductDetails.svelte';
   
  
    export const meta = {
      title: "ProductDetails",
      component: ProductDetails,
    
  
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  <ProductDetails/>
    
    
<Story name="ProductDetails1" />