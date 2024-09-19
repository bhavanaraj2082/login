<script>
    import Herosection from "./Homepagecomponents/Herosection.svelte";
    import Cards from "./Homepagecomponents/Cards.svelte";
    import Youtubecomponent from "./Homepagecomponents/Youtubecomponent.svelte";
    import Upcomimgevent from "./Homepagecomponents/Upcomimgevent.svelte";
    import Catolog from "./Homepagecomponents/catolog.svelte";
    import Bulkorder from "./Homepagecomponents/Bulkorder.svelte";
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
