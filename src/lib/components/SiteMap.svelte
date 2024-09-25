<script>
  import data from '../data/Sub_links.json'; 
  const sections = data.sections; 
  function navigateTo(url)
  {
  return window.location.href=`/${url}`;
  }
  function sortLinks(links) {
    return links.sort((a, b) => a.word.localeCompare(b.word));
  }
</script>
<div class="bg-gray-200">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    {#each sections as section}
      <div class="m-4 text-cyan-900 font-sans">
        <h2 class="text-xl font-extrabold mb-1">
          <button  on:click={()=>{navigateTo(section.titleUrl)}}>
            {section.title}
          </button>
        </h2>
        <ul>
          {#each sortLinks(section.links) as link}
            <li>
              <button class={link.word === 'About Us' || link.word === 'Quality' || link.word === 'Bulk Order' || link.word === 'Structure Search' ? 'text-xl font-extrabold mb-2' : ''}  on:click={()=>{navigateTo(link.url)}} >
                {link.word}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</div>
