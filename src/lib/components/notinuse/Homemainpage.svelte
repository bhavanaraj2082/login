<script>
    import Herosection from "$lib/components/Homepagecomponents/Herosection.svelte";
    import Cards from "$lib/components/Homepagecomponents/Cards.svelte";
    import Youtubecomponent from "$lib/components/Homepagecomponents/Youtubecomponent.svelte";
    import Upcomimgevent from "$lib/components/Homepagecomponents/Upcomimgevent.svelte";
    import Catolog from "$lib/components/Homepagecomponents/catolog.svelte";
    import Bulkorder from "$lib/components/Homepagecomponents/Bulkorder.svelte";
</script>

<div>
    <Herosection />
    <Cards />
    <Youtubecomponent />
    <div class="flex flex-wrap gap-2 p-2 justify-evenly">
        <Upcomimgevent />
        <Catolog />
        <Bulkorder />
    </div>
</div>
