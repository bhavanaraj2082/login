 <script>
    import { PUBLIC_WEBSITE_URL } from '$env/static/public';
    import { onMount } from 'svelte';
    
    export let footerData;
    let visible = false;
    let screenSize = 'large';
    
    const calculateScreenSize = () => {
      if (typeof window === 'undefined') return 'large';
      
      const width = window.innerWidth;
      if (width >= 1440) return 'xlarge';
      if (width >= 1024) return 'large';
      if (width >= 768) return 'medium';
      return 'small';
    };
    
    const getItemsPerRow = (size) => {
      switch (size) {
        case 'xlarge': return 10;
        case 'large': return 8;
        case 'medium': return 4;
        default: return 2;
      }
    };
  
    const createBrickLayout = (size) => {
      if (!footerData || footerData.length === 0) return [];
  
      if (size === 'small') {
        return [footerData];
      }
      
      const itemsPerRow = getItemsPerRow(size);
      const rows = [];
  
      for (let i = 0; i < footerData.length; i += itemsPerRow) {
        const rowItems = footerData.slice(i, Math.min(i + itemsPerRow, footerData.length));
        const rowIndex = Math.floor(i / itemsPerRow);
        
        rows.push({
          items: rowItems,
          isOffset: rowIndex % 2 === 1,
          rowIndex
        });
      }
      
      return rows;
    };
    
    let rows = [];
  
    const handleResize = () => {
      const newSize = calculateScreenSize();
      if (newSize !== screenSize) {
        screenSize = newSize;
        rows = createBrickLayout(screenSize);
      }
    };
    
    onMount(() => {
  
      screenSize = calculateScreenSize();
      rows = createBrickLayout(screenSize);
      setTimeout(() => { visible = true; }, 100);
  
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }
    });
  </script>
  
  <section class="bg-primary-50 pt-4 pb-8">
    <div class="max-w-7xl w-11/12 mx-auto px-4">
      {#if rows.length > 0}
        {#if screenSize === 'small'}
          <div class="grid grid-cols-2 gap-2">
            {#each rows[0] as item, itemIndex}
              <div 
                class="transform transition-all duration-500 opacity-0 translate-y-4 px-1 h-6 flex items-center justify-center border-x border-primary-800/20"
                class:opacity-100={visible} 
                class:translate-y-0={visible}
                style={`transition-delay: ${itemIndex * 0.05}s`}>
                <a
                  href="{PUBLIC_WEBSITE_URL}{item.link}"
                  class="text-primary-600 text-2s w-full text-center px-1 py-0.5 block overflow-hidden whitespace-nowrap text-ellipsis transition-all duration-300 relative"
                  target="_blank">
                  {item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}
                </a>
              </div>
            {/each}
          </div>
        {:else}
          <div class="flex flex-col gap-1">
            {#each rows as row}
              <div class={`flex gap-1 ${row.isOffset ? 'ml-8' : ''}`}>
                {#each row.items as item, itemIndex}
                  {@const itemsPerRow = getItemsPerRow(screenSize)}
                  {@const brickWidth = `calc(${100 / itemsPerRow}% - ${4}px)`}
                  <div 
                    class="transform transition-all border-x duration-500 opacity-0 hover:-translate-y-1 h-5 flex items-center justify-center border-primary-800/20"
                    class:opacity-100={visible} 
                    class:translate-y-0={visible}
                    style={`
                      transition-delay: ${(row.rowIndex * 0.1 + itemIndex * 0.05)}s; 
                      width: ${brickWidth};
                    `}>
                    <a
                      href="{PUBLIC_WEBSITE_URL}{item.link}"
                      class="text-primary-600 text-2s w-full text-center px-2 py-1 block overflow-hidden whitespace-nowrap text-ellipsis transition-transform  hover:underline underline-offset-2 duration-300"
                      target="_blank">
                      {item.name.length > 30 ? item.name.slice(0, 30) + "..." : item.name}
                    </a>
                  </div>
                {/each}
                {#if row.items.length < getItemsPerRow(screenSize)}
                  {#each Array(getItemsPerRow(screenSize) - row.items.length) as _}
                    {@const itemsPerRow = getItemsPerRow(screenSize)}
                    {@const brickWidth = `calc(${100 / itemsPerRow}% - ${4}px)`}
                    <div style={`width: ${brickWidth};`}></div>
                  {/each}
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </div>
  </section>