<script>
    import Feedback from '$lib/components/Feedback.svelte'
    import { urlHistory } from '$lib/stores/feedStore.js';
	import { prev } from '$lib/stores/feedStore.js';
    import { onMount } from 'svelte';
    import { expoOut } from 'svelte/easing';
    export let data;
    console.log("page data",data);
    
    let previousUrls;
  onMount(() => {
    const unsubscribe = urlHistory.subscribe(history => {
		if (history.length > 1) {
  previousUrls = history[history.length - 1];
//   console.log("previousUrls in onMount (multiple history):", previousUrls);
} else if (history.length === 1) {
  previousUrls = history[0];
//   console.log("previousUrls in onMount (single history):", previousUrls);
} else {
  previousUrls = '/feedback';  
}
      prev.set(previousUrls);
    });
    return () => unsubscribe();
  });

</script>
    <Feedback {data}/>