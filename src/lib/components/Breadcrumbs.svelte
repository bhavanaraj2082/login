<script>
    import { page } from '$app/stores';
    import Icon from '@iconify/svelte';
    let crumbs = [];
    
    $: {
    // FOR STORYBOOK TESTING ONLY USE THIS STATIC URL LINE
    const tokens = '/category/subcategory/products/example_product1'.split('/').filter(t => t !== ''); 

    // FOR DYNAMIC BREADCUMBS URL UNCOMMENT BELOW LINE
    // const tokens = $page.url.pathname.split('/').filter(t => t !== '');

    let tokenPath = '';

    crumbs = [];
        if (tokens.length > 0) {
            crumbs.push({ label: 'Home', href: '/' });
            tokens.forEach((t, index) => {
                tokenPath += '/' + t;
                const label = t.charAt(0).toUpperCase() + t.slice(1);
                crumbs.push({
                    label,
                    href: tokenPath
                });
            });

            if (crumbs.length > 1) {
                crumbs[1].label = tokens[0] ? tokens[0].charAt(0).toUpperCase() + tokens[0].slice(1) : ''; // First token after Home
            }
            if (crumbs.length > 2) {
                crumbs[2].label = tokens[1] ? tokens[1].charAt(0).toUpperCase() + tokens[1].slice(1) : ''; // Second token after Home
            }
        }
    }
</script>

{#if crumbs.length > 0}
<main class="w-full bg-gray-50 py-3 px-5">
    <div class="flex flex-wrap items-center space-x-0">
        {#if crumbs.length === 1}
            <span class="text-gray-600 font-semibold text-sm">{crumbs[0].label}</span>
        {:else}
            <div class="flex flex-wrap items-center">
                <Icon icon="ion:home" class="mx-2 text-sm" />
                {#each crumbs.slice(0, -1) as c}
                    <a href={c.href} class="text-gray-700 text-sm hover:text-blue-600 transition-colors">{c.label}</a>
                    <Icon icon="system-uicons:chevron-right-double" class="mx-2" />
                {/each}
                <span class="text-gray-600 font-semibold text-sm">{crumbs[crumbs.length - 1].label}</span>
            </div>
            <!-- if want to show only last breadcrump in mobile devices  -->
        
            <!-- <div class="sm:hidden flex items-center space-x-1">
                <Icon icon="system-uicons:chevron-right-double" class="mx-2 " />
                <span class="text-gray-600 font-semibold text-sm">{crumbs[crumbs.length - 1].label}</span>
            </div> -->
        {/if}
    </div>
</main>
{/if}




