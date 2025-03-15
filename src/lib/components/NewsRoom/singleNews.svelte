<script>
    export let data;
    import Icon from "@iconify/svelte";
    const { singleNewsData } = data;  // Extract single news data
    console.log(singleNewsData);
    let isExpanded = false;
    function truncateText(text, wordLimit) {
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  }
  function toggleExpand() {
    isExpanded = !isExpanded;
  }
    
    const formatText = (text) => {
      return text.split('\n').map(item => item + "<br>").join('');
    };
  </script>
<div class="mx-auto w-11/12 mb-10 text-justify">
      <div class="overflow-hidden mb-8 p-7 bg-white rounded-md shadow">
        <div class="mb-4">
          <h2 class="text-3xl font-semibold text-gray-800">{singleNewsData.title}</h2>
          <p class="text-sm text-gray-500 mt-2">
            {new Date(singleNewsData.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <hr class="my-4">
        <div class="flex sm:flex-row flex-col items-center sm:space-x-8 mt-4">
          <div class="sm:w-2/3 w-full">
              <p class="lg:text-sm md:text-sm sm:text-xs text-gray-600">
                {#if isExpanded}
                  {singleNewsData.previewText}
                {:else}
                  {truncateText(singleNewsData.previewText, 100)} 
                {/if}
              </p>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <p
            class="text-primary-500 cursor-pointer hover:underline underline-offset-2 mt-2 text-sm"
            on:click={toggleExpand}>
            {isExpanded ? "Read less" : "Read more"}
          </p>
          </div>
          <div class="sm:w-1/3 w-full h-60">
            <img src={singleNewsData.image} alt="Blog Post" class="rounded-lg w-full h-full object-cover" />
          </div>
        </div>
        <p class="text-gray-700 xl:text-xl md:text-lg sm:text-md font-semibold mt-2">About Chemikart</p>
        <p class="text-gray-500 xl:text-sm md:text-sm sm:text-xs mt-2">At Chemikart, our misssion is to provide high-quality chemical products with unparalleled service. We aim to be the trusted partner for industries by delivering reliable solutions that meet our customers' needs efficiently and safely.We envision a world where business thrive with access to premium chemical products and services. Our goal is to be the leading distributor in the chemical industry, know for our commitment to excellence and innovation.Our knowledgeable team can assist you in selecting the right products for your applications.we pride ourseleves on our consistent supply chain and timely deliveries.We offer tailored solutions to meet the specific requirements of our clients. <a href="https://chemikart.partskeys.com/" class="font-semibold ml-1 hover:underline hover:text-primary-600 text-primary-500">Chemikart.com</a> and on 
          <a href="https://www.facebook.com/chemikart" class="font-semibold hover:underline  hover:text-primary-600  ml-1 text-primary-500">Facebook,</a><a href="https://x.com/chemikart" class="font-semibold ml-1 hover:underline hover:text-primary-600 text-primary-500">Twitter,</a><a href="https://www.instagram.com/chemikart/" class="font-semibold ml-1 hover:underline hover:text-primary-600 text-primary-500">Instagram,</a>&nbsp; and<a href="https://www.linkedin.com/chemikart?_l=en_US" class="font-semibold ml-1 hover:underline hover:text-primary-600 text-primary-500">LinkedIn</a>.
        </p>
        <!-- <div class="mt-8">
          <a href="/newsroom" class="text-primary-500 hover:underline  hover:text-primary-600 text-sm" > <Icon icon="mdi:arrow-left" />Back to News</a>
        </div> -->
        
          <a
          href="/newsroom"
  class="text-semibold text-primary-500 hover:text-primary-600 hover:underline  items-center gap-1 mt-8 inline-flex px-1 py-1"
>
  <Icon icon="mdi:arrow-left" class="text-xl" />
  <span>Back to Newsroom</span>
</a>
        
      
      </div> 
</div>