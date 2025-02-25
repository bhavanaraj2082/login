<script>
    import Favourites from '$lib/components/Favourites.svelte';
    export let data;
    // console.log("FavPagedata=>>",data)
</script>

<div class="bg-gray-50">
    <Favourites {data}/>
</div>