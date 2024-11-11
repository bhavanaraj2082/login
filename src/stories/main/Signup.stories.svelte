<script context="module">
    import Signup from '$lib/components/Signup.svelte';
   
  
    export const meta = {
      title: "notinuse/Signup",
      component: Signup,
    
  
    }
  </script>
  
  <script>
     import '../../app.css';
     import { Story, Template } from '@storybook/addon-svelte-csf';
  </script>
  <Signup/>
    
    
    <Story name="Signup12" />