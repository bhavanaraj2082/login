<script>
    import images from '../../data/images.json';
    
    let index = 0;

    function handleThumbnailClick(selectedIndex) {
        index = selectedIndex;
    }
</script>

<div class="flex justify-center items-center p-4">
    <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 max-w-screen-lg w-full">
        <div class="relative w-full lg:flex-1">
            <img src="{images[index].src}" alt="{images[index].alt}" class="w-full h-full object-cover rounded-lg"/>
            <div class="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-4 md:p-6 shadow-md max-w-md z-10">
                <h2 class="text-lg md:text-2xl font-bold mb-4">{images[index].title}</h2>
                <p class="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">{images[index].description}</p>
                
                <a href="#" class="bg-green-500 text-white text-sm md:text-lg font-bold py-2 px-4 md:py-2.5 md:px-5 rounded-full inline-block no-underline hover:opacity-80 transition-opacity">Explore now →</a>
            </div>
        </div>

        <div class="flex flex-col w-full lg:w-60 space-y-3">
            <div class="bg-transparent flex flex-col gap-1">
                {#each images as image, i}
                    <button 
                        type="button" 
                        class={`bg-white p-4 shadow-md cursor-pointer transition-transform ${index === i ? 'border-l-8 border-green-500' : 'border-none'}`}
                        on:click={() => handleThumbnailClick(i)} 
                    >
                        <h3 class="text-base md:text-lg font-bold">{image.title}</h3>
                        <p class="text-gray-500 text-xs md:text-sm overflow-hidden" style="max-height: 3rem; line-height: 1.5rem;">
                            {image.description}
                        </p>
                    </button>
                {/each}
            </div>
        </div>
    </div>
</div>
